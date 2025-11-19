// PROMME - Authentication API Module
// ====================================

/**
 * Authentication module with API integration
 * This module handles all authentication-related API calls
 */

const AuthAPI = {
    /**
     * Login user
     * @param {Object} credentials - User credentials
     * @param {string} credentials.email - User email
     * @param {string} credentials.password - User password
     * @param {string} credentials.profileType - Profile type
     * @param {boolean} credentials.rememberMe - Remember me flag
     * @returns {Promise<Object>} - User data and token
     */
    async login(credentials) {
        try {
            const response = await window.APIService.post('/auth/login', {
                email: credentials.email,
                password: credentials.password,
                profileType: credentials.profileType,
            });

            if (response.success) {
                // Store user data with token
                const userData = {
                    ...response.data.user,
                    token: response.data.token,
                    loginTime: new Date().toISOString(),
                    rememberMe: credentials.rememberMe,
                };

                localStorage.setItem('prommeAuthUser', JSON.stringify(userData));
                
                // Clear session flags
                sessionStorage.removeItem('aiChatShown');
                sessionStorage.setItem('freshLogin', 'true');

                return { success: true, data: userData };
            }

            return { success: false, error: 'Login failed' };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.message || 'Network error during login',
            };
        }
    },

    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @param {string} userData.name - User full name
     * @param {string} userData.email - User email
     * @param {string} userData.password - User password
     * @param {string} userData.profileType - Profile type
     * @returns {Promise<Object>} - User data and token
     */
    async register(userData) {
        try {
            const response = await window.APIService.post('/auth/register', {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                profileType: userData.profileType,
            });

            if (response.success) {
                // Store user data with token
                const userAuthData = {
                    ...response.data.user,
                    token: response.data.token,
                    loginTime: new Date().toISOString(),
                    rememberMe: true,
                };

                localStorage.setItem('prommeAuthUser', JSON.stringify(userAuthData));
                
                // Clear session flags
                sessionStorage.removeItem('aiChatShown');
                sessionStorage.setItem('freshLogin', 'true');

                return { success: true, data: userAuthData };
            }

            return { success: false, error: 'Registration failed' };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: error.message || 'Network error during registration',
            };
        }
    },

    /**
     * Logout user
     * @returns {Promise<Object>} - Logout result
     */
    async logout() {
        try {
            // Call logout endpoint
            await window.APIService.post('/auth/logout', {}, { requiresAuth: true });

            // Clear local storage
            localStorage.removeItem('prommeAuthUser');
            sessionStorage.clear();

            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            
            // Even if API call fails, clear local storage
            localStorage.removeItem('prommeAuthUser');
            sessionStorage.clear();

            return { success: true };
        }
    },

    /**
     * Verify authentication token
     * @returns {Promise<Object>} - Verification result
     */
    async verifyToken() {
        try {
            const response = await window.APIService.get('/auth/verify', {
                requiresAuth: true,
            });

            return { success: response.success, data: response.data };
        } catch (error) {
            console.error('Token verification error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Request password reset
     * @param {string} email - User email
     * @returns {Promise<Object>} - Reset request result
     */
    async requestPasswordReset(email) {
        try {
            const response = await window.APIService.post('/auth/password-reset-request', {
                email,
            });

            return {
                success: response.success,
                message: response.message || 'Reset link sent to email',
            };
        } catch (error) {
            console.error('Password reset request error:', error);
            return {
                success: false,
                error: error.message || 'Failed to send reset link',
            };
        }
    },

    /**
     * Reset password with token
     * @param {string} resetToken - Password reset token
     * @param {string} newPassword - New password
     * @returns {Promise<Object>} - Reset result
     */
    async resetPassword(resetToken, newPassword) {
        try {
            const response = await window.APIService.post('/auth/password-reset', {
                token: resetToken,
                newPassword,
            });

            return {
                success: response.success,
                message: response.message || 'Password reset successful',
            };
        } catch (error) {
            console.error('Password reset error:', error);
            return {
                success: false,
                error: error.message || 'Failed to reset password',
            };
        }
    },

    /**
     * Get current authenticated user
     * @returns {Object|null} - Current user data or null
     */
    getCurrentUser() {
        const userDataString = localStorage.getItem('prommeAuthUser');
        if (userDataString) {
            try {
                return JSON.parse(userDataString);
            } catch (error) {
                console.error('Error parsing user data:', error);
                return null;
            }
        }
        return null;
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} - Authentication status
     */
    isAuthenticated() {
        const user = this.getCurrentUser();
        return user !== null && user.token !== undefined;
    },

    /**
     * Update user profile
     * @param {Object} profileData - Profile data to update
     * @returns {Promise<Object>} - Update result
     */
    async updateProfile(profileData) {
        try {
            const response = await window.APIService.put('/profile', profileData, {
                requiresAuth: true,
            });

            if (response.success) {
                // Update stored user data
                const currentUser = this.getCurrentUser();
                if (currentUser) {
                    const updatedUser = {
                        ...currentUser,
                        ...response.data,
                    };
                    localStorage.setItem('prommeAuthUser', JSON.stringify(updatedUser));
                }

                return { success: true, data: response.data };
            }

            return { success: false, error: 'Profile update failed' };
        } catch (error) {
            console.error('Profile update error:', error);
            return {
                success: false,
                error: error.message || 'Failed to update profile',
            };
        }
    },
};

// Make AuthAPI available globally
window.AuthAPI = AuthAPI;

