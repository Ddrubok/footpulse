import os
import re
import json
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from typing import Optional, Dict, Any, List

API_FOOTBALL_KEY = os.getenv("API_FOOTBALL_KEY", "")

def clean_text(text: str) -> str:
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text).strip()

def search_thesportsdb(player_name: str) -> Optional[Dict[str, Any]]:
    """TheSportsDB 공식 오픈 API로 선수 정보 및 고화질 누끼 사진 획득"""
    try:
        url = f"https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p={urllib.parse.quote(player_name)}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 FootPulse/3.1'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            players = data.get("player")
            if players and len(players) > 0:
                p = players[0]
                # 사진: 누끼(strCutout) 우선, 없으면 썸네일(strThumb)
                photo = p.get("strCutout") or p.get("strThumb") or "https://r2.thesportsdb.com/images/media/player/cutout/m9n4ja1761512633.png"
                name_en = p.get("strPlayer", player_name)
                club = p.get("strTeam", "Club")
                nationality = p.get("strNationality", "Global")
                position = p.get("strPosition", "Footballer")
                
                # 고유 slug ID 생성
                slug_id = re.sub(r'[^a-z0-9]+', '-', name_en.lower()).strip('-')
                
                return {
                    "id": slug_id,
                    "api_football_id": int(p.get("idPlayer", 0)) if p.get("idPlayer", "").isdigit() else None,
                    "name_ko": name_en, # 기본값, 필요시 번역 매핑
                    "name_en": name_en,
                    "current_club_name": club,
                    "current_club": club,
                    "nationality": nationality,
                    "nationality_code": nationality[:2].upper(),
                    "position": position,
                    "photo_url": photo,
                    "trend_score": 60,
                    "aliases": [name_en, slug_id, club]
                }
    except Exception as e:
        print(f"[TheSportsDB] Error searching for {player_name}: {e}")
    return None

def fetch_google_trends() -> List[Dict[str, Any]]:
    """Google Trends RSS 피드에서 일일 검색 트렌드 추출"""
    trending = []
    urls = [
        "https://trends.google.com/trending/rss?geo=KR",
        "https://trends.google.com/trending/rss?geo=GB"
    ]
    for url in urls:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=4) as resp:
                xml_data = resp.read()
                root = ET.fromstring(xml_data)
                for item in root.findall(".//item"):
                    title = item.find("title")
                    traffic = item.find("{https://trends.google.com/trending/rss}approx_traffic")
                    if title is not None and title.text:
                        score = 50
                        if traffic is not None and traffic.text:
                            # 100K+ -> 90, 50K+ -> 75
                            digits = re.sub(r'[^0-9]', '', traffic.text)
                            if digits:
                                score = min(100, max(50, int(digits) // 1000))
                        trending.append({"query": title.text.strip(), "score": score})
        except Exception as e:
            print(f"[GoogleTrends] Error fetching trends from {url}: {e}")
    return trending

def search_and_register_player(conn, keyword: str) -> Optional[Dict[str, Any]]:
    """DB에 없는 선수를 API로 즉시 조회 후 DB에 영구 등록(On-demand Ingestion)"""
    # 1. API 조회
    player_data = search_thesportsdb(keyword)
    if not player_data:
        return None
    
    # 2. DB 저장
    pid = player_data["id"]
    try:
        conn.run("""
            INSERT INTO players (id, api_football_id, name_ko, name_en, aliases, current_club_id, current_club_name, current_club, nationality, nationality_code, position, photo_url, trend_score, last_updated)
            VALUES (:id, :afid, :name_ko, :name_en, :aliases, 'EXT', :club, :club, :nat, :nat_code, :pos, :photo, :score, NOW())
            ON CONFLICT (id) DO UPDATE
            SET trend_score = EXCLUDED.trend_score,
                last_updated = NOW();
        """, 
        id=pid,
        afid=player_data["api_football_id"],
        name_ko=player_data["name_ko"],
        name_en=player_data["name_en"],
        aliases=player_data["aliases"],
        club=player_data["current_club_name"],
        nat=player_data["nationality"],
        nat_code=player_data["nationality_code"],
        pos=player_data["position"],
        photo=player_data["photo_url"],
        score=player_data["trend_score"]
        )

        # 3. 최신 기사 2건을 기본 매핑하여 피드가 비어있지 않게 보장
        conn.run("""
            INSERT INTO article_players (article_id, player_id)
            SELECT id, :pid FROM articles ORDER BY published_at DESC LIMIT 2
            ON CONFLICT DO NOTHING;
        """, pid=pid)

        return player_data
    except Exception as e:
        print(f"[DB] Error registering player {pid}: {e}")
        return None

if __name__ == "__main__":
    print("Testing Ingestion...")
    p = search_thesportsdb("Arda Guler")
    print("Result:", json.dumps(p, indent=2))
    trends = fetch_google_trends()
    print("Trends count:", len(trends))
