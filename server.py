from bottle import Bottle, request, response, run
import pg8000.native
import json
import os

app = Bottle()

# CORS 설정
@app.hook('after_request')
def enable_cors():
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Authorization, Origin, Accept, Content-Type, X-Requested-With'

def get_db():
    return pg8000.native.Connection(
        user=os.getenv("PGUSER", "u0_a33"),
        database="footpulse",
        unix_sock="/data/data/com.termux/files/usr/tmp/.s.PGSQL.5432"
    )

@app.route('/')
def root():
    response.content_type = 'application/json'
    return json.dumps({
        "service": "FootPulse Edge API",
        "node": "Samsung Galaxy S21 Ultra (Termux)",
        "engine": "PostgreSQL 18.2 + Bottle",
        "status": "online"
    })

@app.route('/api/clubs')
def get_clubs():
    response.content_type = 'application/json; charset=utf-8'
    q = request.query.get('q', '').strip()
    
    conn = get_db()
    try:
        if q:
            sql = """
                SELECT id, name_ko, name_en, aliases, league, country, logo_url
                FROM clubs
                WHERE name_ko ILIKE :term 
                   OR name_en ILIKE :term 
                   OR :raw = ANY(aliases)
                LIMIT 20;
            """
            rows = conn.run(sql, term=f"%{q}%", raw=q)
        else:
            sql = """
                SELECT id, name_ko, name_en, aliases, league, country, logo_url
                FROM clubs
                ORDER BY country, league, name_ko
                LIMIT 150;
            """
            rows = conn.run(sql)
            
        columns = [c['name'] for c in conn.columns]
        result = [dict(zip(columns, row)) for row in rows]
        return json.dumps(result, ensure_ascii=False)
    finally:
        conn.close()

@app.route('/api/feed')
def get_feed():
    response.content_type = 'application/json; charset=utf-8'
    clubs_param = request.query.get('clubs', '').strip()
    lang = request.query.get('lang', 'ko')
    limit = int(request.query.get('limit', 20))
    offset = int(request.query.get('offset', 0))

    club_list = [c.strip().upper() for c in clubs_param.split(',') if c.strip()] if clubs_param else []

    conn = get_db()
    try:
        if club_list:
            sql = """
                SELECT 
                    a.id, a.source_name, a.source_url, a.tier, 
                    a.transfer_status, a.player_name, a.published_at,
                    COALESCE(t.title_translated, '번역 대기 중') AS title,
                    COALESCE(t.summary_translated, '요약문 생성 중') AS summary,
                    (
                        SELECT json_agg(json_build_object(
                            'club_id', c.id, 
                            'name_ko', c.name_ko, 
                            'name_en', c.name_en, 
                            'role', ac.club_role
                        ))
                        FROM article_clubs ac
                        JOIN clubs c ON ac.club_id = c.id
                        WHERE ac.article_id = a.id
                    ) AS mentioned_clubs
                FROM articles a
                LEFT JOIN article_translations t 
                    ON a.id = t.article_id AND t.target_lang = :lang
                WHERE a.id IN (
                    SELECT article_id 
                    FROM article_clubs 
                    WHERE club_id = ANY(:clubs)
                )
                ORDER BY a.published_at DESC
                LIMIT :limit OFFSET :offset;
            """
            rows = conn.run(sql, lang=lang, clubs=club_list, limit=limit, offset=offset)
        else:
            sql = """
                SELECT 
                    a.id, a.source_name, a.source_url, a.tier, 
                    a.transfer_status, a.player_name, a.published_at,
                    COALESCE(t.title_translated, '번역 대기 중') AS title,
                    COALESCE(t.summary_translated, '요약문 생성 중') AS summary,
                    (
                        SELECT json_agg(json_build_object(
                            'club_id', c.id, 
                            'name_ko', c.name_ko, 
                            'name_en', c.name_en, 
                            'role', ac.club_role
                        ))
                        FROM article_clubs ac
                        JOIN clubs c ON ac.club_id = c.id
                        WHERE ac.article_id = a.id
                    ) AS mentioned_clubs
                FROM articles a
                LEFT JOIN article_translations t 
                    ON a.id = t.article_id AND t.target_lang = :lang
                ORDER BY a.published_at DESC
                LIMIT :limit OFFSET :offset;
            """
            rows = conn.run(sql, lang=lang, limit=limit, offset=offset)

        columns = [c['name'] for c in conn.columns]
        result = []
        for row in rows:
            d = dict(zip(columns, row))
            if 'id' in d and d['id'] is not None:
                d['id'] = str(d['id'])
            if 'published_at' in d and d['published_at'] is not None:
                d['published_at'] = str(d['published_at'])
            if 'mentioned_clubs' in d and isinstance(d['mentioned_clubs'], str):
                try:
                    d['mentioned_clubs'] = json.loads(d['mentioned_clubs'])
                except:
                    pass
            result.append(d)
        return json.dumps(result, ensure_ascii=False)
    finally:
        conn.close()

if __name__ == '__main__':
    print("FootPulse Edge API Server running on port 8000...")
    run(app, host='0.0.0.0', port=8000, server='wsgiref')
