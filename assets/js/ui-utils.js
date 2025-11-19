// PROMME - UI Utilities
// ======================

/**
 * UI utilities for loading states, error handling, and user feedback
 */

const UIUtils = {
    /**
     * Show loading overlay
     * @param {string} message - Loading message (optional)
     */
    showLoading(message = 'Загрузка...') {
        // Remove existing overlay if any
        this.hideLoading();

        const overlay = document.createElement('div');
        overlay.id = 'promme-loading-overlay';
        overlay.className = 'promme-loading-overlay';
        overlay.innerHTML = `
            <div class="promme-loading-content">
                <div class="promme-spinner"></div>
                <p class="promme-loading-message">${message}</p>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // Add CSS if not already added
        if (!document.getElementById('promme-ui-utils-styles')) {
            const styles = document.createElement('style');
            styles.id = 'promme-ui-utils-styles';
            styles.textContent = `
                .promme-loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999999;
                    backdrop-filter: blur(4px);
                }
                
                .promme-loading-content {
                    text-align: center;
                    color: white;
                }
                
                .promme-spinner {
                    width: 60px;
                    height: 60px;
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-top-color: #FF6B35;
                    border-radius: 50%;
                    animation: promme-spin 1s linear infinite;
                    margin: 0 auto 20px;
                }
                
                @keyframes promme-spin {
                    to { transform: rotate(360deg); }
                }
                
                .promme-loading-message {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0;
                }
                
                .promme-toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    min-width: 300px;
                    max-width: 500px;
                    padding: 16px 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    z-index: 1000000;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    animation: promme-toast-slide-in 0.3s ease;
                }
                
                @keyframes promme-toast-slide-in {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .promme-toast.success {
                    border-left: 4px solid #4CAF50;
                }
                
                .promme-toast.error {
                    border-left: 4px solid #F44336;
                }
                
                .promme-toast.warning {
                    border-left: 4px solid #FF9800;
                }
                
                .promme-toast.info {
                    border-left: 4px solid #2196F3;
                }
                
                .promme-toast-icon {
                    font-size: 24px;
                }
                
                .promme-toast-content {
                    flex: 1;
                }
                
                .promme-toast-title {
                    font-weight: 700;
                    margin: 0 0 4px 0;
                    color: #1a1a1a;
                }
                
                .promme-toast-message {
                    margin: 0;
                    color: #666;
                    font-size: 14px;
                }
                
                .promme-toast-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 20px;
                    color: #999;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                }
                
                .promme-toast-close:hover {
                    background: #f0f0f0;
                    color: #333;
                }
                
                @media (max-width: 768px) {
                    .promme-toast {
                        right: 10px;
                        left: 10px;
                        min-width: auto;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    },

    /**
     * Hide loading overlay
     */
    hideLoading() {
        const overlay = document.getElementById('promme-loading-overlay');
        if (overlay) {
            overlay.remove();
            document.body.style.overflow = '';
        }
    },

    /**
     * Update loading message
     * @param {string} message - New loading message
     */
    updateLoadingMessage(message) {
        const messageElement = document.querySelector('.promme-loading-message');
        if (messageElement) {
            messageElement.textContent = message;
        }
    },

    /**
     * Show toast notification
     * @param {Object} options - Toast options
     * @param {string} options.type - Toast type: 'success', 'error', 'warning', 'info'
     * @param {string} options.title - Toast title
     * @param {string} options.message - Toast message
     * @param {number} options.duration - Duration in milliseconds (default: 5000)
     */
    showToast(options = {}) {
        const {
            type = 'info',
            title = '',
            message = '',
            duration = 5000,
        } = options;

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ',
        };

        const toast = document.createElement('div');
        toast.className = `promme-toast ${type}`;
        toast.innerHTML = `
            <div class="promme-toast-icon">${icons[type] || icons.info}</div>
            <div class="promme-toast-content">
                ${title ? `<div class="promme-toast-title">${title}</div>` : ''}
                ${message ? `<div class="promme-toast-message">${message}</div>` : ''}
            </div>
            <button class="promme-toast-close" aria-label="Close">×</button>
        `;

        document.body.appendChild(toast);

        // Close button handler
        const closeButton = toast.querySelector('.promme-toast-close');
        closeButton.addEventListener('click', () => {
            toast.remove();
        });

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                toast.remove();
            }, duration);
        }
    },

    /**
     * Show success toast
     * @param {string} message - Success message
     * @param {string} title - Success title (optional)
     */
    showSuccess(message, title = 'Успешно') {
        this.showToast({
            type: 'success',
            title,
            message,
        });
    },

    /**
     * Show error toast
     * @param {string} message - Error message
     * @param {string} title - Error title (optional)
     */
    showError(message, title = 'Ошибка') {
        this.showToast({
            type: 'error',
            title,
            message,
            duration: 7000,
        });
    },

    /**
     * Show warning toast
     * @param {string} message - Warning message
     * @param {string} title - Warning title (optional)
     */
    showWarning(message, title = 'Внимание') {
        this.showToast({
            type: 'warning',
            title,
            message,
            duration: 6000,
        });
    },

    /**
     * Show info toast
     * @param {string} message - Info message
     * @param {string} title - Info title (optional)
     */
    showInfo(message, title = 'Информация') {
        this.showToast({
            type: 'info',
            title,
            message,
        });
    },

    /**
     * Handle API error and show appropriate message
     * @param {Error} error - Error object
     * @param {string} fallbackMessage - Fallback message if error has no message
     */
    handleError(error, fallbackMessage = 'Произошла ошибка') {
        console.error('Error:', error);

        let errorMessage = fallbackMessage;
        
        if (error instanceof window.APIError) {
            errorMessage = error.message;
            
            // Handle specific error codes
            if (error.status === 401) {
                errorMessage = 'Необходима авторизация';
                // Optionally redirect to login
                setTimeout(() => {
                    window.location.href = 'auth.html';
                }, 2000);
            } else if (error.status === 403) {
                errorMessage = 'Доступ запрещен';
            } else if (error.status === 404) {
                errorMessage = 'Ресурс не найден';
            } else if (error.status === 500) {
                errorMessage = 'Ошибка сервера. Попробуйте позже';
            }
        } else if (error.message) {
            errorMessage = error.message;
        }

        this.showError(errorMessage);
    },

    /**
     * Show confirmation dialog
     * @param {Object} options - Dialog options
     * @param {string} options.title - Dialog title
     * @param {string} options.message - Dialog message
     * @param {string} options.confirmText - Confirm button text (default: 'Подтвердить')
     * @param {string} options.cancelText - Cancel button text (default: 'Отмена')
     * @returns {Promise<boolean>} - True if confirmed, false if cancelled
     */
    async confirm(options = {}) {
        const {
            title = 'Подтверждение',
            message = '',
            confirmText = 'Подтвердить',
            cancelText = 'Отмена',
        } = options;

        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'promme-loading-overlay';
            overlay.innerHTML = `
                <div style="background: white; border-radius: 16px; padding: 32px; max-width: 400px; text-align: center;">
                    <h2 style="margin: 0 0 16px 0; font-size: 24px; color: #1a1a1a;">${title}</h2>
                    <p style="margin: 0 0 24px 0; color: #666; line-height: 1.6;">${message}</p>
                    <div style="display: flex; gap: 12px; justify-content: center;">
                        <button id="promme-confirm-cancel" style="flex: 1; padding: 12px 24px; background: #f0f0f0; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                            ${cancelText}
                        </button>
                        <button id="promme-confirm-ok" style="flex: 1; padding: 12px 24px; background: linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                            ${confirmText}
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            const cancelButton = overlay.querySelector('#promme-confirm-cancel');
            const okButton = overlay.querySelector('#promme-confirm-ok');

            cancelButton.addEventListener('click', () => {
                overlay.remove();
                resolve(false);
            });

            okButton.addEventListener('click', () => {
                overlay.remove();
                resolve(true);
            });
        });
    },

    /**
     * Disable button with loading state
     * @param {HTMLElement} button - Button element
     * @param {string} loadingText - Loading text (optional)
     */
    setButtonLoading(button, loadingText = 'Загрузка...') {
        if (!button) return;

        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = loadingText;
        button.style.opacity = '0.7';
        button.style.cursor = 'not-allowed';
    },

    /**
     * Reset button from loading state
     * @param {HTMLElement} button - Button element
     */
    resetButton(button) {
        if (!button) return;

        button.disabled = false;
        if (button.dataset.originalText) {
            button.textContent = button.dataset.originalText;
        }
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
    },

    /**
     * Show form validation error
     * @param {HTMLElement} input - Input element
     * @param {string} message - Error message
     */
    showFieldError(input, message) {
        if (!input) return;

        // Remove existing error
        this.clearFieldError(input);

        // Add error class
        input.classList.add('field-error');
        input.style.borderColor = '#F44336';

        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#F44336';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '4px';

        // Insert error message after input
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    },

    /**
     * Clear form validation error
     * @param {HTMLElement} input - Input element
     */
    clearFieldError(input) {
        if (!input) return;

        input.classList.remove('field-error');
        input.style.borderColor = '';

        // Remove error message
        const errorElement = input.parentNode.querySelector('.field-error-message');
        if (errorElement) {
            errorElement.remove();
        }
    },
};

// Make UIUtils available globally
window.UIUtils = UIUtils;

