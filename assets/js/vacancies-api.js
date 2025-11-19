// PROMME - Vacancies API Module
// ===============================

/**
 * Vacancies API module for job listings integration
 * This module handles all vacancy-related API calls
 */

const VacanciesAPI = {
    /**
     * Get all vacancies with filters and pagination
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.limit - Items per page (default: 10)
     * @param {string} params.search - Search query
     * @param {string} params.location - Location filter
     * @param {string} params.salaryMin - Minimum salary
     * @param {string} params.salaryMax - Maximum salary
     * @param {string} params.experience - Experience level
     * @param {string} params.sortBy - Sort field (default: 'createdAt')
     * @param {string} params.sortOrder - Sort order ('asc' or 'desc')
     * @returns {Promise<Object>} - Vacancies list with pagination
     */
    async getVacancies(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            // Add query parameters
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    queryParams.append(key, params[key]);
                }
            });

            const queryString = queryParams.toString();
            const endpoint = queryString ? `/vacancies?${queryString}` : '/vacancies';

            const response = await window.APIService.get(endpoint);

            if (response.success) {
                return {
                    success: true,
                    data: response.data.vacancies || [],
                    pagination: {
                        total: response.data.total || 0,
                        page: response.data.page || 1,
                        limit: response.data.limit || 10,
                        totalPages: Math.ceil((response.data.total || 0) / (response.data.limit || 10)),
                    },
                };
            }

            return { success: false, error: 'Failed to fetch vacancies' };
        } catch (error) {
            console.error('Get vacancies error:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch vacancies',
            };
        }
    },

    /**
     * Get single vacancy by ID
     * @param {string} vacancyId - Vacancy ID
     * @returns {Promise<Object>} - Vacancy details
     */
    async getVacancyById(vacancyId) {
        try {
            const response = await window.APIService.get(`/vacancies/${vacancyId}`);

            if (response.success) {
                return { success: true, data: response.data };
            }

            return { success: false, error: 'Vacancy not found' };
        } catch (error) {
            console.error('Get vacancy error:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch vacancy',
            };
        }
    },

    /**
     * Get matching vacancies for user profile
     * @param {string} userId - User ID (optional, uses current user if not provided)
     * @returns {Promise<Object>} - Matching vacancies
     */
    async getMatchingVacancies(userId = null) {
        try {
            const endpoint = userId 
                ? `/vacancies/match?userId=${userId}` 
                : '/vacancies/match';

            const response = await window.APIService.get(endpoint, {
                requiresAuth: true,
            });

            if (response.success) {
                return {
                    success: true,
                    data: response.data.vacancies || [],
                };
            }

            return { success: false, error: 'Failed to find matching vacancies' };
        } catch (error) {
            console.error('Get matching vacancies error:', error);
            return {
                success: false,
                error: error.message || 'Failed to find matches',
            };
        }
    },

    /**
     * Apply for a vacancy
     * @param {string} vacancyId - Vacancy ID
     * @param {Object} applicationData - Application data
     * @param {string} applicationData.coverLetter - Cover letter (optional)
     * @param {string} applicationData.resumeUrl - Resume URL (optional)
     * @returns {Promise<Object>} - Application result
     */
    async applyForVacancy(vacancyId, applicationData = {}) {
        try {
            const response = await window.APIService.post(
                `/vacancies/${vacancyId}/apply`,
                applicationData,
                { requiresAuth: true }
            );

            if (response.success) {
                return {
                    success: true,
                    data: response.data,
                    message: response.message || 'Application submitted successfully',
                };
            }

            return { success: false, error: 'Application submission failed' };
        } catch (error) {
            console.error('Apply for vacancy error:', error);
            return {
                success: false,
                error: error.message || 'Failed to submit application',
            };
        }
    },

    /**
     * Save/bookmark a vacancy
     * @param {string} vacancyId - Vacancy ID
     * @returns {Promise<Object>} - Save result
     */
    async saveVacancy(vacancyId) {
        try {
            const response = await window.APIService.post(
                `/vacancies/${vacancyId}/save`,
                {},
                { requiresAuth: true }
            );

            if (response.success) {
                return {
                    success: true,
                    message: 'Vacancy saved successfully',
                };
            }

            return { success: false, error: 'Failed to save vacancy' };
        } catch (error) {
            console.error('Save vacancy error:', error);
            return {
                success: false,
                error: error.message || 'Failed to save vacancy',
            };
        }
    },

    /**
     * Unsave/remove bookmark from a vacancy
     * @param {string} vacancyId - Vacancy ID
     * @returns {Promise<Object>} - Unsave result
     */
    async unsaveVacancy(vacancyId) {
        try {
            const response = await window.APIService.delete(
                `/vacancies/${vacancyId}/save`,
                { requiresAuth: true }
            );

            if (response.success) {
                return {
                    success: true,
                    message: 'Vacancy removed from saved',
                };
            }

            return { success: false, error: 'Failed to unsave vacancy' };
        } catch (error) {
            console.error('Unsave vacancy error:', error);
            return {
                success: false,
                error: error.message || 'Failed to unsave vacancy',
            };
        }
    },

    /**
     * Get saved vacancies for current user
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} - Saved vacancies list
     */
    async getSavedVacancies(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined) {
                    queryParams.append(key, params[key]);
                }
            });

            const queryString = queryParams.toString();
            const endpoint = queryString 
                ? `/vacancies/saved?${queryString}` 
                : '/vacancies/saved';

            const response = await window.APIService.get(endpoint, {
                requiresAuth: true,
            });

            if (response.success) {
                return {
                    success: true,
                    data: response.data.vacancies || [],
                };
            }

            return { success: false, error: 'Failed to fetch saved vacancies' };
        } catch (error) {
            console.error('Get saved vacancies error:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch saved vacancies',
            };
        }
    },

    /**
     * Get user's applications
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} - Applications list
     */
    async getUserApplications(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined) {
                    queryParams.append(key, params[key]);
                }
            });

            const queryString = queryParams.toString();
            const endpoint = queryString 
                ? `/applications?${queryString}` 
                : '/applications';

            const response = await window.APIService.get(endpoint, {
                requiresAuth: true,
            });

            if (response.success) {
                return {
                    success: true,
                    data: response.data.applications || [],
                };
            }

            return { success: false, error: 'Failed to fetch applications' };
        } catch (error) {
            console.error('Get applications error:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch applications',
            };
        }
    },

    /**
     * Post a new vacancy (for companies)
     * @param {Object} vacancyData - Vacancy data
     * @returns {Promise<Object>} - Created vacancy
     */
    async createVacancy(vacancyData) {
        try {
            const response = await window.APIService.post(
                '/vacancies',
                vacancyData,
                { requiresAuth: true }
            );

            if (response.success) {
                return {
                    success: true,
                    data: response.data,
                    message: 'Vacancy created successfully',
                };
            }

            return { success: false, error: 'Failed to create vacancy' };
        } catch (error) {
            console.error('Create vacancy error:', error);
            return {
                success: false,
                error: error.message || 'Failed to create vacancy',
            };
        }
    },

    /**
     * Update an existing vacancy (for companies)
     * @param {string} vacancyId - Vacancy ID
     * @param {Object} vacancyData - Updated vacancy data
     * @returns {Promise<Object>} - Updated vacancy
     */
    async updateVacancy(vacancyId, vacancyData) {
        try {
            const response = await window.APIService.put(
                `/vacancies/${vacancyId}`,
                vacancyData,
                { requiresAuth: true }
            );

            if (response.success) {
                return {
                    success: true,
                    data: response.data,
                    message: 'Vacancy updated successfully',
                };
            }

            return { success: false, error: 'Failed to update vacancy' };
        } catch (error) {
            console.error('Update vacancy error:', error);
            return {
                success: false,
                error: error.message || 'Failed to update vacancy',
            };
        }
    },

    /**
     * Delete a vacancy (for companies)
     * @param {string} vacancyId - Vacancy ID
     * @returns {Promise<Object>} - Deletion result
     */
    async deleteVacancy(vacancyId) {
        try {
            const response = await window.APIService.delete(
                `/vacancies/${vacancyId}`,
                { requiresAuth: true }
            );

            if (response.success) {
                return {
                    success: true,
                    message: 'Vacancy deleted successfully',
                };
            }

            return { success: false, error: 'Failed to delete vacancy' };
        } catch (error) {
            console.error('Delete vacancy error:', error);
            return {
                success: false,
                error: error.message || 'Failed to delete vacancy',
            };
        }
    },
};

// Make VacanciesAPI available globally
window.VacanciesAPI = VacanciesAPI;

