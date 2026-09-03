psql -d footpulse -c "SELECT count(*) FROM clubs;"
psql -d footpulse -c "SELECT id, name_ko, league, country FROM clubs WHERE id IN ('LAFC', 'ATM', 'TOT', 'PSG');"
