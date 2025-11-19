# PROMME Database Schema

## Overview

This document describes the complete database schema for the PROMME platform, including all tables for profiles, media (photos/videos), chats, vacancies, and related data.

**Recommended Database**: PostgreSQL (preferred) or MongoDB

---

## Database Tables

### 1. Users Table

Core user authentication and basic information.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_type VARCHAR(50) NOT NULL, -- 'job-seeker', 'company', 'facilitator'
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_users_email (email),
    INDEX idx_users_profile_type (profile_type),
    INDEX idx_users_created_at (created_at)
);
```

**Fields:**
- `id`: Unique user identifier (UUID)
- `email`: User's email (unique, used for login)
- `password_hash`: Bcrypt hashed password
- `profile_type`: Type of profile (job-seeker, company, facilitator)
- `is_verified`: Email verification status
- `is_active`: Account active status
- `last_login`: Last login timestamp
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

---

### 2. Profiles Table

Detailed user profile information.

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20),
    
    -- Job Seeker specific fields
    position VARCHAR(255),
    experience_years INTEGER,
    education TEXT,
    skills TEXT,
    about_me TEXT,
    
    -- Company specific fields
    company_name VARCHAR(255),
    company_description TEXT,
    company_size VARCHAR(50),
    industry VARCHAR(100),
    website VARCHAR(255),
    
    -- Location
    country VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    postal_code VARCHAR(20),
    
    -- Profile completion
    profile_completion_percentage INTEGER DEFAULT 0,
    is_profile_filled BOOLEAN DEFAULT false,
    profile_filled_by_ai BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_profiles_user_id (user_id),
    INDEX idx_profiles_city (city),
    INDEX idx_profiles_position (position),
    FULLTEXT INDEX idx_profiles_fulltext (full_name, position, skills, about_me)
);
```

---

### 3. Profile Photos Table

Store user profile photos and images.

```sql
CREATE TABLE profile_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL, -- in bytes
    mime_type VARCHAR(100) NOT NULL,
    width INTEGER,
    height INTEGER,
    is_primary BOOLEAN DEFAULT false,
    
    -- Upload info
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- CDN/Storage
    cdn_url VARCHAR(500),
    storage_provider VARCHAR(50), -- 's3', 'azure', 'local'
    
    -- Indexes
    INDEX idx_profile_photos_user_id (user_id),
    INDEX idx_profile_photos_is_primary (is_primary),
    INDEX idx_profile_photos_uploaded_at (uploaded_at)
);
```

**Features:**
- Multiple photos per user
- Primary photo designation
- CDN support
- File metadata storage

---

### 4. Profile Videos Table

Store AI-generated and user-uploaded videos.

```sql
CREATE TABLE profile_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    file_size INTEGER NOT NULL,
    duration INTEGER, -- in seconds
    resolution VARCHAR(20), -- e.g., '1920x1080'
    mime_type VARCHAR(100) NOT NULL,
    
    -- Video type
    video_type VARCHAR(50), -- 'ai-generated', 'user-uploaded', 'interview'
    is_ai_generated BOOLEAN DEFAULT false,
    ai_service_used VARCHAR(100), -- 'heygen', 'd-id', etc.
    
    -- Processing status
    processing_status VARCHAR(50) DEFAULT 'processing', -- 'processing', 'completed', 'failed'
    processing_started_at TIMESTAMP,
    processing_completed_at TIMESTAMP,
    
    -- Metadata
    is_primary BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    
    -- Timestamps
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- CDN/Storage
    cdn_url VARCHAR(500),
    storage_provider VARCHAR(50),
    
    -- Indexes
    INDEX idx_profile_videos_user_id (user_id),
    INDEX idx_profile_videos_video_type (video_type),
    INDEX idx_profile_videos_processing_status (processing_status),
    INDEX idx_profile_videos_is_primary (is_primary)
);
```

**Features:**
- AI-generated video support
- Processing status tracking
- Multiple videos per user
- Thumbnail support
- View counting

---

### 5. Resumes Table

Store user resumes/CVs.

```sql
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    
    -- Parsing
    is_parsed BOOLEAN DEFAULT false,
    parsed_data JSONB, -- Extracted resume data
    parsing_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    
    -- Metadata
    is_primary BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    
    -- Timestamps
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- CDN/Storage
    cdn_url VARCHAR(500),
    storage_provider VARCHAR(50),
    
    -- Indexes
    INDEX idx_resumes_user_id (user_id),
    INDEX idx_resumes_is_primary (is_primary),
    INDEX idx_resumes_uploaded_at (uploaded_at)
);
```

---

### 6. Vacancies Table

Job vacancy listings.

```sql
CREATE TABLE vacancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Basic info
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Requirements
    requirements JSONB, -- Array of requirements
    responsibilities JSONB, -- Array of responsibilities
    benefits JSONB, -- Array of benefits
    
    -- Details
    position_level VARCHAR(100),
    experience_required VARCHAR(100),
    education_required VARCHAR(100),
    employment_type VARCHAR(50), -- 'full-time', 'part-time', 'contract'
    work_schedule VARCHAR(50),
    
    -- Compensation
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(10) DEFAULT 'RUB',
    salary_period VARCHAR(20) DEFAULT 'monthly',
    
    -- Location
    country VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    is_remote BOOLEAN DEFAULT false,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'closed', 'draft', 'archived'
    is_featured BOOLEAN DEFAULT false,
    
    -- Statistics
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    
    -- SEO
    slug VARCHAR(255) UNIQUE,
    
    -- Timestamps
    published_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_vacancies_company_id (company_id),
    INDEX idx_vacancies_status (status),
    INDEX idx_vacancies_city (city),
    INDEX idx_vacancies_published_at (published_at),
    INDEX idx_vacancies_slug (slug),
    FULLTEXT INDEX idx_vacancies_fulltext (title, description)
);
```

---

### 7. Applications Table

Job applications submitted by users.

```sql
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vacancy_id UUID NOT NULL REFERENCES vacancies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Application data
    cover_letter TEXT,
    resume_id UUID REFERENCES resumes(id),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reviewing', 'accepted', 'rejected', 'withdrawn'
    
    -- Communication
    company_notes TEXT,
    rejection_reason TEXT,
    
    -- Match score
    match_percentage INTEGER,
    
    -- Timestamps
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    status_updated_at TIMESTAMP,
    
    -- Indexes
    INDEX idx_applications_vacancy_id (vacancy_id),
    INDEX idx_applications_user_id (user_id),
    INDEX idx_applications_status (status),
    INDEX idx_applications_submitted_at (submitted_at),
    
    -- Unique constraint: one application per user per vacancy
    UNIQUE (vacancy_id, user_id)
);
```

---

### 8. Saved Vacancies Table

Bookmarked/saved vacancies by users.

```sql
CREATE TABLE saved_vacancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vacancy_id UUID NOT NULL REFERENCES vacancies(id) ON DELETE CASCADE,
    
    -- Metadata
    notes TEXT,
    
    -- Timestamps
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_saved_vacancies_user_id (user_id),
    INDEX idx_saved_vacancies_vacancy_id (vacancy_id),
    INDEX idx_saved_vacancies_saved_at (saved_at),
    
    -- Unique constraint
    UNIQUE (user_id, vacancy_id)
);
```

---

### 9. Chats Table

Chat conversations between users.

```sql
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Chat type
    chat_type VARCHAR(50) NOT NULL, -- 'direct', 'group', 'support'
    
    -- Direct chat participants
    user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Group chat
    group_name VARCHAR(255),
    
    -- Related to
    vacancy_id UUID REFERENCES vacancies(id) ON DELETE SET NULL,
    application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_archived BOOLEAN DEFAULT false,
    
    -- Last message info
    last_message_id UUID,
    last_message_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_chats_user1_id (user1_id),
    INDEX idx_chats_user2_id (user2_id),
    INDEX idx_chats_chat_type (chat_type),
    INDEX idx_chats_vacancy_id (vacancy_id),
    INDEX idx_chats_last_message_at (last_message_at),
    
    -- Unique constraint for direct chats
    UNIQUE (user1_id, user2_id)
);
```

**Features:**
- Direct messaging between two users
- Group chat support
- Support chat capability
- Context-aware (linked to vacancies/applications)

---

### 10. Chat Messages Table

Individual messages in chats.

```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Message content
    message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'image', 'file', 'video', 'audio'
    message_text TEXT,
    
    -- File attachment
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    file_size INTEGER,
    file_type VARCHAR(100),
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP,
    
    -- Reply to
    reply_to_message_id UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
    
    -- Timestamps
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_chat_messages_chat_id (chat_id),
    INDEX idx_chat_messages_sender_id (sender_id),
    INDEX idx_chat_messages_sent_at (sent_at),
    INDEX idx_chat_messages_is_read (is_read)
);
```

**Features:**
- Text and media messages
- Read receipts
- Message editing and deletion
- Reply to messages
- File attachments

---

### 11. Chat Participants Table

For group chats, track all participants.

```sql
CREATE TABLE chat_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Role
    role VARCHAR(50) DEFAULT 'member', -- 'admin', 'member'
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Notifications
    notifications_enabled BOOLEAN DEFAULT true,
    
    -- Last read
    last_read_message_id UUID,
    last_read_at TIMESTAMP,
    
    -- Timestamps
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    
    -- Indexes
    INDEX idx_chat_participants_chat_id (chat_id),
    INDEX idx_chat_participants_user_id (user_id),
    
    -- Unique constraint
    UNIQUE (chat_id, user_id)
);
```

---

### 12. Notifications Table

User notifications.

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification content
    notification_type VARCHAR(50) NOT NULL, -- 'message', 'application', 'vacancy_match', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Related entities
    related_entity_type VARCHAR(50), -- 'vacancy', 'application', 'chat', 'message'
    related_entity_id UUID,
    
    -- Action URL
    action_url VARCHAR(500),
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_notifications_user_id (user_id),
    INDEX idx_notifications_is_read (is_read),
    INDEX idx_notifications_created_at (created_at)
);
```

---

### 13. User Sessions Table

Track active user sessions.

```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Session data
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    refresh_token_hash VARCHAR(255),
    
    -- Device info
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
    browser VARCHAR(100),
    os VARCHAR(100),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    
    -- Indexes
    INDEX idx_user_sessions_user_id (user_id),
    INDEX idx_user_sessions_token_hash (token_hash),
    INDEX idx_user_sessions_is_active (is_active),
    INDEX idx_user_sessions_expires_at (expires_at)
);
```

---

### 14. Activity Logs Table

Track user activities for analytics.

```sql
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Activity
    activity_type VARCHAR(100) NOT NULL,
    activity_description TEXT,
    
    -- Related entities
    entity_type VARCHAR(50),
    entity_id UUID,
    
    -- Request info
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_activity_logs_user_id (user_id),
    INDEX idx_activity_logs_activity_type (activity_type),
    INDEX idx_activity_logs_created_at (created_at)
);
```

---

### 15. Settings Table

User preferences and settings.

```sql
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Privacy settings
    profile_visibility VARCHAR(50) DEFAULT 'public', -- 'public', 'private', 'connections'
    show_email BOOLEAN DEFAULT false,
    show_phone BOOLEAN DEFAULT false,
    
    -- Notification preferences
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    
    -- Email notification types
    notify_new_messages BOOLEAN DEFAULT true,
    notify_applications BOOLEAN DEFAULT true,
    notify_vacancy_matches BOOLEAN DEFAULT true,
    notify_profile_views BOOLEAN DEFAULT true,
    
    -- Language and locale
    language VARCHAR(10) DEFAULT 'ru',
    timezone VARCHAR(50) DEFAULT 'Europe/Moscow',
    
    -- Other preferences
    preferences JSONB, -- Additional custom preferences
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_user_settings_user_id (user_id)
);
```

---

## Relationships Diagram

```
users (1) ─────── (1) profiles
  │                 
  ├─ (1:N) profile_photos
  ├─ (1:N) profile_videos
  ├─ (1:N) resumes
  ├─ (1:N) vacancies (for companies)
  ├─ (1:N) applications
  ├─ (1:N) saved_vacancies
  ├─ (1:N) chats (as user1 or user2)
  ├─ (1:N) chat_messages (as sender)
  ├─ (1:N) chat_participants
  ├─ (1:N) notifications
  ├─ (1:N) user_sessions
  ├─ (1:N) activity_logs
  └─ (1:1) user_settings

vacancies (1) ─── (N) applications
vacancies (1) ─── (N) saved_vacancies
vacancies (1) ─── (N) chats (optional)

chats (1) ────── (N) chat_messages
chats (1) ────── (N) chat_participants (for group chats)

applications (1) ─ (N) chats (optional)
```

---

## Indexes Strategy

### Performance Optimization

1. **Primary Keys**: All tables use UUID as primary key
2. **Foreign Keys**: Indexed automatically
3. **Search Fields**: Full-text indexes on searchable text fields
4. **Filter Fields**: Indexes on commonly filtered columns (status, dates, etc.)
5. **Composite Indexes**: For common query patterns

---

## Data Types Guide

### UUID vs Integer IDs
- **UUID**: Better for distributed systems, no collision risk
- **Integer**: Smaller, sequential, faster for simple systems

### JSONB vs Separate Tables
- **JSONB**: Flexible schema for arrays (requirements, skills)
- **Separate Tables**: Better for complex relationships

### TEXT vs VARCHAR
- **TEXT**: Unlimited length (descriptions, content)
- **VARCHAR**: Limited length with validation (names, emails)

---

## Storage Considerations

### File Storage

**Database stores:**
- File metadata (name, size, type)
- File paths/URLs
- Processing status

**Actual files stored in:**
- AWS S3 / Azure Blob Storage / Google Cloud Storage
- CDN for public access
- Local filesystem for development

**Recommended structure:**
```
/uploads/
  /photos/
    /profile/
      /{user_id}/{photo_id}.jpg
  /videos/
    /profile/
      /{user_id}/{video_id}.mp4
    /thumbnails/
      /{user_id}/{video_id}.jpg
  /resumes/
    /{user_id}/{resume_id}.pdf
  /chat-files/
    /{chat_id}/{message_id}/{filename}
```

---

## Security Considerations

### Sensitive Data
- **Passwords**: Bcrypt hash, never store plain text
- **Tokens**: Hash before storage
- **Personal Data**: Encrypt if required by regulations

### Access Control
- Row-level security for multi-tenant data
- User can only access their own data
- Companies can only access their own vacancies
- Proper authorization checks

### Data Retention
- Soft delete for user accounts
- Keep audit trail
- Anonymize data after account deletion
- Comply with GDPR/data protection laws

---

## Backup Strategy

### Automated Backups
- Daily full database backup
- Hourly incremental backups
- Keep backups for 30 days
- Test restore procedures monthly

### File Backups
- Sync to secondary storage
- CDN replication
- Version control for important files

---

## Migration Scripts

See `database-migrations/` directory for:
- Initial schema creation
- Seed data for development
- Migration scripts for updates
- Rollback procedures

---

## Performance Optimization

### Query Optimization
- Use EXPLAIN ANALYZE for slow queries
- Add indexes where needed
- Avoid N+1 queries
- Use connection pooling

### Caching Strategy
- Cache frequently accessed data (profiles, vacancies)
- Use Redis for session storage
- Cache AI-generated content
- Invalidate cache on updates

### Partitioning
- Consider partitioning large tables (activity_logs, chat_messages)
- Partition by date for time-series data
- Archive old data

---

## Monitoring

### Database Metrics
- Query performance
- Connection pool usage
- Disk space
- Index efficiency
- Slow query log

### Application Metrics
- API response times
- File upload speeds
- Chat message delivery
- User activity patterns

---

## Next Steps

1. **Create Database**: Run schema creation scripts
2. **Seed Data**: Add test/development data
3. **API Integration**: Connect backend API to database
4. **Testing**: Test all CRUD operations
5. **Optimization**: Monitor and optimize queries
6. **Backup Setup**: Configure automated backups
7. **Monitoring**: Set up database monitoring

---

This schema provides a solid foundation for the PROMME platform with proper relationships, indexes, and scalability considerations.

