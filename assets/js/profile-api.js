// PROMME - Profile API Module
// ============================

/**
 * Profile API module for user profile management
 * This module handles all profile-related API calls
 */

const ProfileAPI = {
    /**
     * Get user profile by ID
     * @param {string} userId - User ID (optional, uses current user if not provided)
     * @returns {Promise<Object>} - User profile data
     */
    async getProfile(userId = null) {
        try {
            const endpoint = userId ? `/profile/${userId}` : '/profile';
            const response = await window.APIService.get(endpoint, {
                requiresAuth: true,
            });

            if (response.success) {
                return { success: true, data: response.data };
            }

            return { success: false, error: 'Profile not found' };
        } catch (error) {
            console.error('Get profile error:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch profile',
            };
        }
    },

    /**
     * Update user profile
     * @param {Object} profileData - Profile data to update
     * @returns {Promise<Object>} - Updated profile data
     */
    async updateProfile(profileData) {
        try {
            const response = await window.APIService.put('/profile', profileData, {
                requiresAuth: true,
            });

            if (response.success) {
                // Update local storage
                const currentUser = window.AuthAPI?.getCurrentUser();
                if (currentUser) {
                    const updatedUser = {
                        ...currentUser,
                        profileData: response.data,
                    };
                    localStorage.setItem('prommeAuthUser', JSON.stringify(updatedUser));
                }

                return {
                    success: true,
                    data: response.data,
                    message: 'Profile updated successfully',
                };
            }

            return { success: false, error: 'Profile update failed' };
        } catch (error) {
            console.error('Update profile error:', error);
            return {
                success: false,
                error: error.message || 'Failed to update profile',
            };
        }
    },

    /**
     * Upload profile photo
     * @param {File} photoFile - Photo file to upload
     * @returns {Promise<Object>} - Uploaded photo URL
     */
    async uploadProfilePhoto(photoFile) {
        try {
            const response = await window.APIService.uploadFile(
                '/profile/photo',
                photoFile
            );

            if (response.success) {
                return {
                    success: true,
                    data: {
                        photoUrl: response.data.url,
                    },
                    message: 'Photo uploaded successfully',
                };
            }

            return { success: false, error: 'Photo upload failed' };
        } catch (error) {
            console.error('Upload photo error:', error);
            return {
                success: false,
                error: error.message || 'Failed to upload photo',
            };
        }
    },

    /**
     * Upload resume/CV file
     * @param {File} resumeFile - Resume file to upload
     * @returns {Promise<Object>} - Uploaded resume URL and parsed data
     */
    async uploadResume(resumeFile) {
        try {
            const response = await window.APIService.uploadFile(
                '/profile/resume',
                resumeFile
            );

            if (response.success) {
                return {
                    success: true,
                    data: {
                        resumeUrl: response.data.url,
                        parsedData: response.data.parsedData || null,
                    },
                    message: 'Resume uploaded successfully',
                };
            }

            return { success: false, error: 'Resume upload failed' };
        } catch (error) {
            console.error('Upload resume error:', error);
            return {
                success: false,
                error: error.message || 'Failed to upload resume',
            };
        }
    },

    /**
     * Parse resume using AI
     * @param {File} resumeFile - Resume file to parse
     * @returns {Promise<Object>} - Parsed resume data
     */
    async parseResume(resumeFile) {
        try {
            const response = await window.APIService.uploadFile(
                '/ai/parse-resume',
                resumeFile
            );

            if (response.success) {
                return {
                    success: true,
                    data: response.data,
                    message: 'Resume parsed successfully',
                };
            }

            return { success: false, error: 'Resume parsing failed' };
        } catch (error) {
            console.error('Parse resume error:', error);
            return {
                success: false,
                error: error.message || 'Failed to parse resume',
            };
        }
    },

    /**
     * Generate profile from text using AI
     * @param {string} text - Text description to parse
     * @returns {Promise<Object>} - Generated profile data
     */
    async generateProfileFromText(text) {
        try {
            const response = await window.APIService.post('/ai/generate-profile', {
                text,
            });

            if (response.success) {
                return {
                    success: true,
                    data: response.data,
                    message: 'Profile generated successfully',
                };
            }

            return { success: false, error: 'Profile generation failed' };
        } catch (error) {
            console.error('Generate profile error:', error);
            return {
                success: false,
                error: error.message || 'Failed to generate profile',
            };
        }
    },

    /**
     * Get profile completion percentage
     * @returns {Promise<Object>} - Profile completion data
     */
    async getProfileCompletion() {
        try {
            const response = await window.APIService.get('/profile/completion', {
                requiresAuth: true,
            });

            if (response.success) {
                return {
                    success: true,
                    data: {
                        percentage: response.data.percentage || 0,
                        missingFields: response.data.missingFields || [],
                    },
                };
            }

            return { success: false, error: 'Failed to get profile completion' };
        } catch (error) {
            console.error('Get profile completion error:', error);
            return {
                success: false,
                error: error.message || 'Failed to get profile completion',
            };
        }
    },

    /**
     * Get profile statistics
     * @returns {Promise<Object>} - Profile statistics
     */
    async getProfileStats() {
        try {
            const response = await window.APIService.get('/profile/stats', {
                requiresAuth: true,
            });

            if (response.success) {
                return {
                    success: true,
                    data: response.data,
                };
            }

            return { success: false, error: 'Failed to get profile stats' };
        } catch (error) {
            console.error('Get profile stats error:', error);
            return {
                success: false,
                error: error.message || 'Failed to get profile stats',
            };
        }
    },

    /**
     * Delete user profile
     * @returns {Promise<Object>} - Deletion result
     */
    async deleteProfile() {
        try {
            const response = await window.APIService.delete('/profile', {
                requiresAuth: true,
            });

            if (response.success) {
                // Clear local storage
                localStorage.removeItem('prommeAuthUser');
                sessionStorage.clear();

                return {
                    success: true,
                    message: 'Profile deleted successfully',
                };
            }

            return { success: false, error: 'Profile deletion failed' };
        } catch (error) {
            console.error('Delete profile error:', error);
            return {
                success: false,
                error: error.message || 'Failed to delete profile',
            };
        }
    },

    /**
     * Get profile visibility settings
     * @returns {Promise<Object>} - Visibility settings
     */
    async getVisibilitySettings() {
        try {
            const response = await window.APIService.get('/profile/visibility', {
                requiresAuth: true,
            });

            if (response.success) {
                return {
                    success: true,
                    data: response.data,
                };
            }

            return { success: false, error: 'Failed to get visibility settings' };
        } catch (error) {
            console.error('Get visibility settings error:', error);
            return {
                success: false,
                error: error.message || 'Failed to get visibility settings',
            };
        }
    },

    /**
     * Update profile visibility settings
     * @param {Object} visibilitySettings - Visibility settings
     * @returns {Promise<Object>} - Update result
     */
    async updateVisibilitySettings(visibilitySettings) {
        try {
            const response = await window.APIService.put(
                '/profile/visibility',
                visibilitySettings,
                { requiresAuth: true }
            );

            if (response.success) {
                return {
                    success: true,
                    data: response.data,
                    message: 'Visibility settings updated successfully',
                };
            }

            return { success: false, error: 'Failed to update visibility settings' };
        } catch (error) {
            console.error('Update visibility settings error:', error);
            return {
                success: false,
                error: error.message || 'Failed to update visibility settings',
            };
        }
    },

    /**
     * Generate AI video for profile
     * @param {Object} videoData - Video generation parameters
     * @param {File} videoData.photo - User photo for avatar
     * @param {string} videoData.script - Video script (optional)
     * @returns {Promise<Object>} - Video generation result
     */
    async generateAIVideo(videoData) {
        try {
            let response;
            
            if (videoData.photo instanceof File) {
                // Upload photo and generate video
                response = await window.APIService.uploadFile(
                    '/ai/generate-video',
                    videoData.photo,
                    { script: videoData.script || '' }
                );
            } else {
                // Use existing photo URL
                response = await window.APIService.post('/ai/generate-video', {
                    photoUrl: videoData.photoUrl,
                    script: videoData.script || '',
                });
            }

            if (response.success) {
                return {
                    success: true,
                    data: {
                        videoUrl: response.data.videoUrl,
                        thumbnailUrl: response.data.thumbnailUrl,
                    },
                    message: 'AI video generated successfully',
                };
            }

            return { success: false, error: 'Video generation failed' };
        } catch (error) {
            console.error('Generate AI video error:', error);
            return {
                success: false,
                error: error.message || 'Failed to generate AI video',
            };
        }
    },
};

// Make ProfileAPI available globally
window.ProfileAPI = ProfileAPI;

