-- PROMME Database Initial Schema
-- ================================
-- Version: 1.0
-- Description: Creates all tables for the PROMME platform
-- Run this script to set up the initial database schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- ============================================
-- 1. USERS TABLE
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_type VARCHAR(50) NOT NULL CHECK (profile_type IN ('job-seeker', 'company', 'facilitator')),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_profile_type ON users(profile_type);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ============================================
-- 2. PROFILES TABLE
-- ============================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20),
    
    -- Job Seeker fields
    position VARCHAR(255),
    experience_years INTEGER,
    education TEXT,
    skills TEXT,
    about_me TEXT,
    
    -- Company fields
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
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_position ON profiles(position);
CREATE INDEX idx_profiles_full_name_trgm ON profiles USING gin(full_name gin_trgm_ops);

-- ============================================
-- 3. PROFILE PHOTOS TABLE
-- ============================================

CREATE TABLE profile_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    width INTEGER,
    height INTEGER,
    is_primary BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cdn_url VARCHAR(500),
    storage_provider VARCHAR(50)
);

CREATE INDEX idx_profile_photos_user_id ON profile_photos(user_id);
CREATE INDEX idx_profile_photos_is_primary ON profile_photos(is_primary);

-- ============================================
-- 4. PROFILE VIDEOS TABLE
-- ============================================

CREATE TABLE profile_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    file_size INTEGER NOT NULL,
    duration INTEGER,
    resolution VARCHAR(20),
    mime_type VARCHAR(100) NOT NULL,
    
    video_type VARCHAR(50),
    is_ai_generated BOOLEAN DEFAULT false,
    ai_service_used VARCHAR(100),
    
    processing_status VARCHAR(50) DEFAULT 'processing',
    processing_started_at TIMESTAMP,
    processing_completed_at TIMESTAMP,
    
    is_primary BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    cdn_url VARCHAR(500),
    storage_provider VARCHAR(50)
);

CREATE INDEX idx_profile_videos_user_id ON profile_videos(user_id);
CREATE INDEX idx_profile_videos_video_type ON profile_videos(video_type);
CREATE INDEX idx_profile_videos_processing_status ON profile_videos(processing_status);

-- ============================================
-- 5. RESUMES TABLE
-- ============================================

CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    
    is_parsed BOOLEAN DEFAULT false,
    parsed_data JSONB,
    parsing_status VARCHAR(50) DEFAULT 'pending',
    
    is_primary BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    cdn_url VARCHAR(500),
    storage_provider VARCHAR(50)
);

CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_is_primary ON resumes(is_primary);

-- ============================================
-- 6. VACANCIES TABLE
-- ============================================

CREATE TABLE vacancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    requirements JSONB,
    responsibilities JSONB,
    benefits JSONB,
    
    position_level VARCHAR(100),
    experience_required VARCHAR(100),
    education_required VARCHAR(100),
    employment_type VARCHAR(50),
    work_schedule VARCHAR(50),
    
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(10) DEFAULT 'RUB',
    salary_period VARCHAR(20) DEFAULT 'monthly',
    
    country VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    is_remote BOOLEAN DEFAULT false,
    
    status VARCHAR(50) DEFAULT 'active',
    is_featured BOOLEAN DEFAULT false,
    
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    
    slug VARCHAR(255) UNIQUE,
    
    published_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vacancies_company_id ON vacancies(company_id);
CREATE INDEX idx_vacancies_status ON vacancies(status);
CREATE INDEX idx_vacancies_city ON vacancies(city);
CREATE INDEX idx_vacancies_published_at ON vacancies(published_at);
CREATE INDEX idx_vacancies_title_trgm ON vacancies USING gin(title gin_trgm_ops);

-- ============================================
-- 7. APPLICATIONS TABLE
-- ============================================

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vacancy_id UUID NOT NULL REFERENCES vacancies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    cover_letter TEXT,
    resume_id UUID REFERENCES resumes(id),
    
    status VARCHAR(50) DEFAULT 'pending',
    company_notes TEXT,
    rejection_reason TEXT,
    
    match_percentage INTEGER,
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    status_updated_at TIMESTAMP,
    
    UNIQUE (vacancy_id, user_id)
);

CREATE INDEX idx_applications_vacancy_id ON applications(vacancy_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);

-- ============================================
-- 8. SAVED VACANCIES TABLE
-- ============================================

CREATE TABLE saved_vacancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vacancy_id UUID NOT NULL REFERENCES vacancies(id) ON DELETE CASCADE,
    notes TEXT,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE (user_id, vacancy_id)
);

CREATE INDEX idx_saved_vacancies_user_id ON saved_vacancies(user_id);
CREATE INDEX idx_saved_vacancies_vacancy_id ON saved_vacancies(vacancy_id);

-- ============================================
-- 9. CHATS TABLE
-- ============================================

CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    chat_type VARCHAR(50) NOT NULL,
    
    user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    group_name VARCHAR(255),
    
    vacancy_id UUID REFERENCES vacancies(id) ON DELETE SET NULL,
    application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    
    is_active BOOLEAN DEFAULT true,
    is_archived BOOLEAN DEFAULT false,
    
    last_message_id UUID,
    last_message_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chats_user1_id ON chats(user1_id);
CREATE INDEX idx_chats_user2_id ON chats(user2_id);
CREATE INDEX idx_chats_chat_type ON chats(chat_type);
CREATE INDEX idx_chats_last_message_at ON chats(last_message_at);

-- ============================================
-- 10. CHAT MESSAGES TABLE
-- ============================================

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    message_type VARCHAR(50) DEFAULT 'text',
    message_text TEXT,
    
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    file_size INTEGER,
    file_type VARCHAR(100),
    
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP,
    
    reply_to_message_id UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
    
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_messages_chat_id ON chat_messages(chat_id);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_sent_at ON chat_messages(sent_at);

-- ============================================
-- 11. CHAT PARTICIPANTS TABLE
-- ============================================

CREATE TABLE chat_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    role VARCHAR(50) DEFAULT 'member',
    is_active BOOLEAN DEFAULT true,
    notifications_enabled BOOLEAN DEFAULT true,
    
    last_read_message_id UUID,
    last_read_at TIMESTAMP,
    
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    
    UNIQUE (chat_id, user_id)
);

CREATE INDEX idx_chat_participants_chat_id ON chat_participants(chat_id);
CREATE INDEX idx_chat_participants_user_id ON chat_participants(user_id);

-- ============================================
-- 12. NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    
    action_url VARCHAR(500),
    
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================
-- 13. USER SESSIONS TABLE
-- ============================================

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    refresh_token_hash VARCHAR(255),
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- ============================================
-- 14. ACTIVITY LOGS TABLE
-- ============================================

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    activity_type VARCHAR(100) NOT NULL,
    activity_description TEXT,
    
    entity_type VARCHAR(50),
    entity_id UUID,
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_activity_type ON activity_logs(activity_type);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- ============================================
-- 15. USER SETTINGS TABLE
-- ============================================

CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    profile_visibility VARCHAR(50) DEFAULT 'public',
    show_email BOOLEAN DEFAULT false,
    show_phone BOOLEAN DEFAULT false,
    
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    
    notify_new_messages BOOLEAN DEFAULT true,
    notify_applications BOOLEAN DEFAULT true,
    notify_vacancy_matches BOOLEAN DEFAULT true,
    notify_profile_views BOOLEAN DEFAULT true,
    
    language VARCHAR(10) DEFAULT 'ru',
    timezone VARCHAR(50) DEFAULT 'Europe/Moscow',
    
    preferences JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vacancies_updated_at BEFORE UPDATE ON vacancies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMPLETION
-- ============================================

COMMENT ON DATABASE promme IS 'PROMME Platform Database - Job Portal';

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO promme_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO promme_user;

