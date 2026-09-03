from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import asyncpg
import os

app = FastAPI(title="FootPulse API", version="1.0.0")

# CORS 허용 (Next.js Vercel 프론트엔드 연동)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost:5432/footpulse")
db_pool: Optional[asyncpg.Pool] = None

@app.on_event("startup")
async def startup():
    global db_pool
    try:
        db_pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
        print("Database connection pool established.")
    except Exception as e:
        print(f"Warning: Failed to connect to DB: {e}")

@app.on_event("shutdown")
async def shutdown():
    global db_pool
    if db_pool:
        await db_pool.close()

@app.get("/")
async def root():
    return {
        "service": "FootPulse Edge API",
        "node": "Samsung Galaxy S21 Ultra (Exynos 2100 / Termux)",
        "status": "online"
    }

@app.get("/api/clubs")
async def get_clubs(q: Optional[str] = Query(None, description="구단 검색어 (한글, 영문, 약칭)")):
    """구단 마스터 목록 및 자동완성 검색"""
    if not db_pool:
        raise HTTPException(status_code=503, detail="Database not ready")
    
    async with db_pool.acquire() as conn:
        if q:
            q_clean = q.strip()
            # 초성, 별칭(aliases GIN), 한글명, 영문명 포괄 검색
            rows = await conn.fetch("""
                SELECT id, name_ko, name_en, aliases, league, country, logo_url
                FROM clubs
                WHERE name_ko ILIKE $1 
                   OR name_en ILIKE $1 
                   OR $2 = ANY(aliases)
                LIMIT 20;
            """, f"%{q_clean}%", q_clean)
        else:
            rows = await conn.fetch("""
                SELECT id, name_ko, name_en, aliases, league, country, logo_url
                FROM clubs
                ORDER BY country, league, name_ko
                LIMIT 150;
            """)
        return [dict(r) for r in rows]

@app.get("/api/feed")
async def get_feed(
    clubs: Optional[str] = Query(None, description="구단 ID 콤마 구분 (예: BAR,MCI)"),
    lang: str = Query("ko", description="선택 언어 코드 (ko, en, es, ja)"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """
    [핵심] M:N 구단 교차 필터링 무한 스크롤 피드
    특정 구단들을 선택하면 해당 구단이 하나라도 포함된 모든 기사가 최신순으로 중복 없이 반환됩니다.
    """
    if not db_pool:
        raise HTTPException(status_code=503, detail="Database not ready")

    club_list = [c.strip().upper() for c in clubs.split(",") if c.strip()] if clubs else []

    async with db_pool.acquire() as conn:
        if club_list:
            # 교차 필터링: 선택된 구단 중 하나라도 매핑된 기사 추출
            query = """
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
                    ON a.id = t.article_id AND t.target_lang = $1
                WHERE a.id IN (
                    SELECT article_id 
                    FROM article_clubs 
                    WHERE club_id = ANY($2::varchar[])
                )
                ORDER BY a.published_at DESC
                LIMIT $3 OFFSET $4;
            """
            rows = await conn.fetch(query, lang, club_list, limit, offset)
        else:
            # 전체 피드
            query = """
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
                    ON a.id = t.article_id AND t.target_lang = $1
                ORDER BY a.published_at DESC
                LIMIT $2 OFFSET $3;
            """
            rows = await conn.fetch(query, lang, limit, offset)

        return [dict(r) for r in rows]
