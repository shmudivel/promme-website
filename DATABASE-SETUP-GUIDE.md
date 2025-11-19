# PROMME Database Setup Guide

## Quick Start

This guide will help you set up the PostgreSQL database for the PROMME platform.

---

## Prerequisites

- **PostgreSQL** 14+ installed
- **pgAdmin** or command-line tool (psql)
- Database admin access

---

## Installation

### Option 1: Using PostgreSQL Locally

#### 1. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

#### 2. Create Database and User

```bash
# Access PostgreSQL
sudo -u postgres psql

# Or on macOS/Windows:
psql postgres
```

```sql
-- Create database
CREATE DATABASE promme;

-- Create user
CREATE USER promme_user WITH PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE promme TO promme_user;

-- Exit
\q
```

#### 3. Run Migration Scripts

```bash
# Navigate to migrations folder
cd database-migrations

# Run initial schema
psql -U promme_user -d promme -f 001_initial_schema.sql

# Run seed data (optional, for development)
psql -U promme_user -d promme -f 002_seed_data.sql
```

---

### Option 2: Using Docker

#### 1. Create docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: promme_db
    environment:
      POSTGRES_DB: promme
      POSTGRES_USER: promme_user
      POSTGRES_PASSWORD: your_secure_password_here
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database-migrations:/docker-entrypoint-initdb.d
    restart: unless-stopped

volumes:
  postgres_data:
```

#### 2. Start Database

```bash
docker-compose up -d
```

#### 3. Verify Database

```bash
# Check if container is running
docker ps

# Access PostgreSQL
docker exec -it promme_db psql -U promme_user -d promme

# Check tables
\dt

# Exit
\q
```

---

### Option 3: Using Cloud Database

#### AWS RDS

1. Go to AWS RDS Console
2. Create PostgreSQL database
3. Choose instance type
4. Configure security group to allow connections
5. Note down the endpoint and credentials
6. Connect and run migration scripts

#### Heroku Postgres

```bash
# Add Heroku Postgres
heroku addons:create heroku-postgresql:hobby-dev

# Get connection string
heroku config:get DATABASE_URL

# Run migrations
heroku pg:psql < database-migrations/001_initial_schema.sql
heroku pg:psql < database-migrations/002_seed_data.sql
```

#### DigitalOcean Managed Database

1. Create PostgreSQL database cluster
2. Add trusted sources (your IP)
3. Download CA certificate if using SSL
4. Connect and run migrations

---

## Database Configuration

### Connection String Format

```
postgresql://username:password@host:port/database
```

**Example:**
```
postgresql://promme_user:your_password@localhost:5432/promme
```

### Environment Variables

Add to your backend `.env` file:

```env
# Database Configuration
DATABASE_URL=postgresql://promme_user:your_password@localhost:5432/promme

# Connection Pool
DB_POOL_MIN=2
DB_POOL_MAX=10

# SSL (for production)
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
```

---

## Migration Scripts

### Available Migrations

1. **001_initial_schema.sql** - Creates all tables
2. **002_seed_data.sql** - Inserts sample data (development only)

### Running Migrations

#### Using psql:

```bash
psql -U promme_user -d promme -f database-migrations/001_initial_schema.sql
```

#### Using Node.js (with node-pg-migrate):

```bash
npm install node-pg-migrate pg
npx node-pg-migrate up
```

#### Using Python (with Alembic):

```bash
pip install alembic psycopg2
alembic upgrade head
```

---

## Verification

### Check Database Structure

```sql
-- Connect to database
psql -U promme_user -d promme

-- List all tables
\dt

-- Check specific table
\d users

-- Check indexes
\di

-- Check foreign keys
\d+ profiles
```

### Expected Tables

After running migrations, you should have:

- `users` - User accounts
- `profiles` - User profiles
- `profile_photos` - Profile photos
- `profile_videos` - Profile videos
- `resumes` - User resumes
- `vacancies` - Job vacancies
- `applications` - Job applications
- `saved_vacancies` - Bookmarked vacancies
- `chats` - Chat conversations
- `chat_messages` - Chat messages
- `chat_participants` - Group chat participants
- `notifications` - User notifications
- `user_sessions` - Active sessions
- `activity_logs` - Activity tracking
- `user_settings` - User preferences

### Test Data

If you ran the seed data script, you'll have:

- 3 job seekers
- 2 companies
- 1 educational institution
- 3 vacancies
- 1 application
- 1 chat conversation with messages

---

## Backup and Restore

### Backup Database

```bash
# Full database backup
pg_dump -U promme_user -d promme > promme_backup.sql

# Schema only
pg_dump -U promme_user -d promme --schema-only > promme_schema.sql

# Data only
pg_dump -U promme_user -d promme --data-only > promme_data.sql

# With compression
pg_dump -U promme_user -d promme | gzip > promme_backup.sql.gz
```

### Restore Database

```bash
# From SQL file
psql -U promme_user -d promme < promme_backup.sql

# From compressed file
gunzip -c promme_backup.sql.gz | psql -U promme_user -d promme
```

### Automated Backups

Create a backup script (`backup-db.sh`):

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/path/to/backups"
DB_NAME="promme"
DB_USER="promme_user"

# Create backup
pg_dump -U $DB_USER -d $DB_NAME | gzip > "$BACKUP_DIR/promme_backup_$DATE.sql.gz"

# Keep only last 30 days
find $BACKUP_DIR -name "promme_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: promme_backup_$DATE.sql.gz"
```

Make executable and add to crontab:

```bash
chmod +x backup-db.sh

# Run daily at 2 AM
crontab -e
# Add: 0 2 * * * /path/to/backup-db.sh
```

---

## Database Maintenance

### Optimize Database

```sql
-- Analyze tables for query optimization
ANALYZE;

-- Vacuum to reclaim storage
VACUUM;

-- Full vacuum (requires exclusive lock)
VACUUM FULL;

-- Reindex
REINDEX DATABASE promme;
```

### Monitor Database Size

```sql
-- Database size
SELECT pg_size_pretty(pg_database_size('promme'));

-- Table sizes
SELECT 
    table_name,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name)))
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;

-- Top 10 largest tables
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;
```

### Check Database Performance

```sql
-- Slow queries
SELECT 
    calls,
    total_time,
    mean_time,
    query
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Unused indexes
SELECT 
    schemaname,
    tablename,
    indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0;
```

---

## Troubleshooting

### Cannot Connect to Database

**Error:** `FATAL: password authentication failed`

**Solution:**
1. Check credentials
2. Verify pg_hba.conf settings
3. Restart PostgreSQL

```bash
sudo systemctl restart postgresql
```

### Out of Disk Space

**Solution:**
1. Check database size
2. Run VACUUM
3. Archive old data
4. Increase disk space

### Slow Queries

**Solution:**
1. Run ANALYZE
2. Check indexes
3. Optimize queries
4. Consider connection pooling

### Database Locks

**Check active locks:**
```sql
SELECT * FROM pg_locks WHERE NOT granted;
```

**Check blocking queries:**
```sql
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocking_locks.pid AS blocking_pid,
    blocked_activity.query AS blocked_query,
    blocking_activity.query AS blocking_query
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

---

## Security

### Best Practices

1. **Use strong passwords**
2. **Enable SSL connections** in production
3. **Restrict database access** by IP
4. **Regular backups**
5. **Keep PostgreSQL updated**
6. **Use read-only users** for reporting

### SSL Configuration

Edit `postgresql.conf`:
```
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'
```

Edit `pg_hba.conf`:
```
hostssl all all 0.0.0.0/0 md5
```

### Create Read-Only User

```sql
-- Create read-only user
CREATE USER promme_readonly WITH PASSWORD 'readonly_password';

-- Grant connect
GRANT CONNECT ON DATABASE promme TO promme_readonly;

-- Grant select on all tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO promme_readonly;

-- Grant select on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT ON TABLES TO promme_readonly;
```

---

## Next Steps

1. ✅ Database is set up
2. Configure backend to connect to database
3. Run API tests
4. Set up monitoring
5. Configure automated backups
6. Plan for scaling

---

## Resources

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- PgAdmin: https://www.pgadmin.org/
- Connection Pooling (PgBouncer): https://www.pgbouncer.org/
- Database Monitoring: https://www.postgresql.org/docs/current/monitoring-stats.html

---

## Support

For database setup issues:
1. Check PostgreSQL logs
2. Verify connection settings
3. Test with psql command line
4. Check firewall rules
5. Review error messages

**Log locations:**
- Linux: `/var/log/postgresql/`
- macOS: `/usr/local/var/log/`
- Docker: `docker logs promme_db`

