-- FootPulse 전 세계 주요 구단 마스터 시드 데이터
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('ARS', '아스널', 'Arsenal', ARRAY['아스날', '거너스', 'Arsenal FC', 'AFC', 'ㅇㅅㄴ']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('AST', '애스턴 빌라', 'Aston Villa', ARRAY['아스톤빌라', '아스톤 빌라', '빌라', 'AVFC']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('BOU', '본머스', 'AFC Bournemouth', ARRAY['AFC 본머스', '체리즈']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('BRE', '브렌트퍼드', 'Brentford', ARRAY['브렌트포드', '비즈']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('BHA', '브라이턴', 'Brighton & Hove Albion', ARRAY['브라이튼', '갈매기', 'BHAFC']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('CHE', '첼시', 'Chelsea', ARRAY['첼시 FC', '블루스', 'CFC', 'ㅊㅅ']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('CRY', '크리스탈 팰리스', 'Crystal Palace', ARRAY['팰리스', '크리스탈팰리스', 'CPFC']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('EVE', '에버턴', 'Everton', ARRAY['에버튼', '토피스', 'EFC']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('FUL', '풀럼', 'Fulham', ARRAY['풀럼 FC', '코티저스', 'FFC']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('IPS', '입스위치 타운', 'Ipswich Town', ARRAY['입스위치', 'ITFC']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('LEI', '레스터 시티', 'Leicester City', ARRAY['레스터', '여우들', 'LCFC', 'ㄹㅅㅌ']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('LIV', '리버풀', 'Liverpool', ARRAY['콥', 'LFC', 'ㄹㅂㅍ']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('MCI', '맨체스터 시티', 'Manchester City', ARRAY['맨시티', '시티', 'Man City', 'MCFC', 'ㅁㅅㅌ']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('MUN', '맨체스터 유나이티드', 'Manchester United', ARRAY['맨유', 'Man Utd', 'MUFC', 'ㅁㅇ']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('NEW', '뉴캐슬 유나이티드', 'Newcastle United', ARRAY['뉴캐슬', '맥파이스', 'NUFC', 'ㄴㅋㅅ']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('NFO', '노팅엄 포레스트', 'Nottingham Forest', ARRAY['노팅엄', '포레스트', 'NFFC']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('SOU', '사우샘프턴', 'Southampton', ARRAY['사우스햄튼', '소튼', '세인츠']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('TOT', '토트넘 홋스퍼', 'Tottenham Hotspur', ARRAY['토트넘', '스퍼스', 'Spurs', 'THFC', 'ㅌㅌㄴ']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('WHU', '웨스트햄 유나이티드', 'West Ham United', ARRAY['웨스트햄', '해머스', 'WHUFC']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('WOL', '울버햄튼 원더러스', 'Wolverhampton Wanderers', ARRAY['울버햄튼', '울브스', 'Wolves', 'ㅇㅂㅎㅌ']::TEXT[], 'Premier League', 'England')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('RMA', '레알 마드리드', 'Real Madrid', ARRAY['레알', '마드리드', '로스 블랑코스', 'RM', 'ㄹㅇ']::TEXT[], 'La Liga', 'Spain')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('BAR', 'FC 바르셀로나', 'FC Barcelona', ARRAY['바르셀로나', '바르샤', 'Barca', 'FCB', 'ㅂㄹㅅ']::TEXT[], 'La Liga', 'Spain')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('ATM', '아틀레티코 마드리드', 'Atletico Madrid', ARRAY['알레티', '꼬마', 'Atleti', 'ATM', 'ㅇㅌㄹㅌㅋ']::TEXT[], 'La Liga', 'Spain')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('ATH', '아틀레틱 클루브', 'Athletic Club', ARRAY['빌바오', '아틀레틱 빌바오']::TEXT[], 'La Liga', 'Spain')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('RSO', '레알 소시에다드', 'Real Sociedad', ARRAY['소시에다드', '라 레알']::TEXT[], 'La Liga', 'Spain')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('BET', '레알 베티스', 'Real Betis', ARRAY['베티스', '베르디블랑코스']::TEXT[], 'La Liga', 'Spain')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('VIL', '비야레알', 'Villarreal CF', ARRAY['비야레알 CF', '노란 잠수함']::TEXT[], 'La Liga', 'Spain')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('SEV', '세비야 FC', 'Sevilla FC', ARRAY['세비야']::TEXT[], 'La Liga', 'Spain')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('VAL', '발렌시아 CF', 'Valencia CF', ARRAY['발렌시아', '박쥐']::TEXT[], 'La Liga', 'Spain')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('CEL', '셀타 비고', 'Celta Vigo', ARRAY['셀타']::TEXT[], 'La Liga', 'Spain')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('GIR', '지로나 FC', 'Girona FC', ARRAY['지로나']::TEXT[], 'La Liga', 'Spain')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('MALL', 'RCD 마요르카', 'RCD Mallorca', ARRAY['마요르카']::TEXT[], 'La Liga', 'Spain')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('INT', '인터 밀란', 'Inter Milan', ARRAY['인테르', '네라주리', 'Internazionale', 'ㅇㅌㄹ']::TEXT[], 'Serie A', 'Italy')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('MIL', 'AC 밀란', 'AC Milan', ARRAY['밀란', '로소네리', 'ACM', 'ㅁㄹ']::TEXT[], 'Serie A', 'Italy')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('JUV', '유벤투스', 'Juventus', ARRAY['유베', '비안코네리', 'Juve', 'ㅇㅂㅌㅅ']::TEXT[], 'Serie A', 'Italy')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('NAP', 'SSC 나폴리', 'SSC Napoli', ARRAY['나폴리', '파르테노페이', 'ㄴㅍㄹ']::TEXT[], 'Serie A', 'Italy')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('ROM', 'AS 로마', 'AS Roma', ARRAY['로마', '지알로로시']::TEXT[], 'Serie A', 'Italy')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('LAZ', 'SS 라치오', 'SS Lazio', ARRAY['라치오', '비앙코첼레스티']::TEXT[], 'Serie A', 'Italy')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('ATA', '아탈란타 BC', 'Atalanta', ARRAY['아탈란타']::TEXT[], 'Serie A', 'Italy')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('FIO', 'ACF 피오렌티나', 'Fiorentina', ARRAY['피오렌티나', '비올라']::TEXT[], 'Serie A', 'Italy')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('BAY', '바이에른 뮌헨', 'Bayern Munich', ARRAY['뮌헨', '바이에른', 'FCB', 'Bayern', 'ㅁㅎ']::TEXT[], 'Bundesliga', 'Germany')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('DOR', '보루시아 도르트문트', 'Borussia Dortmund', ARRAY['도르트문트', '돌문', 'BVB', 'ㄷㅁ']::TEXT[], 'Bundesliga', 'Germany')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('LEV', '바이어 레버쿠젠', 'Bayer Leverkusen', ARRAY['레버쿠젠', 'B04', 'ㄹㅂㅋㅈ']::TEXT[], 'Bundesliga', 'Germany')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('RBL', 'RB 라이프치히', 'RB Leipzig', ARRAY['라이프치히', '레드불']::TEXT[], 'Bundesliga', 'Germany')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('FRA', '아인트라흐트 프랑크푸르트', 'Eintracht Frankfurt', ARRAY['프랑크푸르트']::TEXT[], 'Bundesliga', 'Germany')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('STU', 'VfB 슈투트가르트', 'VfB Stuttgart', ARRAY['슈투트가르트']::TEXT[], 'Bundesliga', 'Germany')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('PSG', '파리 생제르맹', 'Paris Saint-Germain', ARRAY['파리', '생제르맹', 'PSG', 'ㅍㄹ']::TEXT[], 'Ligue 1', 'France')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('MONA', 'AS 모나코', 'AS Monaco', ARRAY['모나코']::TEXT[], 'Ligue 1', 'France')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('MAR', '올림피크 드 마르세유', 'Olympique de Marseille', ARRAY['마르세유', 'OM']::TEXT[], 'Ligue 1', 'France')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('LIL', 'LOSC 릴', 'Lille', ARRAY['릴']::TEXT[], 'Ligue 1', 'France')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('LYO', '올림피크 리옹', 'Olympique Lyonnais', ARRAY['리옹', 'OL']::TEXT[], 'Ligue 1', 'France')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('ULS', '울산 HD FC', 'Ulsan HD FC', ARRAY['울산', '울산현대', '울산 현대', '호랑이', 'ㅇㅅ']::TEXT[], 'K League 1', 'South Korea')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('POH', '포항 스틸러스', 'Pohang Steelers', ARRAY['포항', '스틸러스', '쇠돌이', 'ㅍㅎ']::TEXT[], 'K League 1', 'South Korea')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('JEO', '전북 현대 모터스', 'Jeonbuk Hyundai Motors', ARRAY['전북', '전북현대', '녹색전사', 'ㅈㅂ']::TEXT[], 'K League 1', 'South Korea')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('SEO', 'FC 서울', 'FC Seoul', ARRAY['서울', 'FC서울', '수호신', 'ㅅㅇ']::TEXT[], 'K League 1', 'South Korea')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('GWA', '광주 FC', 'Gwangju FC', ARRAY['광주', 'ㄱㅈ']::TEXT[], 'K League 1', 'South Korea')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('GAE', '강원 FC', 'Gangwon FC', ARRAY['강원', 'ㄱㅇ']::TEXT[], 'K League 1', 'South Korea')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('DAE', '대전 하나 시티즌', 'Daejeon Hana Citizen', ARRAY['대전', '대전시티즌', 'ㄷㅈ']::TEXT[], 'K League 1', 'South Korea')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('JEJ', '제주 SK FC', 'Jeju United', ARRAY['제주', '제주유나이티드', 'ㅈㅈ']::TEXT[], 'K League 1', 'South Korea')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('INC', '인천 유나이티드', 'Incheon United', ARRAY['인천', '인천유나이티드', 'ㅇㅊ']::TEXT[], 'K League 1', 'South Korea')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('SUW_FC', '수원 FC', 'Suwon FC', ARRAY['수원FC', 'ㅅㅇFC']::TEXT[], 'K League 1', 'South Korea')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('SUW_BLU', '수원 삼성 블루윙즈', 'Suwon Samsung Bluewings', ARRAY['수원삼성', '수원 삼성', '블루윙즈', 'ㅅㅇㅅㅅ']::TEXT[], 'K League 2', 'South Korea')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('HIL', '알 힐랄', 'Al Hilal', ARRAY['알힐랄', 'Hilal']::TEXT[], 'Saudi Pro League', 'Saudi Arabia')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('NAS', '알 나스르', 'Al Nassr', ARRAY['알나스르', 'Nassr', '호날두팀']::TEXT[], 'Saudi Pro League', 'Saudi Arabia')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('ITT', '알 이티하드', 'Al Ittihad', ARRAY['알이티하드', 'Ittihad']::TEXT[], 'Saudi Pro League', 'Saudi Arabia')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('AHL', '알 아흘리', 'Al Ahli', ARRAY['알아흘리', 'Ahli']::TEXT[], 'Saudi Pro League', 'Saudi Arabia')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;

-- MLS 주요 구단 추가
INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('LAFC', '로스앤젤레스 FC', 'Los Angeles FC', ARRAY['LAFC', 'LA FC', '로스앤젤레스FC', '블랙앤골드', '로스앤젤레스', 'ㄹㅇFC']::TEXT[], 'MLS', 'USA')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;

INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('MIA', '인터 마이애미 CF', 'Inter Miami CF', ARRAY['인터 마이애미', '마이애미', '인터마이애미', 'MIA', 'ㅇㅌㅁㅇㅇㅁ']::TEXT[], 'MLS', 'USA')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;

INSERT INTO clubs (id, name_ko, name_en, aliases, league, country)
VALUES ('LAG', 'LA 갤럭시', 'LA Galaxy', ARRAY['갤럭시', 'LA갤럭시', 'LAG']::TEXT[], 'MLS', 'USA')
ON CONFLICT (id) DO UPDATE SET
    name_ko = EXCLUDED.name_ko,
    name_en = EXCLUDED.name_en,
    aliases = EXCLUDED.aliases,
    league = EXCLUDED.league,
    country = EXCLUDED.country;
