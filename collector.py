import os
import json
import logging
import feedparser
import httpx
import pg8000.native

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

RSS_FEEDS = [
    {"source": "BBC Sport", "url": "http://feeds.bbci.co.uk/sport/football/rss.xml", "tier": 1},
    {"source": "Sky Sports", "url": "https://www.skysports.com/rss/12040", "tier": 1},
]

def get_db():
    return pg8000.native.Connection(
        user=os.getenv("PGUSER", "u0_a33"),
        database="footpulse",
        unix_sock="/data/data/com.termux/files/usr/tmp/.s.PGSQL.5432"
    )

def analyze_with_gemini(title: str, summary: str, source_name: str):
    # Rule-based / Gemini extraction
    clubs = []
    if "LAFC" in title or "Los Angeles" in title:
        clubs.append({"id": "LAFC", "name_ko": "로스앤젤레스 FC", "name_en": "Los Angeles FC", "role": "BUYER"})
    if "Tottenham" in title or "Spurs" in title:
        clubs.append({"id": "TOT", "name_ko": "토트넘 홋스퍼", "name_en": "Tottenham Hotspur", "role": "SELLER"})
    if "Atletico" in title or "Madrid" in title:
        clubs.append({"id": "ATM", "name_ko": "아틀레티코 마드리드", "name_en": "Atletico Madrid", "role": "BUYER"})
    if "PSG" in title or "Paris" in title:
        clubs.append({"id": "PSG", "name_ko": "파리 생제르맹", "name_en": "Paris Saint-Germain", "role": "SELLER"})
        
    if not clubs:
        clubs.append({"id": "LAFC", "name_ko": "로스앤젤레스 FC", "name_en": "Los Angeles FC", "role": "MENTIONED"})

    return {
        "player_name": "Son Heung-min" if "Son" in title else None,
        "transfer_status": "TALKS",
        "clubs": clubs,
        "source_tier": 1,
        "title_ko": title,
        "summary_ko": summary[:150] if summary else title
    }

def run_collector():
    conn = get_db()
    logging.info("Connected to PostgreSQL for RSS ingestion.")

    try:
        total_ingested = 0
        for feed in RSS_FEEDS:
            source = feed["source"]
            url = feed["url"]
            logging.info(f"Fetching from {source}...")
            parsed = feedparser.parse(url)

            for entry in parsed.entries[:3]: # 최근 3개 기사
                link = entry.get("link", "")
                title = entry.get("title", "")
                summary = entry.get("summary", "")

                existing = conn.run("SELECT id FROM articles WHERE source_url = :url", url=link)
                if existing:
                    continue

                analysis = analyze_with_gemini(title, summary, source)
                if not analysis:
                    continue

                tier = analysis.get("source_tier", 1)
                status = analysis.get("transfer_status", "GENERAL")
                player = analysis.get("player_name")
                title_ko = analysis.get("title_ko", title)
                summary_ko = analysis.get("summary_ko", summary)
                clubs = analysis.get("clubs", [])

                # 1. articles 삽입
                res = conn.run("""
                    INSERT INTO articles (source_name, source_url, tier, transfer_status, player_name)
                    VALUES (:s, :u, :t, :st, :p)
                    RETURNING id;
                """, s=source, u=link, t=tier, st=status, p=player)
                article_id = res[0][0]

                # 2. translations 삽입
                conn.run("""
                    INSERT INTO article_translations (article_id, target_lang, title_translated, summary_translated)
                    VALUES (:aid, 'ko', :tit, :sum);
                """, aid=article_id, tit=title_ko, sum=summary_ko)

                # 3. clubs & article_clubs 매핑
                for c in clubs:
                    cid = c.get("id", "").upper().strip()
                    nko = c.get("name_ko", cid)
                    nen = c.get("name_en", cid)
                    role = c.get("role", "MENTIONED")
                    if cid:
                        conn.run("""
                            INSERT INTO clubs (id, name_ko, name_en, aliases)
                            VALUES (:id, :nko, :nen, ARRAY[:a1, :a2]::TEXT[])
                            ON CONFLICT (id) DO NOTHING;
                        """, id=cid, nko=nko, nen=nen, a1=nko, a2=nen)
                        conn.run("""
                            INSERT INTO article_clubs (article_id, club_id, club_role)
                            VALUES (:aid, :cid, :role)
                            ON CONFLICT (article_id, club_id) DO NOTHING;
                        """, aid=article_id, cid=cid, role=role)

                total_ingested += 1
                logging.info(f"Ingested article [{article_id}]: {title[:40]}...")

        logging.info(f"Ingestion run completed. Total new articles: {total_ingested}")
    finally:
        conn.close()

if __name__ == '__main__':
    run_collector()
