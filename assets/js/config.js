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
        API_BASE_URL: 'http://localhost:3000/api',
        API_TIMEOUT: 30000,
        ENABLE_LOGGING: true,
        ENABLE_DEBUG: true,
        YANDEX_MAPS_API_KEY: 'YOUR_DEV_API_KEY',
        AI_API_URL: 'http://localhost:3000/api/ai',
        ENABLE_MOCK_DATA: true,
        SESSION_TIMEOUT: 3600000, // 1 hour
    },
    staging: {
        API_BASE_URL: 'https://staging-api.promme.ru/api',
        API_TIMEOUT: 30000,
        ENABLE_LOGGING: true,
        ENABLE_DEBUG: false,
        YANDEX_MAPS_API_KEY: 'YOUR_STAGING_API_KEY',
        AI_API_URL: 'https://staging-api.promme.ru/api/ai',
        ENABLE_MOCK_DATA: false,
        SESSION_TIMEOUT: 3600000, // 1 hour
    },
    production: {
        API_BASE_URL: 'https://api.promme.ru/api',
        API_TIMEOUT: 30000,
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

