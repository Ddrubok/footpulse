-- FootPulse Database Schema
-- 1. 전 세계 구단 마스터
CREATE TABLE IF NOT EXISTS clubs (
    id VARCHAR(30) PRIMARY KEY,           -- 예: 'BARCELONA', 'MAN_CITY', 'SEOUL'
    name_ko VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    aliases TEXT[] DEFAULT '{}',          -- 검색용 별칭 모음 (한글 초성, 영문 약칭 등)
    league VARCHAR(50),
    country VARCHAR(50),
    logo_url TEXT
);

-- 2. 기사 및 이적 메인
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name VARCHAR(50) NOT NULL,     -- BBC, Romano, Athletic 등
    source_url TEXT UNIQUE NOT NULL,      -- 중복 수집 방지 고유 키
    tier INT DEFAULT 3,                   -- 1, 2, 3
    transfer_status VARCHAR(30),          -- RUMOR, TALKS, HERE_WE_GO, DONE_DEAL
    player_name VARCHAR(100),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. [핵심] 기사-구단 M:N 매핑
CREATE TABLE IF NOT EXISTS article_clubs (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    club_id VARCHAR(30) REFERENCES clubs(id) ON DELETE CASCADE,
    club_role VARCHAR(20),                -- 'BUYER', 'SELLER', 'MENTIONED'
    PRIMARY KEY (article_id, club_id)
);

-- 4. 다국어 번역 및 팩트 요약 캐시
CREATE TABLE IF NOT EXISTS article_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    target_lang VARCHAR(10) NOT NULL,     -- 'ko', 'en', 'es', 'ja'
    title_translated TEXT NOT NULL,
    summary_translated TEXT NOT NULL,     -- 팩트 기반 1~2줄 재작성문
    UNIQUE(article_id, target_lang)
);

-- 인덱스 최적화
CREATE INDEX IF NOT EXISTS idx_article_clubs_club_id ON article_clubs(club_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_clubs_aliases ON clubs USING GIN(aliases);
