// PROMME - API Service Layer
// ===========================

/**
 * Centralized API service for all backend communication
 * This layer abstracts API calls and provides consistent error handling
 */

class APIService {
    constructor() {
        this.baseURL = window.AppConfig?.API_BASE_URL || 'http://localhost:3000/api';
        this.timeout = window.AppConfig?.API_TIMEOUT || 30000;
        this.enableMockData = window.AppConfig?.ENABLE_MOCK_DATA !== false;
    }

    /**
     * Generic HTTP request method
     * @param {string} endpoint - API endpoint path
     * @param {Object} options - Request options
     * @returns {Promise<Object>} - Response data
     */
    async request(endpoint, options = {}) {
        const {
            method = 'GET',
            headers = {},
            body = null,
            requiresAuth = false,
        } = options;

        // Build full URL
        const url = `${this.baseURL}${endpoint}`;

        // Prepare headers
        const requestHeaders = {
            'Content-Type': 'application/json',
            ...headers,
        };

        // Add auth token if required
        if (requiresAuth) {
            const authToken = this.getAuthToken();
            if (authToken) {
                requestHeaders['Authorization'] = `Bearer ${authToken}`;
            } else {
                throw new Error('Authentication required but no token found');
            }
        }

        // Prepare request options
        const requestOptions = {
            method,
            headers: requestHeaders,
        };

        // Add body for POST/PUT/PATCH requests
        if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
            requestOptions.body = JSON.stringify(body);
        }

        try {
            // If mock data is enabled, return mock response
            if (this.enableMockData) {
                console.log(`[MOCK] ${method} ${endpoint}`, body || '');
                return await this.getMockResponse(endpoint, method, body);
            }

            // Set timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            requestOptions.signal = controller.signal;

            // Make the request
            const response = await fetch(url, requestOptions);
            clearTimeout(timeoutId);

            // Handle response
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new APIError(
                    errorData.message || `HTTP ${response.status}: ${response.statusText}`,
                    response.status,
                    errorData
                );
            }

            const data = await response.json();
            return data;

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new APIError('Request timeout', 408);
            }
            
            if (error instanceof APIError) {
                throw error;
            }

            throw new APIError(`Network error: ${error.message}`, 0);
        }
    }

    /**
     * GET request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Object>} - Response data
     */
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    /**
     * POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} body - Request body
     * @param {Object} options - Request options
     * @returns {Promise<Object>} - Response data
     */
    async post(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body });
    }

    /**
     * PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} body - Request body
     * @param {Object} options - Request options
     * @returns {Promise<Object>} - Response data
     */
    async put(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', body });
    }

    /**
     * PATCH request
     * @param {string} endpoint - API endpoint
     * @param {Object} body - Request body
     * @param {Object} options - Request options
     * @returns {Promise<Object>} - Response data
     */
    async patch(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PATCH', body });
    }

    /**
     * DELETE request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise<Object>} - Response data
     */
    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }

    /**
     * Get authentication token from storage
     * @returns {string|null} - Auth token
     */
    getAuthToken() {
        const userData = localStorage.getItem('prommeAuthUser');
        if (userData) {
            const parsedData = JSON.parse(userData);
            return parsedData.token || null;
        }
        return null;
    }

    /**
     * Upload file
     * @param {string} endpoint - Upload endpoint
     * @param {File} file - File to upload
     * @param {Object} additionalData - Additional form data
     * @returns {Promise<Object>} - Response data
     */
    async uploadFile(endpoint, file, additionalData = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const formData = new FormData();
        formData.append('file', file);
        
        // Add additional data to form
        Object.keys(additionalData).forEach(key => {
            formData.append(key, additionalData[key]);
        });

        const headers = {};
        const authToken = this.getAuthToken();
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        if (this.enableMockData) {
            console.log(`[MOCK] Upload file to ${endpoint}`, file.name);
            return await this.getMockFileUploadResponse(endpoint, file);
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new APIError(
                errorData.message || `Upload failed: ${response.statusText}`,
                response.status,
                errorData
            );
        }

        return await response.json();
    }

    /**
     * Mock data responses for development/testing
     * @param {string} endpoint - API endpoint
     * @param {string} method - HTTP method
     * @param {Object} body - Request body
     * @returns {Promise<Object>} - Mock response
     */
    async getMockResponse(endpoint, method, body) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Authentication endpoints
        if (endpoint === '/auth/login' && method === 'POST') {
            return {
                success: true,
                data: {
                    user: {
                        id: 'mock_user_123',
                        name: body.name || 'Mock User',
                        email: body.email,
                        profileType: body.profileType,
                    },
                    token: 'mock_jwt_token_' + Date.now(),
                },
                message: 'Login successful',
            };
        }

        if (endpoint === '/auth/register' && method === 'POST') {
            return {
                success: true,
                data: {
                    user: {
                        id: 'mock_user_' + Date.now(),
                        name: body.name,
                        email: body.email,
                        profileType: body.profileType,
                    },
                    token: 'mock_jwt_token_' + Date.now(),
                },
                message: 'Registration successful',
            };
        }

        if (endpoint === '/auth/logout' && method === 'POST') {
            return {
                success: true,
                message: 'Logout successful',
            };
        }

        // Profile endpoints
        if (endpoint.startsWith('/profile') && method === 'GET') {
            return {
                success: true,
                data: {
                    id: 'mock_user_123',
                    name: 'Иван Иванов',
                    email: 'ivan@example.com',
                    phone: '+7 (999) 123-45-67',
                    position: 'Сварщик 5 разряда',
                    experience: 12,
                    education: 'Высшее техническое',
                    skills: 'РДС, МАГ, ТИГ, чтение чертежей',
                    about: 'Опытный сварщик с 12-летним стажем работы',
                    profileType: 'job-seeker',
                },
            };
        }

        if (endpoint.startsWith('/profile') && method === 'PUT') {
            return {
                success: true,
                data: { ...body, id: 'mock_user_123' },
                message: 'Profile updated successfully',
            };
        }

        // Vacancies endpoints
        if (endpoint === '/vacancies' && method === 'GET') {
            return {
                success: true,
                data: {
                    vacancies: [
                        {
                            id: 'welder-5',
                            title: 'Сварщик 5 разряда',
                            company: 'ООО "Уралмашзавод"',
                            location: 'Екатеринбург',
                            salary: '80000-120000',
                            match: 95,
                        },
                        {
                            id: 'welder-4',
                            title: 'Сварщик 4 разряда',
                            company: 'АО "ЧТПЗ"',
                            location: 'Челябинск',
                            salary: '70000-100000',
                            match: 88,
                        },
                    ],
                    total: 2,
                    page: 1,
                    limit: 10,
                },
            };
        }

        if (endpoint.startsWith('/vacancies/') && method === 'GET') {
            const vacancyId = endpoint.split('/')[2];
            return {
                success: true,
                data: {
                    id: vacancyId,
                    title: 'Сварщик 5 разряда',
                    company: 'ООО "Уралмашзавод"',
                    location: 'Екатеринбург',
                    salary: '80000-120000',
                    description: 'Описание вакансии...',
                    requirements: ['Требование 1', 'Требование 2'],
                },
            };
        }

        // AI endpoints
        if (endpoint === '/ai/parse-resume' && method === 'POST') {
            return {
                success: true,
                data: {
                    name: 'Иван Петров',
                    email: 'ivan.petrov@example.com',
                    phone: '+7 (999) 888-77-66',
                    position: 'Сварщик 5 разряда',
                    experience: 10,
                    education: 'Среднее профессиональное',
                    skills: 'РДС, МАГ, ТИГ',
                    about: 'Опытный сварщик',
                },
            };
        }

        // Default response
        return {
            success: true,
            data: {},
            message: 'Mock response',
        };
    }

    /**
     * Mock file upload response
     * @param {string} endpoint - Upload endpoint
     * @param {File} file - Uploaded file
     * @returns {Promise<Object>} - Mock response
     */
    async getMockFileUploadResponse(endpoint, file) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            success: true,
            data: {
                fileId: 'mock_file_' + Date.now(),
                filename: file.name,
                size: file.size,
                url: URL.createObjectURL(file),
            },
            message: 'File uploaded successfully',
        };
    }
}

/**
 * Custom API Error class
 */
class APIError extends Error {
    constructor(message, status, data = {}) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

// Create singleton instance
const apiService = new APIService();

// Export for use in other modules
window.APIService = apiService;
window.APIError = APIError;

