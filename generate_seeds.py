import json

CLUBS_DATA = [
    # Premier League (잉글랜드)
    {"id": "ARS", "name_ko": "아스널", "name_en": "Arsenal", "aliases": ["아스날", "거너스", "Arsenal FC", "AFC", "ㅇㅅㄴ"], "league": "Premier League", "country": "England"},
    {"id": "AST", "name_ko": "애스턴 빌라", "name_en": "Aston Villa", "aliases": ["아스톤빌라", "아스톤 빌라", "빌라", "AVFC"], "league": "Premier League", "country": "England"},
    {"id": "BOU", "name_ko": "본머스", "name_en": "AFC Bournemouth", "aliases": ["AFC 본머스", "체리즈"], "league": "Premier League", "country": "England"},
    {"id": "BRE", "name_ko": "브렌트퍼드", "name_en": "Brentford", "aliases": ["브렌트포드", "비즈"], "league": "Premier League", "country": "England"},
    {"id": "BHA", "name_ko": "브라이턴", "name_en": "Brighton & Hove Albion", "aliases": ["브라이튼", "갈매기", "BHAFC"], "league": "Premier League", "country": "England"},
    {"id": "CHE", "name_ko": "첼시", "name_en": "Chelsea", "aliases": ["첼시 FC", "블루스", "CFC", "ㅊㅅ"], "league": "Premier League", "country": "England"},
    {"id": "CRY", "name_ko": "크리스탈 팰리스", "name_en": "Crystal Palace", "aliases": ["팰리스", "크리스탈팰리스", "CPFC"], "league": "Premier League", "country": "England"},
    {"id": "EVE", "name_ko": "에버턴", "name_en": "Everton", "aliases": ["에버튼", "토피스", "EFC"], "league": "Premier League", "country": "England"},
    {"id": "FUL", "name_ko": "풀럼", "name_en": "Fulham", "aliases": ["풀럼 FC", "코티저스", "FFC"], "league": "Premier League", "country": "England"},
    {"id": "IPS", "name_ko": "입스위치 타운", "name_en": "Ipswich Town", "aliases": ["입스위치", "ITFC"], "league": "Premier League", "country": "England"},
    {"id": "LEI", "name_ko": "레스터 시티", "name_en": "Leicester City", "aliases": ["레스터", "여우들", "LCFC", "ㄹㅅㅌ"], "league": "Premier League", "country": "England"},
    {"id": "LIV", "name_ko": "리버풀", "name_en": "Liverpool", "aliases": ["콥", "LFC", "ㄹㅂㅍ"], "league": "Premier League", "country": "England"},
    {"id": "MCI", "name_ko": "맨체스터 시티", "name_en": "Manchester City", "aliases": ["맨시티", "시티", "Man City", "MCFC", "ㅁㅅㅌ"], "league": "Premier League", "country": "England"},
    {"id": "MUN", "name_ko": "맨체스터 유나이티드", "name_en": "Manchester United", "aliases": ["맨유", "Man Utd", "MUFC", "ㅁㅇ"], "league": "Premier League", "country": "England"},
    {"id": "NEW", "name_ko": "뉴캐슬 유나이티드", "name_en": "Newcastle United", "aliases": ["뉴캐슬", "맥파이스", "NUFC", "ㄴㅋㅅ"], "league": "Premier League", "country": "England"},
    {"id": "NFO", "name_ko": "노팅엄 포레스트", "name_en": "Nottingham Forest", "aliases": ["노팅엄", "포레스트", "NFFC"], "league": "Premier League", "country": "England"},
    {"id": "SOU", "name_ko": "사우샘프턴", "name_en": "Southampton", "aliases": ["사우스햄튼", "소튼", "세인츠"], "league": "Premier League", "country": "England"},
    {"id": "TOT", "name_ko": "토트넘 홋스퍼", "name_en": "Tottenham Hotspur", "aliases": ["토트넘", "스퍼스", "Spurs", "THFC", "ㅌㅌㄴ"], "league": "Premier League", "country": "England"},
    {"id": "WHU", "name_ko": "웨스트햄 유나이티드", "name_en": "West Ham United", "aliases": ["웨스트햄", "해머스", "WHUFC"], "league": "Premier League", "country": "England"},
    {"id": "WOL", "name_ko": "울버햄튼 원더러스", "name_en": "Wolverhampton Wanderers", "aliases": ["울버햄튼", "울브스", "Wolves", "ㅇㅂㅎㅌ"], "league": "Premier League", "country": "England"},

    # La Liga (스페인)
    {"id": "RMA", "name_ko": "레알 마드리드", "name_en": "Real Madrid", "aliases": ["레알", "마드리드", "로스 블랑코스", "RM", "ㄹㅇ"], "league": "La Liga", "country": "Spain"},
    {"id": "BAR", "name_ko": "FC 바르셀로나", "name_en": "FC Barcelona", "aliases": ["바르셀로나", "바르샤", "Barca", "FCB", "ㅂㄹㅅ"], "league": "La Liga", "country": "Spain"},
    {"id": "ATM", "name_ko": "아틀레티코 마드리드", "name_en": "Atletico Madrid", "aliases": ["알레티", "꼬마", "Atleti", "ATM", "ㅇㅌㄹㅌㅋ"], "league": "La Liga", "country": "Spain"},
    {"id": "ATH", "name_ko": "아틀레틱 클루브", "name_en": "Athletic Club", "aliases": ["빌바오", "아틀레틱 빌바오"], "league": "La Liga", "country": "Spain"},
    {"id": "RSO", "name_ko": "레알 소시에다드", "name_en": "Real Sociedad", "aliases": ["소시에다드", "라 레알"], "league": "La Liga", "country": "Spain"},
    {"id": "BET", "name_ko": "레알 베티스", "name_en": "Real Betis", "aliases": ["베티스", "베르디블랑코스"], "league": "La Liga", "country": "Spain"},
    {"id": "VIL", "name_ko": "비야레알", "name_en": "Villarreal CF", "aliases": ["비야레알 CF", "노란 잠수함"], "league": "La Liga", "country": "Spain"},
    {"id": "SEV", "name_ko": "세비야 FC", "name_en": "Sevilla FC", "aliases": ["세비야"], "league": "La Liga", "country": "Spain"},
    {"id": "VAL", "name_ko": "발렌시아 CF", "name_en": "Valencia CF", "aliases": ["발렌시아", "박쥐"], "league": "La Liga", "country": "Spain"},
    {"id": "CEL", "name_ko": "셀타 비고", "name_en": "Celta Vigo", "aliases": ["셀타"], "league": "La Liga", "country": "Spain"},
    {"id": "GIR", "name_ko": "지로나 FC", "name_en": "Girona FC", "aliases": ["지로나"], "league": "La Liga", "country": "Spain"},
    {"id": "MALL", "name_ko": "RCD 마요르카", "name_en": "RCD Mallorca", "aliases": ["마요르카"], "league": "La Liga", "country": "Spain"},

    # Serie A (이탈리아)
    {"id": "INT", "name_ko": "인터 밀란", "name_en": "Inter Milan", "aliases": ["인테르", "네라주리", "Internazionale", "ㅇㅌㄹ"], "league": "Serie A", "country": "Italy"},
    {"id": "MIL", "name_ko": "AC 밀란", "name_en": "AC Milan", "aliases": ["밀란", "로소네리", "ACM", "ㅁㄹ"], "league": "Serie A", "country": "Italy"},
    {"id": "JUV", "name_ko": "유벤투스", "name_en": "Juventus", "aliases": ["유베", "비안코네리", "Juve", "ㅇㅂㅌㅅ"], "league": "Serie A", "country": "Italy"},
    {"id": "NAP", "name_ko": "SSC 나폴리", "name_en": "SSC Napoli", "aliases": ["나폴리", "파르테노페이", "ㄴㅍㄹ"], "league": "Serie A", "country": "Italy"},
    {"id": "ROM", "name_ko": "AS 로마", "name_en": "AS Roma", "aliases": ["로마", "지알로로시"], "league": "Serie A", "country": "Italy"},
    {"id": "LAZ", "name_ko": "SS 라치오", "name_en": "SS Lazio", "aliases": ["라치오", "비앙코첼레스티"], "league": "Serie A", "country": "Italy"},
    {"id": "ATA", "name_ko": "아탈란타 BC", "name_en": "Atalanta", "aliases": ["아탈란타"], "league": "Serie A", "country": "Italy"},
    {"id": "FIO", "name_ko": "ACF 피오렌티나", "name_en": "Fiorentina", "aliases": ["피오렌티나", "비올라"], "league": "Serie A", "country": "Italy"},

    # Bundesliga (독일)
    {"id": "BAY", "name_ko": "바이에른 뮌헨", "name_en": "Bayern Munich", "aliases": ["뮌헨", "바이에른", "FCB", "Bayern", "ㅁㅎ"], "league": "Bundesliga", "country": "Germany"},
    {"id": "DOR", "name_ko": "보루시아 도르트문트", "name_en": "Borussia Dortmund", "aliases": ["도르트문트", "돌문", "BVB", "ㄷㅁ"], "league": "Bundesliga", "country": "Germany"},
    {"id": "LEV", "name_ko": "바이어 레버쿠젠", "name_en": "Bayer Leverkusen", "aliases": ["레버쿠젠", "B04", "ㄹㅂㅋㅈ"], "league": "Bundesliga", "country": "Germany"},
    {"id": "RBL", "name_ko": "RB 라이프치히", "name_en": "RB Leipzig", "aliases": ["라이프치히", "레드불"], "league": "Bundesliga", "country": "Germany"},
    {"id": "FRA", "name_ko": "아인트라흐트 프랑크푸르트", "name_en": "Eintracht Frankfurt", "aliases": ["프랑크푸르트"], "league": "Bundesliga", "country": "Germany"},
    {"id": "STU", "name_ko": "VfB 슈투트가르트", "name_en": "VfB Stuttgart", "aliases": ["슈투트가르트"], "league": "Bundesliga", "country": "Germany"},

    # Ligue 1 (프랑스)
    {"id": "PSG", "name_ko": "파리 생제르맹", "name_en": "Paris Saint-Germain", "aliases": ["파리", "생제르맹", "PSG", "ㅍㄹ"], "league": "Ligue 1", "country": "France"},
    {"id": "MONA", "name_ko": "AS 모나코", "name_en": "AS Monaco", "aliases": ["모나코"], "league": "Ligue 1", "country": "France"},
    {"id": "MAR", "name_ko": "올림피크 드 마르세유", "name_en": "Olympique de Marseille", "aliases": ["마르세유", "OM"], "league": "Ligue 1", "country": "France"},
    {"id": "LIL", "name_ko": "LOSC 릴", "name_en": "Lille", "aliases": ["릴"], "league": "Ligue 1", "country": "France"},
    {"id": "LYO", "name_ko": "올림피크 리옹", "name_en": "Olympique Lyonnais", "aliases": ["리옹", "OL"], "league": "Ligue 1", "country": "France"},

    # K리그 (대한민국)
    {"id": "ULS", "name_ko": "울산 HD FC", "name_en": "Ulsan HD FC", "aliases": ["울산", "울산현대", "울산 현대", "호랑이", "ㅇㅅ"], "league": "K League 1", "country": "South Korea"},
    {"id": "POH", "name_ko": "포항 스틸러스", "name_en": "Pohang Steelers", "aliases": ["포항", "스틸러스", "쇠돌이", "ㅍㅎ"], "league": "K League 1", "country": "South Korea"},
    {"id": "JEO", "name_ko": "전북 현대 모터스", "name_en": "Jeonbuk Hyundai Motors", "aliases": ["전북", "전북현대", "녹색전사", "ㅈㅂ"], "league": "K League 1", "country": "South Korea"},
    {"id": "SEO", "name_ko": "FC 서울", "name_en": "FC Seoul", "aliases": ["서울", "FC서울", "수호신", "ㅅㅇ"], "league": "K League 1", "country": "South Korea"},
    {"id": "GWA", "name_ko": "광주 FC", "name_en": "Gwangju FC", "aliases": ["광주", "ㄱㅈ"], "league": "K League 1", "country": "South Korea"},
    {"id": "GAE", "name_ko": "강원 FC", "name_en": "Gangwon FC", "aliases": ["강원", "ㄱㅇ"], "league": "K League 1", "country": "South Korea"},
    {"id": "DAE", "name_ko": "대전 하나 시티즌", "name_en": "Daejeon Hana Citizen", "aliases": ["대전", "대전시티즌", "ㄷㅈ"], "league": "K League 1", "country": "South Korea"},
    {"id": "JEJ", "name_ko": "제주 SK FC", "name_en": "Jeju United", "aliases": ["제주", "제주유나이티드", "ㅈㅈ"], "league": "K League 1", "country": "South Korea"},
    {"id": "INC", "name_ko": "인천 유나이티드", "name_en": "Incheon United", "aliases": ["인천", "인천유나이티드", "ㅇㅊ"], "league": "K League 1", "country": "South Korea"},
    {"id": "SUW_FC", "name_ko": "수원 FC", "name_en": "Suwon FC", "aliases": ["수원FC", "ㅅㅇFC"], "league": "K League 1", "country": "South Korea"},
    {"id": "SUW_BLU", "name_ko": "수원 삼성 블루윙즈", "name_en": "Suwon Samsung Bluewings", "aliases": ["수원삼성", "수원 삼성", "블루윙즈", "ㅅㅇㅅㅅ"], "league": "K League 2", "country": "South Korea"},

    # Saudi Pro League (사우디아라비아)
    {"id": "HIL", "name_ko": "알 힐랄", "name_en": "Al Hilal", "aliases": ["알힐랄", "Hilal"], "league": "Saudi Pro League", "country": "Saudi Arabia"},
    {"id": "NAS", "name_ko": "알 나스르", "name_en": "Al Nassr", "aliases": ["알나스르", "Nassr", "호날두팀"], "league": "Saudi Pro League", "country": "Saudi Arabia"},
    {"id": "ITT", "name_ko": "알 이티하드", "name_en": "Al Ittihad", "aliases": ["알이티하드", "Ittihad"], "league": "Saudi Pro League", "country": "Saudi Arabia"},
    {"id": "AHL", "name_ko": "알 아흘리", "name_en": "Al Ahli", "aliases": ["알아흘리", "Ahli"], "league": "Saudi Pro League", "country": "Saudi Arabia"}
]

def generate_sql():
    lines = ["-- 구단 마스터 시드 데이터 삽입"]
    for c in CLUBS_DATA:
        quoted = ["'" + a + "'" for a in c["aliases"]]
        aliases_arr = "ARRAY[" + ", ".join(quoted) + "]::TEXT[]"
        cid = c["id"]
        nko = c["name_ko"]
        nen = c["name_en"]
        league = c["league"]
        country = c["country"]
        sql = f"""INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('{cid}', '{nko}', '{nen}', {aliases_arr}, '{league}', '{country}')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;"""
        lines.append(sql)
    return "\n".join(lines)

if __name__ == "__main__":
    sql_content = generate_sql()
    with open("seed_clubs.sql", "w", encoding="utf-8") as f:
        f.write(sql_content)
    print(f"Successfully generated seed_clubs.sql with {len(CLUBS_DATA)} clubs.")
