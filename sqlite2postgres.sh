sqlite3 data/database.db ".dump 'categories'" | grep -vi 'create table' | grep -vi 'pragma' | PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER}
sqlite3 data/database.db ".dump 'items' 'donates' 'promos'" | grep -vi 'create table' | grep -vi 'pragma' | PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER}