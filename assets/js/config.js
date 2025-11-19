// PROMME - Environment Configuration
// ====================================

/**
 * Environment configuration for different deployment stages
 * Change ENV to 'development', 'staging', or 'production' as needed
 */

// Current environment (can be set via build process or environment variable)
const ENV = window.PROMME_ENV || 'development';

// Configuration for each environment
const CONFIG = {
    development: {
        // Traditional API (optional if using Supabase)
        API_BASE_URL: 'http://localhost:3000/api',
        API_TIMEOUT: 30000,
        
        // Supabase Configuration (FREE database & auth)
        SUPABASE_URL: 'https://mskikoksudxjhpnpsoal.supabase.co', // ✅ Supabase URL
        SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2lrb2tzdWR4amhwbnBzb2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTc5MjEsImV4cCI6MjA3OTEzMzkyMX0.A2I8TM58PG5PImrH6XQHPkDAUFSdFSHIRjnx5mvWytE', // ✅ Supabase Key
        USE_SUPABASE: true, // ✅ Using Supabase!
        
        // Other settings
        ENABLE_LOGGING: true,
        ENABLE_DEBUG: true,
        YANDEX_MAPS_API_KEY: 'YOUR_DEV_API_KEY',
        AI_API_URL: 'http://localhost:3000/api/ai',
        ENABLE_MOCK_DATA: false, // ✅ Mock data disabled - using Supabase!
        SESSION_TIMEOUT: 3600000, // 1 hour
    },
    staging: {
        // Traditional API (optional if using Supabase)
        API_BASE_URL: 'https://staging-api.promme.ru/api',
        API_TIMEOUT: 30000,
        
        // Supabase Configuration
        SUPABASE_URL: '', // Add your Supabase project URL here
        SUPABASE_ANON_KEY: '', // Add your Supabase anon key here
        USE_SUPABASE: true,
        
        // Other settings
        ENABLE_LOGGING: true,
        ENABLE_DEBUG: false,
        YANDEX_MAPS_API_KEY: 'YOUR_STAGING_API_KEY',
        AI_API_URL: 'https://staging-api.promme.ru/api/ai',
        ENABLE_MOCK_DATA: false,
        SESSION_TIMEOUT: 3600000, // 1 hour
    },
    production: {
        // Traditional API (optional if using Supabase)
        API_BASE_URL: 'https://api.promme.ru/api',
        API_TIMEOUT: 30000,
        
        // Supabase Configuration
        SUPABASE_URL: 'https://mskikoksudxjhpnpsoal.supabase.co', // ✅ Supabase URL
        SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2lrb2tzdWR4amhwbnBzb2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTc5MjEsImV4cCI6MjA3OTEzMzkyMX0.A2I8TM58PG5PImrH6XQHPkDAUFSdFSHIRjnx5mvWytE', // ✅ Supabase Key
        USE_SUPABASE: true,
        
        // Other settings
        ENABLE_LOGGING: false,
        ENABLE_DEBUG: false,
        YANDEX_MAPS_API_KEY: 'YOUR_PRODUCTION_API_KEY',
        AI_API_URL: 'https://api.promme.ru/api/ai',
        ENABLE_MOCK_DATA: false,
        SESSION_TIMEOUT: 7200000, // 2 hours
    }
};

// Export the configuration for the current environment
const AppConfig = {
    ...CONFIG[ENV],
    ENV: ENV,
    VERSION: '1.0.0',
    APP_NAME: 'PROMME',
};

// Log configuration on load (only in development)
if (AppConfig.ENABLE_DEBUG) {
    console.log('PROMME Configuration:', AppConfig);
}

// Make configuration available globally
window.AppConfig = AppConfig;

// Helper function to get current config (used by other modules)
function getEnvironmentConfig() {
    return window.AppConfig;
}

