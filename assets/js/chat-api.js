// PROMME - Chat API Module
// =========================

/**
 * Chat API module for messaging functionality
 * This module handles all chat and messaging-related API calls
 */

const ChatAPI = {
    /**
     * Get all chats for current user
     * @param {Object} params - Query parameters
     * @param {string} params.type - Chat type filter ('direct', 'group', 'support')
     * @param {boolean} params.archived - Include archived chats
     * @returns {Promise<Object>} - Chats list
     */
    async getChats(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined) {
                    queryParams.append(key, params[key]);
                }
            });

            const queryString = queryParams.toString();
            const endpoint = queryString ? `/chats?${queryString}` : '/chats';

            const response = await window.APIService.get(endpoint, {
                requiresAuth: true,
            });

            if (response.success) {
                return {
                    success: true,
                    data: response.data.chats || [],
                };
            }

            return { success: false, error: 'Failed to fetch chats' };
        } catch (error) {
            console.error('Get chats error:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch chats',
            };
        }
    },

    /**
     * Get single chat by ID
     * @param {string} chatId - Chat ID
     * @returns {Promise<Object>} - Chat details
     */
    async getChatById(chatId) {
        try {
            const response = await window.APIService.get(`/chats/${chatId}`, {
                requiresAuth: true,
            });

            if (response.success) {
                return { success: true, data: response.data };
            }

            return { success: false, error: 'Chat not found' };
        } catch (error) {
            console.error('Get chat error:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch chat',
            };
        }
    },

    /**
     * Create new chat or get existing one
     * @param {Object} chatData - Chat data
     * @param {string} chatData.recipientId - Other user's ID
     * @param {string} chatData.vacancyId - Related vacancy ID (optional)
     * @param {string} chatData.applicationId - Related application ID (optional)
     * @returns {Promise<Object>} - Created/existing chat
     */
    async createChat(chatData) {
        try {
            const response = await window.APIService.post('/chats', chatData, {
                requiresAuth: true,
            });

            if (response.success) {
                return {
                    success: true,
                    data: response.data,
                    message: 'Chat created successfully',
                };
            }

            return { success: false, error: 'Failed to create chat' };
        } catch (error) {
            console.error('Create chat error:', error);
            return {
                success: false,
                error: error.message || 'Failed to create chat',
            };
        }
    },

    /**
     * Get messages in a chat
     * @param {string} chatId - Chat ID
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number
     * @param {number} params.limit - Messages per page
     * @param {string} params.before - Get messages before this message ID
     * @returns {Promise<Object>} - Messages list
     */
    async getMessages(chatId, params = {}) {
        try {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined) {
                    queryParams.append(key, params[key]);
                }
            });

            const queryString = queryParams.toString();
            const endpoint = queryString
                ? `/chats/${chatId}/messages?${queryString}`
                : `/chats/${chatId}/messages`;

            const response = await window.APIService.get(endpoint, {
                requiresAuth: true,
            });

            if (response.success) {
                return {
                    success: true,
                    data: response.data.messages || [],
                    pagination: {
                        page: response.data.page || 1,
                        limit: response.data.limit || 50,
                        total: response.data.total || 0,
                    },
                };
            }

            return { success: false, error: 'Failed to fetch messages' };
        } catch (error) {
            console.error('Get messages error:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch messages',
            };
        }
    },

    /**
     * Send message to chat
     * @param {string} chatId - Chat ID
     * @param {Object} messageData - Message data
     * @param {string} messageData.text - Message text
     * @param {string} messageData.type - Message type ('text', 'image', 'file')
     * @param {string} messageData.replyToMessageId - Reply to message ID (optional)
     * @returns {Promise<Object>} - Sent message
     */
    async sendMessage(chatId, messageData) {
        try {
            const response = await window.APIService.post(
                `/chats/${chatId}/messages`,
                {
                    messageText: messageData.text,
                    messageType: messageData.type || 'text',
                    replyToMessageId: messageData.replyToMessageId,
                },
                { requiresAuth: true }
            );

            if (response.success) {
                return {
                    success: true,
                    data: response.data,
                    message: 'Message sent successfully',
                };
            }

            return { success: false, error: 'Failed to send message' };
        } catch (error) {
            console.error('Send message error:', error);
            return {
                success: false,
                error: error.message || 'Failed to send message',
            };
        }
    },

    /**
     * Send file/image message
     * @param {string} chatId - Chat ID
     * @param {File} file - File to send
     * @param {string} caption - Optional caption/message text
     * @returns {Promise<Object>} - Sent message with file
     */
    async sendFileMessage(chatId, file, caption = '') {
        try {
            const response = await window.APIService.uploadFile(
                `/chats/${chatId}/messages/file`,
                file,
                { caption }
            );

            if (response.success) {
                return {
                    success: true,
                    data: response.data,
                    message: 'File sent successfully',
                };
            }

            return { success: false, error: 'Failed to send file' };
        } catch (error) {
            console.error('Send file message error:', error);
            return {
                success: false,
                error: error.message || 'Failed to send file',
            };
        }
    },

    /**
     * Mark message as read
     * @param {string} chatId - Chat ID
     * @param {string} messageId - Message ID
     * @returns {Promise<Object>} - Update result
     */
    async markMessageAsRead(chatId, messageId) {
        try {
            const response = await window.APIService.post(
                `/chats/${chatId}/messages/${messageId}/read`,
                {},
                { requiresAuth: true }
            );

            if (response.success) {
                return {
                    success: true,
                    message: 'Message marked as read',
                };
            }

            return { success: false, error: 'Failed to mark message as read' };
        } catch (error) {
            console.error('Mark message as read error:', error);
            return {
                success: false,
                error: error.message || 'Failed to mark message as read',
            };
        }
    },

    /**
     * Mark all messages in chat as read
     * @param {string} chatId - Chat ID
     * @returns {Promise<Object>} - Update result
     */
    async markChatAsRead(chatId) {
        try {
            const response = await window.APIService.post(
                `/chats/${chatId}/read-all`,
                {},
                { requiresAuth: true }
            );

            if (response.success) {
                return {
                    success: true,
                    message: 'All messages marked as read',
                };
            }

            return { success: false, error: 'Failed to mark chat as read' };
        } catch (error) {
            console.error('Mark chat as read error:', error);
            return {
                success: false,
                error: error.message || 'Failed to mark chat as read',
            };
        }
    },

    /**
     * Delete message
     * @param {string} chatId - Chat ID
     * @param {string} messageId - Message ID
     * @returns {Promise<Object>} - Deletion result
     */
    async deleteMessage(chatId, messageId) {
        try {
            const response = await window.APIService.delete(
                `/chats/${chatId}/messages/${messageId}`,
                { requiresAuth: true }
            );

            if (response.success) {
                return {
                    success: true,
                    message: 'Message deleted successfully',
                };
            }

            return { success: false, error: 'Failed to delete message' };
        } catch (error) {
            console.error('Delete message error:', error);
            return {
                success: false,
                error: error.message || 'Failed to delete message',
            };
        }
    },

    /**
     * Edit message
     * @param {string} chatId - Chat ID
     * @param {string} messageId - Message ID
     * @param {string} newText - New message text
     * @returns {Promise<Object>} - Update result
     */
    async editMessage(chatId, messageId, newText) {
        try {
            const response = await window.APIService.put(
                `/chats/${chatId}/messages/${messageId}`,
                { messageText: newText },
                { requiresAuth: true }
            );

            if (response.success) {
                return {
                    success: true,
                    data: response.data,
                    message: 'Message edited successfully',
                };
            }

            return { success: false, error: 'Failed to edit message' };
        } catch (error) {
            console.error('Edit message error:', error);
            return {
                success: false,
                error: error.message || 'Failed to edit message',
            };
        }
    },

    /**
     * Archive chat
     * @param {string} chatId - Chat ID
     * @returns {Promise<Object>} - Update result
     */
    async archiveChat(chatId) {
        try {
            const response = await window.APIService.post(
                `/chats/${chatId}/archive`,
                {},
                { requiresAuth: true }
            );

            if (response.success) {
                return {
                    success: true,
                    message: 'Chat archived successfully',
                };
            }

            return { success: false, error: 'Failed to archive chat' };
        } catch (error) {
            console.error('Archive chat error:', error);
            return {
                success: false,
                error: error.message || 'Failed to archive chat',
            };
        }
    },

    /**
     * Unarchive chat
     * @param {string} chatId - Chat ID
     * @returns {Promise<Object>} - Update result
     */
    async unarchiveChat(chatId) {
        try {
            const response = await window.APIService.post(
                `/chats/${chatId}/unarchive`,
                {},
                { requiresAuth: true }
            );

            if (response.success) {
                return {
                    success: true,
                    message: 'Chat unarchived successfully',
                };
            }

            return { success: false, error: 'Failed to unarchive chat' };
        } catch (error) {
            console.error('Unarchive chat error:', error);
            return {
                success: false,
                error: error.message || 'Failed to unarchive chat',
            };
        }
    },

    /**
     * Get unread messages count
     * @returns {Promise<Object>} - Unread count
     */
    async getUnreadCount() {
        try {
            const response = await window.APIService.get('/chats/unread-count', {
                requiresAuth: true,
            });

            if (response.success) {
                return {
                    success: true,
                    data: {
                        count: response.data.count || 0,
                        chats: response.data.chats || [],
                    },
                };
            }

            return { success: false, error: 'Failed to get unread count' };
        } catch (error) {
            console.error('Get unread count error:', error);
            return {
                success: false,
                error: error.message || 'Failed to get unread count',
            };
        }
    },

    /**
     * Search messages in chat
     * @param {string} chatId - Chat ID
     * @param {string} searchQuery - Search query
     * @returns {Promise<Object>} - Search results
     */
    async searchMessages(chatId, searchQuery) {
        try {
            const response = await window.APIService.get(
                `/chats/${chatId}/messages/search?q=${encodeURIComponent(searchQuery)}`,
                { requiresAuth: true }
            );

            if (response.success) {
                return {
                    success: true,
                    data: response.data.messages || [],
                };
            }

            return { success: false, error: 'Search failed' };
        } catch (error) {
            console.error('Search messages error:', error);
            return {
                success: false,
                error: error.message || 'Search failed',
            };
        }
    },

    /**
     * Get typing status for a chat
     * @param {string} chatId - Chat ID
     * @returns {Promise<Object>} - Typing status
     */
    async getTypingStatus(chatId) {
        try {
            const response = await window.APIService.get(
                `/chats/${chatId}/typing`,
                { requiresAuth: true }
            );

            if (response.success) {
                return {
                    success: true,
                    data: {
                        isTyping: response.data.isTyping || false,
                        userId: response.data.userId,
                    },
                };
            }

            return { success: false, error: 'Failed to get typing status' };
        } catch (error) {
            console.error('Get typing status error:', error);
            return {
                success: false,
                error: error.message || 'Failed to get typing status',
            };
        }
    },

    /**
     * Send typing indicator
     * @param {string} chatId - Chat ID
     * @param {boolean} isTyping - Typing status
     * @returns {Promise<Object>} - Update result
     */
    async sendTypingIndicator(chatId, isTyping = true) {
        try {
            const response = await window.APIService.post(
                `/chats/${chatId}/typing`,
                { isTyping },
                { requiresAuth: true }
            );

            if (response.success) {
                return { success: true };
            }

            return { success: false, error: 'Failed to send typing indicator' };
        } catch (error) {
            console.error('Send typing indicator error:', error);
            return {
                success: false,
                error: error.message || 'Failed to send typing indicator',
            };
        }
    },
};

// Make ChatAPI available globally
window.ChatAPI = ChatAPI;

