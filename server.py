from bottle import Bottle, request, response, run
import pg8000.native
import json
import os
import urllib.request
import urllib.parse
import html
import re
import sys
import time
import hashlib

sys.path.append("/sdcard/Download")
import ingestion

# IP 기반 도배 방지 인메모리 테이블 (10초 쿨다운)
RATE_LIMITS = {}

def get_client_ip():
    return (
        request.headers.get('CF-Connecting-IP') or
        request.headers.get('X-Forwarded-For', '').split(',')[0].strip() or
        request.remote_addr or
        'unknown'
    )

def check_rate_limit(client_ip: str, action: str = "comment", limit_sec: int = 10) -> bool:
    """해당 IP의 마지막 요청이 limit_sec 이내이면 False(차단), 초과 시 True(허용)"""
    now = time.time()
    key = f"{client_ip}:{action}"
    last_time = RATE_LIMITS.get(key, 0)
    if len(RATE_LIMITS) > 1000:
        for k in list(RATE_LIMITS.keys()):
            if now - RATE_LIMITS[k] > 300:
                del RATE_LIMITS[k]
    if now - last_time < limit_sec:
        return False
    RATE_LIMITS[key] = now
    return True

app = Bottle()

# CORS 설정
@app.hook('after_request')
def enable_cors():
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Authorization, Origin, Accept, Content-Type, X-Requested-With'

@app.route('/<:re:.*>', method='OPTIONS')
def handle_options():
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Authorization, Origin, Accept, Content-Type, X-Requested-With'
    return {}

def get_db():
    return pg8000.native.Connection(
        user=os.getenv("PGUSER", "u0_a33"),
        database="footpulse",
        unix_sock="/data/data/com.termux/files/usr/tmp/.s.PGSQL.5432"
    )

def clean_text(raw_text: str) -> str:
    if not raw_text:
        return ""
    text = html.unescape(raw_text)
    text = re.sub(r'<[^>]+>', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()

def translate_comment(text: str, target_lang: str) -> str:
    try:
        url = f"https://api.mymemory.translated.net/get?q={urllib.parse.quote(text[:250])}&langpair=auto|{target_lang}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 FootPulse/3.2'})
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            trans = data.get("responseData", {}).get("translatedText", "")
            if trans and "MYMEMORY WARNING" not in trans:
                return clean_text(trans)
    except:
        pass
    return text

def get_top_featured_quote(comments: list):
    """실제 수집된 현지 반응 중 추천수(upvotes) 1위 코멘트를 인용구로 선정 (가짜 AI 요약 배제)"""
    if not comments:
        return None
    sorted_comments = sorted(comments, key=lambda x: x.get('upvotes', 0), reverse=True)
    top = sorted_comments[0]
    return {
        "text": top.get('translated_text') or top.get('original_text', ''),
        "original_text": top.get('original_text', ''),
        "author": top.get('author_name', '현지 팬'),
        "platform": top.get('platform', 'Reddit'),
        "upvotes": top.get('upvotes', 0)
    }

@app.route('/')
def root():
    response.content_type = 'application/json'
    return json.dumps({
        "service": "Football Disputatio (FootDi) Intelligence Hub API",
        "node": "Samsung Galaxy S21 Ultra (Termux)",
        "engine": "PostgreSQL 18.2 + Bottle",
        "status": "online"
    })

# 1. 트렌딩 선수 랭킹 목록 API
@app.route('/api/players/trending')
def get_trending_players():
    response.content_type = 'application/json; charset=utf-8'
    limit = int(request.query.get('limit', 15))
    conn = get_db()
    try:
        sql = """
            SELECT id, name_ko, name_en, aliases, current_club_id, current_club_name, nationality, nationality_code, position, photo_url, trend_score
            FROM players
            ORDER BY trend_score DESC, name_ko ASC
            LIMIT :limit;
        """
        rows = conn.run(sql, limit=limit)
        columns = [c['name'] for c in conn.columns]
        result = [dict(zip(columns, row)) for row in rows]
        return json.dumps(result, ensure_ascii=False)
    finally:
        conn.close()

# 2. 선수 검색 및 온디맨드 자동 등록 API
@app.route('/api/players/search')
@app.route('/api/players')
def search_players():
    response.content_type = 'application/json; charset=utf-8'
    q = request.query.get('q', '').strip()
    conn = get_db()
    try:
        if q:
            sql = """
                SELECT id, name_ko, name_en, aliases, current_club_id, current_club_name, nationality, nationality_code, position, photo_url, trend_score
                FROM players
                WHERE name_ko ILIKE :term 
                   OR name_en ILIKE :term 
                   OR current_club_name ILIKE :term
                   OR :raw = ANY(aliases)
                ORDER BY trend_score DESC, name_ko ASC
                LIMIT 20;
            """
            rows = conn.run(sql, term=f"%{q}%", raw=q)
            
            if not rows and len(q) >= 3:
                registered = ingestion.search_and_register_player(conn, q)
                if registered:
                    rows = conn.run(sql, term=f"%{registered['name_en']}%", raw=registered['name_en'])
        else:
            sql = """
                SELECT id, name_ko, name_en, aliases, current_club_id, current_club_name, nationality, nationality_code, position, photo_url, trend_score
                FROM players
                ORDER BY trend_score DESC, name_ko ASC
                LIMIT 30;
            """
            rows = conn.run(sql)
            
        columns = [c['name'] for c in conn.columns]
        result = [dict(zip(columns, row)) for row in rows]
        return json.dumps(result, ensure_ascii=False)
    finally:
        conn.close()

# 3. 선수 상세 프로필 API
@app.route('/api/players/<player_id>')
def get_player_detail(player_id):
    response.content_type = 'application/json; charset=utf-8'
    conn = get_db()
    try:
        sql = """
            SELECT id, name_ko, name_en, aliases, current_club_id, current_club_name, nationality, nationality_code, position, photo_url, trend_score
            FROM players
            WHERE id = :pid;
        """
        rows = conn.run(sql, pid=player_id)
        if not rows:
            response.status = 404
            return json.dumps({"error": "Player not found"})
        columns = [c['name'] for c in conn.columns]
        return json.dumps(dict(zip(columns, rows[0])), ensure_ascii=False)
    finally:
        conn.close()

# 4. [탭 1] 뉴스 & 이적 피드 API
@app.route('/api/players/<player_id>/feed')
def get_player_feed(player_id):
    response.content_type = 'application/json; charset=utf-8'
    lang = request.query.get('lang', 'ko').strip().lower()
    limit = int(request.query.get('limit', 20))
    offset = int(request.query.get('offset', 0))

    conn = get_db()
    try:
        sql = """
            SELECT 
                a.id, a.source_name, a.source_url, a.tier, a.transfer_status, a.published_at,
                COALESCE(t_target.title_translated, t_en.title_translated, t_ko.title_translated, 'Football Update') AS title,
                COALESCE(t_target.summary_translated, t_en.summary_translated, t_ko.summary_translated, 'Recent match and transfer report.') AS summary
            FROM articles a
            JOIN article_players ap ON a.id = ap.article_id AND ap.player_id = :pid
            LEFT JOIN article_translations t_target ON a.id = t_target.article_id AND t_target.target_lang = :lang
            LEFT JOIN article_translations t_en ON a.id = t_en.article_id AND t_en.target_lang = 'en'
            LEFT JOIN article_translations t_ko ON a.id = t_ko.article_id AND t_ko.target_lang = 'ko'
            ORDER BY a.published_at DESC
            LIMIT :limit OFFSET :offset;
        """
        rows = conn.run(sql, pid=player_id, lang=lang, limit=limit, offset=offset)
        
        if len(rows) < 2:
            sql_fallback = """
                SELECT 
                    a.id, a.source_name, a.source_url, a.tier, a.transfer_status, a.published_at,
                    COALESCE(t_target.title_translated, t_en.title_translated, t_ko.title_translated, 'Football Update') AS title,
                    COALESCE(t_target.summary_translated, t_en.summary_translated, t_ko.summary_translated, 'Recent match and transfer report.') AS summary
                FROM articles a
                LEFT JOIN article_translations t_target ON a.id = t_target.article_id AND t_target.target_lang = :lang
                LEFT JOIN article_translations t_en ON a.id = t_en.article_id AND t_en.target_lang = 'en'
                LEFT JOIN article_translations t_ko ON a.id = t_ko.article_id AND t_ko.target_lang = 'ko'
                ORDER BY a.published_at DESC
                LIMIT :limit OFFSET :offset;
            """
            rows = conn.run(sql_fallback, lang=lang, limit=limit, offset=offset)

        columns = [c['name'] for c in conn.columns]
        result = []
        for row in rows:
            d = dict(zip(columns, row))
            if 'id' in d and d['id']:
                d['id'] = str(d['id'])
            if 'published_at' in d and d['published_at']:
                d['published_at'] = str(d['published_at'])
            result.append(d)
        return json.dumps(result, ensure_ascii=False)
    finally:
        conn.close()

# 5. [탭 2] 해외 핫 반응 (Reddit, X) 전용 API
@app.route('/api/players/<player_id>/reactions')
def get_player_reactions(player_id):
    response.content_type = 'application/json; charset=utf-8'
    conn = get_db()
    try:
        # 선수 이름 획득
        p_row = conn.run("SELECT name_ko, name_en FROM players WHERE id = :pid", pid=player_id)
        p_name = p_row[0][0] if p_row else player_id

        sql = """
            SELECT id, platform, author_name, original_text, translated_text, upvotes, created_at
            FROM external_reactions
            WHERE player_id = :pid
            ORDER BY upvotes DESC;
        """
        rows = conn.run(sql, pid=player_id)
        columns = [c['name'] for c in conn.columns]
        reactions = []
        for row in rows:
            d = dict(zip(columns, row))
            if 'id' in d and d['id']:
                d['id'] = str(d['id'])
            if 'created_at' in d and d['created_at']:
                d['created_at'] = str(d['created_at'])
            reactions.append(d)

        # 실제 최다 추천 댓글을 베스트 토론 인용구로 선정 (AI 슬롭 배제)
        featured_quote = get_top_featured_quote(reactions)

        return json.dumps({
            "reactions": reactions,
            "featured_quote": featured_quote,
            "count": len(reactions)
        }, ensure_ascii=False)
    finally:
        conn.close()

# 6. [탭 3] 글로벌 토크 자체 댓글 목록 API
@app.route('/api/players/<player_id>/comments')
def get_player_comments(player_id):
    response.content_type = 'application/json; charset=utf-8'
    lang = request.query.get('lang', 'ko').strip().lower()
    conn = get_db()
    try:
        sql = """
            SELECT 
                c.id, c.player_id, c.author_name, c.author_country, c.source_lang, c.original_text, c.likes_count, c.created_at,
                c.parent_id, (c.password_hash IS NOT NULL) AS has_password,
                t.translated_text
            FROM site_comments c
            LEFT JOIN site_comment_translations t 
                ON c.id = t.comment_id AND t.target_lang = :lang
            WHERE c.player_id = :pid
            ORDER BY c.created_at ASC;
        """
        rows = conn.run(sql, pid=player_id, lang=lang)
        columns = [c['name'] for c in conn.columns]
        
        # 1차 매핑 및 번역 처리
        all_items = []
        for row in rows:
            d = dict(zip(columns, row))
            cid = str(d['id'])
            d['id'] = cid
            if d.get('parent_id'):
                d['parent_id'] = str(d['parent_id'])
            else:
                d['parent_id'] = None
            if 'created_at' in d and d['created_at']:
                d['created_at'] = str(d['created_at'])
                
            source_lang = d.get('source_lang', 'en')
            original = d.get('original_text', '')
            cached_trans = d.get('translated_text')

            if source_lang == lang:
                d['display_text'] = original
                d['is_translated'] = False
            elif cached_trans:
                d['display_text'] = cached_trans
                d['is_translated'] = True
            else:
                new_trans = translate_comment(original, lang)
                try:
                    conn.run("""
                        INSERT INTO site_comment_translations (comment_id, target_lang, translated_text)
                        VALUES (:cid, :lang, :trans)
                        ON CONFLICT (comment_id, target_lang) DO UPDATE
                        SET translated_text = EXCLUDED.translated_text;
                    """, cid=cid, lang=lang, trans=new_trans)
                except:
                    pass
                d['display_text'] = new_trans
                d['is_translated'] = True

            d['replies'] = []
            all_items.append(d)

        # 2차 계층형 트리 구성 (원댓글 최신순, 대댓글은 등록순 정렬)
        parents = {}
        children = []
        for item in all_items:
            if not item['parent_id']:
                parents[item['id']] = item
            else:
                children.append(item)

        for child in children:
            pid = child['parent_id']
            if pid in parents:
                parents[pid]['replies'].append(child)

        sorted_comments = list(reversed(list(parents.values())))
        return json.dumps({
            "comments": sorted_comments,
            "count": len(all_items)
        }, ensure_ascii=False)
    finally:
        conn.close()

# 7. [탭 3] 글로벌 토크 댓글 & 대댓글 작성 API
@app.route('/api/players/<player_id>/comments', method='POST')
def post_player_comment(player_id):
    response.content_type = 'application/json; charset=utf-8'
    try:
        body = request.json or {}
    except:
        body = {}

    author_name = body.get('author_name', '익명 팬').strip()
    author_country = body.get('author_country', 'KR').strip().upper()
    source_lang = body.get('source_lang', 'ko').strip().lower()
    text = clean_text(body.get('text', ''))
    parent_id = body.get('parent_id')
    password = str(body.get('password', '')).strip()

    if not text:
        response.status = 400
        return json.dumps({"error": "Content is required"})

    # 비밀번호 4자리 SHA-256 해싱
    pwd_hash = hashlib.sha256(password.encode('utf-8')).hexdigest() if password else None
    valid_parent_id = str(parent_id).strip() if parent_id and str(parent_id).strip() else None

    # IP 기반 10초 도배 방지 쿨다운 검사
    client_ip = get_client_ip()
    if not check_rate_limit(client_ip, action="comment", limit_sec=10):
        response.status = 429
        return json.dumps({
            "error": "도배 방지를 위해 10초 후에 다시 작성하실 수 있습니다.",
            "retry_after": 10
        }, ensure_ascii=False)

    conn = get_db()
    try:
        res = conn.run("""
            INSERT INTO site_comments (player_id, author_name, author_country, source_lang, original_text, parent_id, password_hash)
            VALUES (:pid, :name, :country, :lang, :text, :parent, :pwd)
            RETURNING id, created_at;
        """, pid=player_id, name=author_name, country=author_country, lang=source_lang, text=text, parent=valid_parent_id, pwd=pwd_hash)
        
        new_id = str(res[0][0])
        created_at = str(res[0][1])

        return json.dumps({
            "success": True,
            "id": new_id,
            "player_id": player_id,
            "author_name": author_name,
            "author_country": author_country,
            "source_lang": source_lang,
            "original_text": text,
            "display_text": text,
            "parent_id": valid_parent_id,
            "has_password": bool(pwd_hash),
            "likes_count": 0,
            "replies": [],
            "created_at": created_at
        }, ensure_ascii=False)
    finally:
        conn.close()

# 8. 댓글 좋아요 API
@app.route('/api/comments/<comment_id>/like', method='POST')
def like_comment(comment_id):
    response.content_type = 'application/json; charset=utf-8'
    conn = get_db()
    try:
        res = conn.run("""
            UPDATE site_comments
            SET likes_count = likes_count + 1
            WHERE id = :cid
            RETURNING likes_count;
        """, cid=comment_id)
        count = res[0][0] if res else 0
        return json.dumps({"success": True, "likes_count": count})
    finally:
        conn.close()

# 9. 댓글 & 대댓글 자가 삭제 API (비밀번호 검증 또는 로컬스토리지 소유권 인증)
@app.route('/api/comments/<comment_id>', method=['DELETE', 'POST'])
def delete_comment(comment_id):
    response.content_type = 'application/json; charset=utf-8'
    try:
        body = request.json or {}
    except:
        body = {}

    pwd = str(body.get('password', '')).strip()
    force = body.get('force', False)
    
    conn = get_db()
    try:
        rows = conn.run("SELECT id, password_hash FROM site_comments WHERE id = :cid;", cid=comment_id)
        if not rows:
            response.status = 404
            return json.dumps({"error": "삭제할 댓글을 찾을 수 없습니다."}, ensure_ascii=False)
        
        stored_hash = rows[0][1]
        if stored_hash:
            hashed_input = hashlib.sha256(pwd.encode('utf-8')).hexdigest()
            if hashed_input != stored_hash and not force:
                response.status = 403
                return json.dumps({"error": "비밀번호가 일치하지 않습니다."}, ensure_ascii=False)
        
        # 삭제 실행 (CASCADE로 하위 대댓글도 함께 삭제)
        conn.run("DELETE FROM site_comments WHERE id = :cid;", cid=comment_id)
        return json.dumps({"success": True, "deleted_id": comment_id}, ensure_ascii=False)
    finally:
        conn.close()

if __name__ == '__main__':
    print("FootPulse v3.2 Server starting on port 8000...")
    run(app, host='0.0.0.0', port=8000, server='wsgiref')
