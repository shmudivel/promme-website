/**
 * Supabase Client & Services for PROMME
 * 
 * This file provides complete integration with Supabase for:
 * - Authentication
 * - User Profiles
 * - Vacancies
 * - Applications
 * - Chats & Messages
 * - File Storage (photos, videos, resumes)
 * - Real-time updates
 */

// ============================================================================
// SUPABASE CLIENT INITIALIZATION
// ============================================================================

let supabaseClient = null;
let currentSupabaseUser = null;

/**
 * Initialize Supabase client
 */
function initializeSupabase() {
    const config = getEnvironmentConfig();
    
    if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
        console.warn('Supabase not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY to config.js');
        return null;
    }
    
    try {
        // Initialize Supabase client
        // Note: Include Supabase JS library in HTML: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
        supabaseClient = window.supabase.createClient(
            config.SUPABASE_URL,
            config.SUPABASE_ANON_KEY
        );
        
        console.log('✅ Supabase initialized successfully');
        
        // Set up auth state listener
        setupAuthListener();
        
        return supabaseClient;
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
        return null;
    }
}

/**
 * Setup authentication state listener
 */
function setupAuthListener() {
    supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (session) {
            currentSupabaseUser = session.user;
            handleUserLogin(session.user);
        } else {
            currentSupabaseUser = null;
            handleUserLogout();
        }
    });
}

/**
 * Handle user login
 */
function handleUserLogin(user) {
    console.log('User logged in:', user);
    // Store user data in localStorage
    localStorage.setItem('promme_user', JSON.stringify(user));
    // Update UI if needed
    if (typeof updateAuthUI === 'function') {
        updateAuthUI(true);
    }
}

/**
 * Handle user logout
 */
function handleUserLogout() {
    console.log('User logged out');
    localStorage.removeItem('promme_user');
    // Update UI if needed
    if (typeof updateAuthUI === 'function') {
        updateAuthUI(false);
    }
}

// ============================================================================
// AUTHENTICATION SERVICE
// ============================================================================

const SupabaseAuthService = {
    
    /**
     * Register new user
     */
    async register(email, password, userData = {}) {
        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: userData // Additional user metadata
                }
            });
            
            if (error) throw error;
            
            console.log('✅ User registered:', data);
            return { success: true, data };
            
        } catch (error) {
            console.error('❌ Registration failed:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Login user
     */
    async login(email, password) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            console.log('✅ User logged in:', data);
            return { success: true, data };
            
        } catch (error) {
            console.error('❌ Login failed:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Logout user
     */
    async logout() {
        try {
            const { error } = await supabaseClient.auth.signOut();
            
            if (error) throw error;
            
            console.log('✅ User logged out');
            return { success: true };
            
        } catch (error) {
            console.error('❌ Logout failed:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Get current user
     */
    async getCurrentUser() {
        try {
            const { data: { user }, error } = await supabaseClient.auth.getUser();
            
            if (error) throw error;
            
            return { success: true, user };
            
        } catch (error) {
            console.error('❌ Failed to get current user:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Reset password
     */
    async resetPassword(email) {
        try {
            const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
            
            if (error) throw error;
            
            console.log('✅ Password reset email sent');
            return { success: true };
            
        } catch (error) {
            console.error('❌ Password reset failed:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Update user password
     */
    async updatePassword(newPassword) {
        try {
            const { error } = await supabaseClient.auth.updateUser({
                password: newPassword
            });
            
            if (error) throw error;
            
            console.log('✅ Password updated');
            return { success: true };
            
        } catch (error) {
            console.error('❌ Password update failed:', error);
            return { success: false, error: error.message };
        }
    }
};

// ============================================================================
// PROFILE SERVICE
// ============================================================================

const SupabaseProfileService = {
    
    /**
     * Get user profile
     */
    async getProfile(userId) {
        try {
            const { data, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('user_id', userId)
                .single();
            
            if (error) throw error;
            
            return { success: true, profile: data };
            
        } catch (error) {
            console.error('❌ Failed to get profile:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Create or update profile
     */
    async updateProfile(userId, profileData) {
        try {
            const { data, error } = await supabaseClient
                .from('profiles')
                .upsert({
                    user_id: userId,
                    ...profileData,
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();
            
            if (error) throw error;
            
            console.log('✅ Profile updated:', data);
            return { success: true, profile: data };
            
        } catch (error) {
            console.error('❌ Failed to update profile:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Upload profile photo
     */
    async uploadPhoto(userId, file) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;
            
            const { error: uploadError } = await supabaseClient.storage
                .from('avatars')
                .upload(fileName, file);
            
            if (uploadError) throw uploadError;
            
            // Get public URL
            const { data: { publicUrl } } = supabaseClient.storage
                .from('avatars')
                .getPublicUrl(fileName);
            
            // Update profile with photo URL
            await this.updateProfile(userId, { photo_url: publicUrl });
            
            console.log('✅ Photo uploaded:', publicUrl);
            return { success: true, url: publicUrl };
            
        } catch (error) {
            console.error('❌ Photo upload failed:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Upload resume
     */
    async uploadResume(userId, file) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/resume-${Date.now()}.${fileExt}`;
            
            const { error: uploadError } = await supabaseClient.storage
                .from('resumes')
                .upload(fileName, file);
            
            if (uploadError) throw uploadError;
            
            // Get public URL
            const { data: { publicUrl } } = supabaseClient.storage
                .from('resumes')
                .getPublicUrl(fileName);
            
            // Update profile with resume URL
            await this.updateProfile(userId, { resume_url: publicUrl });
            
            console.log('✅ Resume uploaded:', publicUrl);
            return { success: true, url: publicUrl };
            
        } catch (error) {
            console.error('❌ Resume upload failed:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Upload video CV
     */
    async uploadVideo(userId, file) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/video-${Date.now()}.${fileExt}`;
            
            const { error: uploadError } = await supabaseClient.storage
                .from('videos')
                .upload(fileName, file);
            
            if (uploadError) throw uploadError;
            
            // Get public URL
            const { data: { publicUrl } } = supabaseClient.storage
                .from('videos')
                .getPublicUrl(fileName);
            
            // Update profile with video URL
            await this.updateProfile(userId, { video_url: publicUrl });
            
            console.log('✅ Video uploaded:', publicUrl);
            return { success: true, url: publicUrl };
            
        } catch (error) {
            console.error('❌ Video upload failed:', error);
            return { success: false, error: error.message };
        }
    }
};

// ============================================================================
// VACANCIES SERVICE
// ============================================================================

const SupabaseVacanciesService = {
    
    /**
     * Search vacancies
     */
    async searchVacancies(filters = {}) {
        try {
            let query = supabaseClient
                .from('vacancies')
                .select(`
                    *,
                    companies (
                        company_name,
                        logo_url,
                        description
                    )
                `)
                .eq('status', 'active');
            
            // Apply filters
            if (filters.query) {
                query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
            }
            if (filters.location) {
                query = query.eq('location', filters.location);
            }
            if (filters.salary_min) {
                query = query.gte('salary_min', filters.salary_min);
            }
            if (filters.salary_max) {
                query = query.lte('salary_max', filters.salary_max);
            }
            if (filters.employment_type) {
                query = query.eq('employment_type', filters.employment_type);
            }
            
            // Sorting
            query = query.order('created_at', { ascending: false });
            
            // Pagination
            const page = filters.page || 1;
            const pageSize = filters.pageSize || 20;
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;
            
            query = query.range(from, to);
            
            const { data, error, count } = await query;
            
            if (error) throw error;
            
            return {
                success: true,
                vacancies: data,
                totalCount: count,
                page: page,
                pageSize: pageSize
            };
            
        } catch (error) {
            console.error('❌ Failed to search vacancies:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Get vacancy by ID
     */
    async getVacancy(vacancyId) {
        try {
            const { data, error } = await supabaseClient
                .from('vacancies')
                .select(`
                    *,
                    companies (*)
                `)
                .eq('id', vacancyId)
                .single();
            
            if (error) throw error;
            
            return { success: true, vacancy: data };
            
        } catch (error) {
            console.error('❌ Failed to get vacancy:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Apply to vacancy
     */
    async applyToVacancy(vacancyId, userId, coverLetter = '') {
        try {
            const { data, error } = await supabaseClient
                .from('applications')
                .insert({
                    vacancy_id: vacancyId,
                    user_id: userId,
                    cover_letter: coverLetter,
                    status: 'pending'
                })
                .select()
                .single();
            
            if (error) throw error;
            
            console.log('✅ Application submitted:', data);
            return { success: true, application: data };
            
        } catch (error) {
            console.error('❌ Failed to apply:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Save vacancy
     */
    async saveVacancy(vacancyId, userId) {
        try {
            const { data, error } = await supabaseClient
                .from('saved_vacancies')
                .insert({
                    vacancy_id: vacancyId,
                    user_id: userId
                })
                .select()
                .single();
            
            if (error) throw error;
            
            console.log('✅ Vacancy saved:', data);
            return { success: true, data };
            
        } catch (error) {
            console.error('❌ Failed to save vacancy:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Get user's saved vacancies
     */
    async getSavedVacancies(userId) {
        try {
            const { data, error } = await supabaseClient
                .from('saved_vacancies')
                .select(`
                    *,
                    vacancies (
                        *,
                        companies (*)
                    )
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            return { success: true, savedVacancies: data };
            
        } catch (error) {
            console.error('❌ Failed to get saved vacancies:', error);
            return { success: false, error: error.message };
        }
    }
};

// ============================================================================
// CHAT SERVICE
// ============================================================================

const SupabaseChatService = {
    
    /**
     * Get user's chats
     */
    async getChats(userId) {
        try {
            const { data, error } = await supabaseClient
                .from('chats')
                .select(`
                    *,
                    messages (
                        content,
                        created_at
                    )
                `)
                .or(`user_id.eq.${userId},company_id.eq.${userId}`)
                .order('updated_at', { ascending: false });
            
            if (error) throw error;
            
            return { success: true, chats: data };
            
        } catch (error) {
            console.error('❌ Failed to get chats:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Get messages for a chat
     */
    async getMessages(chatId) {
        try {
            const { data, error } = await supabaseClient
                .from('messages')
                .select('*')
                .eq('chat_id', chatId)
                .order('created_at', { ascending: true });
            
            if (error) throw error;
            
            return { success: true, messages: data };
            
        } catch (error) {
            console.error('❌ Failed to get messages:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Send message
     */
    async sendMessage(chatId, userId, content, messageType = 'text') {
        try {
            const { data, error } = await supabaseClient
                .from('messages')
                .insert({
                    chat_id: chatId,
                    sender_id: userId,
                    content: content,
                    message_type: messageType
                })
                .select()
                .single();
            
            if (error) throw error;
            
            // Update chat's updated_at
            await supabaseClient
                .from('chats')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', chatId);
            
            console.log('✅ Message sent:', data);
            return { success: true, message: data };
            
        } catch (error) {
            console.error('❌ Failed to send message:', error);
            return { success: false, error: error.message };
        }
    },
    
    /**
     * Subscribe to new messages (real-time)
     */
    subscribeToMessages(chatId, callback) {
        const subscription = supabaseClient
            .from('messages')
            .on('INSERT', payload => {
                if (payload.new.chat_id === chatId) {
                    callback(payload.new);
                }
            })
            .subscribe();
        
        return subscription;
    },
    
    /**
     * Unsubscribe from messages
     */
    unsubscribeFromMessages(subscription) {
        supabaseClient.removeSubscription(subscription);
    }
};

// ============================================================================
// INITIALIZE ON PAGE LOAD
// ============================================================================

// Auto-initialize when config is ready
if (typeof getEnvironmentConfig === 'function') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeSupabase();
    });
}

// Export services for use in other files
window.SupabaseClient = supabaseClient;
window.SupabaseAuthService = SupabaseAuthService;
window.SupabaseProfileService = SupabaseProfileService;
window.SupabaseVacanciesService = SupabaseVacanciesService;
window.SupabaseChatService = SupabaseChatService;

