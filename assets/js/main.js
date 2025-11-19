// PROMME - Main JavaScript
// =========================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('PROMME Portal initialized');

    // Check authentication and update UI
    updateAuthenticationUI();

    // Initialize components
    initializeNavigation();
    initializeSearch();
    initializeSmoothScroll();
    initializeHeaderButtons();
    initializeFooter();
    initializeMenuModal();
    initializeMapSection();
    initializeProfileForm();
    
    // Check for new login and show AI chat if needed
    checkForNewLogin();
});

/**
 * Update UI based on authentication status
 */
function updateAuthenticationUI() {
    const authenticatedUser = localStorage.getItem('prommeAuthUser');
    const authButtons = document.getElementById('authButtons');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');

    if (authenticatedUser) {
        // User is logged in
        const userData = JSON.parse(authenticatedUser);

        if (authButtons) authButtons.style.display = 'none';
        if (userProfile) userProfile.style.display = 'flex';
        if (userName) userName.textContent = userData.name || 'Пользователь';

        console.log('User authenticated:', userData.name);
    } else {
        // User is not logged in
        if (authButtons) authButtons.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';

        console.log('User not authenticated');
    }
}


/**
 * Logout user
 */
function logoutUser() {
    localStorage.removeItem('prommeAuthUser');
    console.log('User logged out');

    // Redirect to auth page
    window.location.href = 'auth.html';
}

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');

            // If it's an internal anchor link
            if (targetId.startsWith('#')) {
                event.preventDefault();
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Auto-hide navbar on scroll
    initializeNavbarAutoHide();
}

/**
 * Auto-hide navbar on scroll down, show on scroll up
 */
function initializeNavbarAutoHide() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScrollPosition = 0;
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
        const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Don't hide navbar if at top of page
        if (currentScrollPosition <= 50) {
            header.style.transform = 'translateY(0)';
            header.style.transition = 'transform 0.3s ease';
            lastScrollPosition = currentScrollPosition;
            return;
        }
        
        // Scrolling down - hide navbar
        if (currentScrollPosition > lastScrollPosition && !isScrolling) {
            header.style.transform = 'translateY(-100%)';
            header.style.transition = 'transform 0.3s ease';
        } 
        // Scrolling up - show navbar
        else if (currentScrollPosition < lastScrollPosition) {
            header.style.transform = 'translateY(0)';
            header.style.transition = 'transform 0.3s ease';
        }
        
        lastScrollPosition = currentScrollPosition;
    });
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const heroSearchInput = document.querySelector('.hero-search-input');
    const heroSearchButton = document.querySelector('.hero-search-btn');
    const locationButton = document.querySelector('.hero-location-btn');
    const scrollButton = document.querySelector('.hero-scroll-btn');
    const aiChatButton = document.querySelector('.ai-chat-btn');
    const locationBadges = document.querySelectorAll('.location-badge');

    // Hero search button
    if (heroSearchButton) {
        heroSearchButton.addEventListener('click', function () {
            const searchTerm = heroSearchInput.value.trim();

            if (searchTerm) {
                performSearch(searchTerm);
            } else {
                alert('Пожалуйста, введите поисковый запрос');
            }
        });
    }

    // Allow search on Enter key
    if (heroSearchInput) {
        heroSearchInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                heroSearchButton.click();
            }
        });
    }

    // Location button - use geolocation
    if (locationButton) {
        locationButton.addEventListener('click', function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        console.log('Location:', position.coords);
                        alert(`Ваше местоположение определено:\nШирота: ${position.coords.latitude.toFixed(4)}\nДолгота: ${position.coords.longitude.toFixed(4)}`);
                    },
                    function (error) {
                        console.error('Geolocation error:', error);
                        alert('Не удалось определить местоположение');
                    }
                );
            } else {
                alert('Геолокация не поддерживается вашим браузером');
            }
        });
    }

    // Scroll down button
    if (scrollButton) {
        scrollButton.addEventListener('click', function () {
            const mapSection = document.getElementById('map');
            if (mapSection) {
                mapSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // AI Chat button
    if (aiChatButton) {
        aiChatButton.addEventListener('click', function () {
            console.log('AI Chat clicked');
            toggleAIChatModal();
        });
    }

    // Location badges
    locationBadges.forEach(badge => {
        badge.addEventListener('click', function () {
            const locationText = this.textContent.trim();
            console.log('Location badge clicked:', locationText);
            performSearch(locationText);
        });
    });
}

/**
 * Perform search operation
 * @param {string} searchTerm - The search query
 */
function performSearch(searchTerm) {
    console.log('Searching for:', searchTerm);

    // TODO: Implement actual search functionality
    // This would typically involve an API call

    // For now, just scroll to map section
    const mapSection = document.getElementById('map');
    if (mapSection) {
        mapSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Initialize smooth scrolling for all anchor links
 */
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');

            if (targetId !== '#') {
                event.preventDefault();
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/**
 * Utility function to format currency
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Utility function to debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Initialize header buttons functionality
 */
function initializeHeaderButtons() {
    const postVacancyButton = document.querySelector('.btn-post-vacancy');
    const menuButton = document.querySelector('.btn-menu');
    const viewAllVacanciesButton = document.querySelector('.btn-view-all-vacancies');
    const loginButton = document.getElementById('loginBtn');
    const signupButton = document.getElementById('signupBtn');
    const logoutButton = document.getElementById('logoutBtn');

    // Login button click handler
    if (loginButton) {
        loginButton.addEventListener('click', function () {
            console.log('Login button clicked');
            window.location.href = 'auth.html';
        });
    }

    // Signup button click handler
    if (signupButton) {
        signupButton.addEventListener('click', function () {
            console.log('Signup button clicked');
            window.location.href = 'auth.html?tab=signup';
        });
    }

    // Logout button click handler
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            console.log('Logout button clicked');
            if (confirm('Вы уверены, что хотите выйти?')) {
                logoutUser();
            }
        });
    }

    // Post vacancy button click handler
    if (postVacancyButton) {
        postVacancyButton.addEventListener('click', function () {
            console.log('Post vacancy button clicked');
            // TODO: Implement post vacancy form/modal
            alert('Функция размещения вакансии\n\nЗдесь будет форма для размещения вакансии');
        });
    }

    // Menu button click handler
    if (menuButton) {
        menuButton.addEventListener('click', function () {
            console.log('Menu button clicked');
            // TODO: Implement mobile menu or navigation drawer
            toggleMobileMenu();
        });
    }

    // View all vacancies button
    if (viewAllVacanciesButton) {
        viewAllVacanciesButton.addEventListener('click', function () {
            const mapSection = document.getElementById('map');
            if (mapSection) {
                mapSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    const menuModal = document.getElementById('menuModal');

    if (menuModal) {
        menuModal.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (menuModal.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    const menuModal = document.getElementById('menuModal');

    if (menuModal) {
        menuModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Initialize menu modal functionality
 */
function initializeMenuModal() {
    const menuModal = document.getElementById('menuModal');
    const closeButton = document.querySelector('.menu-close-btn');
    const menuNavLinks = document.querySelectorAll('.menu-nav-link');
    const menuCtaButton = document.querySelector('.menu-cta-button');

    // Close button click
    if (closeButton) {
        closeButton.addEventListener('click', closeMobileMenu);
    }

    // Click outside to close
    if (menuModal) {
        menuModal.addEventListener('click', function (event) {
            if (event.target === menuModal) {
                closeMobileMenu();
            }
        });
    }

    // Close on navigation link click
    menuNavLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');

            if (targetId.startsWith('#')) {
                event.preventDefault();
                closeMobileMenu();

                // Wait for menu to close, then scroll
                setTimeout(() => {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 300);
            }
        });
    });

    // CTA button in menu
    if (menuCtaButton) {
        menuCtaButton.addEventListener('click', function () {
            console.log('Menu CTA button clicked');
            closeMobileMenu();

            setTimeout(() => {
                const mapSection = document.getElementById('map');
                if (mapSection) {
                    mapSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        });
    }

    // ESC key to close
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

/**
 * Initialize footer functionality
 */
function initializeFooter() {
    const footerCtaButton = document.querySelector('.footer-cta-button');
    const footerLoginButton = document.getElementById('footerLoginBtn');
    const footerNavLinks = document.querySelectorAll('.footer-nav a');

    // Footer login button
    if (footerLoginButton) {
        footerLoginButton.addEventListener('click', function () {
            console.log('Footer login button clicked');
            window.location.href = 'auth.html';
        });
    }

    // Footer CTA button - Post vacancy
    if (footerCtaButton) {
        footerCtaButton.addEventListener('click', function () {
            console.log('Footer CTA button clicked');
            alert('Функция размещения вакансии\n\nЗдесь будет форма для размещения вакансии');
        });
    }

    // Footer navigation links - smooth scroll
    footerNavLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            const targetId = this.getAttribute('href');

            if (targetId.startsWith('#')) {
                event.preventDefault();

                // Handle vacancies link - redirect to map
                if (targetId === '#vacancies') {
                    const mapSection = document.getElementById('map');
                    if (mapSection) {
                        mapSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                } else {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            }
        });
    });
}

/**
 * Initialize map section functionality
 */
function initializeMapSection() {
    const mapExploreButton = document.querySelector('.map-explore-btn');

    if (mapExploreButton) {
        mapExploreButton.addEventListener('click', function () {
            console.log('Map explore button clicked');
            alert('Интерактивная карта промышленных парков\n\nФункция в разработке.\nЗдесь будет интерактивная карта с локациями всех промышленных парков Московской области.');
        });
    }
}

/**
 * Toggle AI Chat Modal
 */
function toggleAIChatModal() {
    const aiChatModal = document.getElementById('aiChatModal');
    const authenticatedUser = localStorage.getItem('prommeAuthUser');
    
    // Check if user is logged in
    if (!authenticatedUser) {
        alert('Пожалуйста, войдите в систему, чтобы использовать AI Ассистента');
        window.location.href = 'auth.html';
        return;
    }
    
    if (aiChatModal) {
        aiChatModal.classList.toggle('active');
        
        // Initialize AI chat handlers if not already done
        if (!window.aiChatInitialized) {
            initializeAIChat();
            window.aiChatInitialized = true;
        }
    }
}

/**
 * Close AI Chat Modal
 */
function closeAIChatModal() {
    const aiChatModal = document.getElementById('aiChatModal');
    if (aiChatModal) {
        aiChatModal.classList.remove('active');
    }
}

/**
 * Open AI Profile Modal
 */
function openAIProfileModal() {
    const aiProfileModal = document.getElementById('aiProfileModal');
    if (aiProfileModal) {
        aiProfileModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Initialize AI profile handlers if not already done
        if (!window.aiProfileInitialized) {
            initializeAIProfile();
            window.aiProfileInitialized = true;
        }
    }
}

/**
 * Close AI Profile Modal
 */
function closeAIProfileModal() {
    const aiProfileModal = document.getElementById('aiProfileModal');
    if (aiProfileModal) {
        aiProfileModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Initialize AI Chat functionality
 */
function initializeAIChat() {
    const aiChatCloseBtn = document.getElementById('aiChatCloseBtn');
    const aiActionYes = document.getElementById('aiActionYes');
    const aiActionNo = document.getElementById('aiActionNo');
    const aiChatUploadBtn = document.getElementById('aiChatUploadBtn');
    const aiChatFileInput = document.getElementById('aiChatFileInput');
    const aiChatUploadArea = document.getElementById('aiChatUploadArea');
    const aiChatSendBtn = document.getElementById('aiChatSendBtn');
    const aiChatTextInput = document.getElementById('aiChatTextInput');
    
    // Close button
    if (aiChatCloseBtn) {
        aiChatCloseBtn.addEventListener('click', function() {
            closeAIChatModal();
            hideProfileForm();
        });
    }
    
    // Yes button - show upload/text input in chat and profile form in background
    if (aiActionYes) {
        aiActionYes.addEventListener('click', function() {
            // Hide initial message and show input section
            const aiChatMessages = document.getElementById('aiChatMessages');
            const aiChatInputSection = document.getElementById('aiChatInputSection');
            
            if (aiChatMessages) aiChatMessages.style.display = 'none';
            if (aiChatInputSection) aiChatInputSection.style.display = 'block';
            
            // Show profile form in background
            showProfileForm();
        });
    }
    
    // No button - close and decline
    if (aiActionNo) {
        aiActionNo.addEventListener('click', function() {
            closeAIChatModal();
            
            // Store that user declined AI help
            const userData = JSON.parse(localStorage.getItem('prommeAuthUser'));
            if (userData) {
                userData.aiHelp = false;
                localStorage.setItem('prommeAuthUser', JSON.stringify(userData));
            }
        });
    }
    
    // Upload button
    if (aiChatUploadBtn && aiChatFileInput) {
        aiChatUploadBtn.addEventListener('click', function() {
            aiChatFileInput.click();
        });
        
        aiChatFileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                handleChatFileUpload(file);
            }
        });
    }
    
    // Drag and drop
    if (aiChatUploadArea) {
        aiChatUploadArea.addEventListener('dragover', function(event) {
            event.preventDefault();
            event.stopPropagation();
            aiChatUploadArea.classList.add('drag-over');
        });
        
        aiChatUploadArea.addEventListener('dragleave', function(event) {
            event.preventDefault();
            event.stopPropagation();
            aiChatUploadArea.classList.remove('drag-over');
        });
        
        aiChatUploadArea.addEventListener('drop', function(event) {
            event.preventDefault();
            event.stopPropagation();
            aiChatUploadArea.classList.remove('drag-over');
            
            const files = event.dataTransfer.files;
            if (files.length > 0) {
                handleChatFileUpload(files[0]);
            }
        });
    }
    
    // Send button
    if (aiChatSendBtn && aiChatTextInput) {
        aiChatSendBtn.addEventListener('click', function() {
            const text = aiChatTextInput.value.trim();
            if (text) {
                handleChatTextSubmit(text);
            } else {
                alert('Пожалуйста, расскажите о себе');
            }
        });
    }
}

/**
 * Initialize AI Profile Form functionality
 */
function initializeAIProfile() {
    const aiProfileCloseBtn = document.getElementById('aiProfileCloseBtn');
    const aiUploadBtn = document.getElementById('aiUploadBtn');
    const aiFileInput = document.getElementById('aiFileInput');
    const aiUploadArea = document.getElementById('aiUploadArea');
    const aiSubmitTextBtn = document.getElementById('aiSubmitTextBtn');
    const aiTextInput = document.getElementById('aiTextInput');
    
    // Close button
    if (aiProfileCloseBtn) {
        aiProfileCloseBtn.addEventListener('click', closeAIProfileModal);
    }
    
    // Upload button
    if (aiUploadBtn && aiFileInput) {
        aiUploadBtn.addEventListener('click', function() {
            aiFileInput.click();
        });
        
        aiFileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                handleFileUpload(file);
            }
        });
    }
    
    // Drag and drop
    if (aiUploadArea) {
        aiUploadArea.addEventListener('dragover', function(event) {
            event.preventDefault();
            event.stopPropagation();
            aiUploadArea.classList.add('drag-over');
        });
        
        aiUploadArea.addEventListener('dragleave', function(event) {
            event.preventDefault();
            event.stopPropagation();
            aiUploadArea.classList.remove('drag-over');
        });
        
        aiUploadArea.addEventListener('drop', function(event) {
            event.preventDefault();
            event.stopPropagation();
            aiUploadArea.classList.remove('drag-over');
            
            const files = event.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload(files[0]);
            }
        });
    }
    
    // Submit text button
    if (aiSubmitTextBtn && aiTextInput) {
        aiSubmitTextBtn.addEventListener('click', function() {
            const text = aiTextInput.value.trim();
            if (text) {
                handleTextSubmit(text);
            } else {
                alert('Пожалуйста, расскажите о себе');
            }
        });
    }
    
    // Close on backdrop click
    const aiProfileModal = document.getElementById('aiProfileModal');
    if (aiProfileModal) {
        aiProfileModal.addEventListener('click', function(event) {
            if (event.target === aiProfileModal) {
                closeAIProfileModal();
            }
        });
    }
}

/**
 * Initialize profile form
 */
function initializeProfileForm() {
    const profileForm = document.getElementById('profileForm');
    
    if (profileForm) {
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('profileName')?.value || '',
                email: document.getElementById('profileEmail')?.value || '',
                phone: document.getElementById('profilePhone')?.value || '',
                position: document.getElementById('profilePosition')?.value || '',
                experience: document.getElementById('profileExperience')?.value || '',
                education: document.getElementById('profileEducation')?.value || '',
                skills: document.getElementById('profileSkills')?.value || '',
                about: document.getElementById('profileAbout')?.value || ''
            };
            
            console.log('Profile form submitted:', formData);
            
            // Save to localStorage
            const userData = JSON.parse(localStorage.getItem('prommeAuthUser') || '{}');
            userData.profileData = formData;
            userData.profileFilled = true;
            userData.profileFilledByAI = true;
            localStorage.setItem('prommeAuthUser', JSON.stringify(userData));
            
            // Set flag for profile page to show AI chat
            sessionStorage.setItem('profileJustSaved', 'true');
            
            console.log('Profile saved successfully, redirecting to profile page...');
            
            // Redirect to profile page
            window.location.href = 'profile.html';
        });
    }
}

/**
 * Show profile form in background
 */
function showProfileForm() {
    const profileFormOverlay = document.getElementById('profileFormOverlay');
    if (profileFormOverlay) {
        profileFormOverlay.style.display = 'block';
        console.log('Profile form shown in background');
    }
}

/**
 * Hide profile form
 */
function hideProfileForm() {
    const profileFormOverlay = document.getElementById('profileFormOverlay');
    if (profileFormOverlay) {
        profileFormOverlay.style.display = 'none';
        console.log('Profile form hidden');
    }
}

/**
 * Handle file upload from chat
 * @param {File} file - The uploaded file
 */
function handleChatFileUpload(file) {
    console.log('Chat file uploaded:', file.name);
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('Файл слишком большой. Максимальный размер: 10MB');
        return;
    }
    
    // Check file type
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
        alert('Неподдерживаемый формат файла. Используйте: PDF, DOC, DOCX, TXT');
        return;
    }
    
    // Hide upload area, show progress
    const uploadArea = document.getElementById('aiChatUploadArea');
    const textArea = document.querySelector('.ai-chat-text-area');
    const divider = document.querySelector('.ai-chat-divider');
    const progress = document.getElementById('aiChatProgress');
    
    if (uploadArea) uploadArea.style.display = 'none';
    if (textArea) textArea.style.display = 'none';
    if (divider) divider.style.display = 'none';
    if (progress) progress.style.display = 'block';
    
    // Read the file content
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const fileContent = event.target.result;
        console.log('File content loaded, length:', fileContent.length);
        
        // Process the content and extract CV data
        simulateChatProcessing(file.name, fileContent);
    };
    
    reader.onerror = function() {
        alert('Ошибка при чтении файла. Попробуйте снова.');
        // Reset to initial state
        if (uploadArea) uploadArea.style.display = 'block';
        if (textArea) textArea.style.display = 'block';
        if (divider) divider.style.display = 'block';
        if (progress) progress.style.display = 'none';
    };
    
    // Read as text (works for TXT and PDF text extraction)
    reader.readAsText(file);
}

/**
 * Handle text submission from chat
 * @param {string} text - The submitted text
 */
function handleChatTextSubmit(text) {
    console.log('Chat text submitted:', text);
    
    // Hide upload and text areas, show progress
    const uploadArea = document.getElementById('aiChatUploadArea');
    const textArea = document.querySelector('.ai-chat-text-area');
    const divider = document.querySelector('.ai-chat-divider');
    const progress = document.getElementById('aiChatProgress');
    
    if (uploadArea) uploadArea.style.display = 'none';
    if (textArea) textArea.style.display = 'none';
    if (divider) divider.style.display = 'none';
    if (progress) progress.style.display = 'block';
    
    // Process the text directly with AI
    simulateChatProcessing('ваш текст', text);
}

/**
 * Simulate AI processing from chat
 * @param {string} source - Source of data (filename or 'ваш текст')
 * @param {string} content - The content to process
 */
function simulateChatProcessing(source, content) {
    const progressFill = document.getElementById('aiChatProgressFill');
    const progressText = document.getElementById('aiChatProgressText');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        if (progress < 30) {
            if (progressText) progressText.textContent = 'Анализируем ' + source + '...';
        } else if (progress < 60) {
            if (progressText) progressText.textContent = 'Извлекаем информацию...';
        } else if (progress < 90) {
            if (progressText) progressText.textContent = 'Заполняем профиль...';
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            if (progressText) progressText.textContent = 'Готово! ✓';
            
            // Extract CV data from content
            const extractedData = extractCVData(content);
            console.log('Extracted data:', extractedData);
            
            // Fill the profile form with extracted data
            setTimeout(() => {
                fillProfileFormWithAI(extractedData);
                
                // Close chat but keep form visible for review
                setTimeout(() => {
                    closeAIChatModal();
                    // Don't hide the form - keep it visible for review
                    
                    alert('✅ Отлично! Ваш профиль заполнен на основе резюме.\n\nПроверьте данные и нажмите "Сохранить профиль".');
                }, 1000);
            }, 500);
        }
    }, 200);
}

/**
 * Extract CV data from text content using pattern matching
 * @param {string} content - The CV content
 * @returns {Object} Extracted CV data
 */
function extractCVData(content) {
    const cvData = {
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        education: '',
        skills: '',
        about: ''
    };
    
    if (!content) return cvData;
    
    // Extract email
    const emailMatch = content.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i);
    if (emailMatch) {
        cvData.email = emailMatch[1];
    }
    
    // Extract phone (various formats including Russian)
    const phoneMatch = content.match(/(\+?7|8)?[\s\-\(]*(\d{3})[\s\-\)]*(\d{3})[\s\-]*(\d{2})[\s\-]*(\d{2})/);
    if (phoneMatch) {
        cvData.phone = phoneMatch[0].trim();
    }
    
    // Extract name (Russian format: after ФИО:, Имя:, or standalone Cyrillic name)
    const namePatterns = [
        /(?:ФИО|Имя|Name)[\s:]+([А-ЯЁ][а-яё]+\s+[А-ЯЁ][а-яё]+(?:\s+[А-ЯЁ][а-яё]+)?)/i,
        /^([А-ЯЁ][а-яё]+\s+[А-ЯЁ][а-яё]+\s+[А-ЯЁ][а-яё]+)/m
    ];
    
    for (const pattern of namePatterns) {
        const match = content.match(pattern);
        if (match) {
            cvData.name = match[1] ? match[1].trim() : match[0].trim();
            break;
        }
    }
    
    // Extract position/job title (improved)
    const positionPatterns = [
        /(?:ЦЕЛЬ|Цель)[\s\n:]+([^\n]+(?:сварщика|инженера|программиста|менеджера|разработчика)[^\n]*)/i,
        /(СВАРЩИК\s+\d+\s+РАЗРЯДА)/i,
        /(СВАРЩИК|ИНЖЕНЕР|РАЗРАБОТЧИК|ПРОГРАММИСТ|МЕНЕДЖЕР)[\s\-]+[^\n]{5,60}/i,
        /(?:Должность|Position)[\s:]+([^\n]+)/i,
        /должность[^\n]*?на[^\n]*?предприятии/i
    ];
    
    for (const pattern of positionPatterns) {
        const match = content.match(pattern);
        if (match) {
            let position = match[1] ? match[1].trim() : match[0].trim();
            position = position.replace(/(?:Должность|Цель|Position|для|на промышленном предприятии)[\s:]*/gi, '').trim();
            
            // Clean up extra dashes and spaces
            position = position.replace(/[-]{10,}/g, '').replace(/\s+/g, ' ').trim();
            
            if (position.length > 5 && position.length < 100) {
                cvData.position = position;
                break;
            }
        }
    }
    
    // If still no position found, try to extract from first significant capitalized line
    if (!cvData.position) {
        const lines = content.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.length > 10 && trimmed.length < 80 && /^[А-ЯЁA-Z]/.test(trimmed)) {
                if (/сварщик|инженер|программист|менеджер|разработчик/i.test(trimmed)) {
                    cvData.position = trimmed.replace(/[-]{5,}/g, '').trim();
                    break;
                }
            }
        }
    }
    
    // Extract experience (years)
    const expPatterns = [
        /(?:Опыт работы|Experience)[\s:]+(\d+)/i,
        /(\d+)\s+(?:лет|год|года)/i
    ];
    
    for (const pattern of expPatterns) {
        const match = content.match(pattern);
        if (match) {
            cvData.experience = match[1];
            break;
        }
    }
    
    // Extract education
    const educationMatch = content.match(/(?:ОБРАЗОВАНИЕ|Education)([\s\S]{0,600})(?:ПРОФЕССИОНАЛЬНЫЕ НАВЫКИ|НАВЫКИ|ОПЫТ РАБОТЫ|Skills|СЕРТИФИКАТЫ|$)/i);
    if (educationMatch) {
        const eduText = educationMatch[1]
            .replace(/[-=]{10,}/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .split('\n')
            .filter(line => line.trim().length > 10)
            .join(', ')
            .substring(0, 200);
        cvData.education = eduText;
    }
    
    // Extract skills
    const skillsMatch = content.match(/(?:ПРОФЕССИОНАЛЬНЫЕ НАВЫКИ|НАВЫКИ|Skills)([\s\S]{0,1000})(?:СЕРТИФИКАТЫ|ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ|РЕКОМЕНДАЦИИ|Certificates|$)/i);
    if (skillsMatch) {
        const skillsText = skillsMatch[1]
            .replace(/[-=]{10,}/g, '')
            .replace(/•/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 300);
        cvData.skills = skillsText;
    }
    
    // Extract about/summary from experience or objective
    const aboutPatterns = [
        /(?:О СЕБЕ|ЦЕЛЬ)([\s\S]{0,500})(?:ОПЫТ РАБОТЫ|Experience|ОБРАЗОВАНИЕ|$)/i,
        /(?:ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ)([\s\S]{0,500})(?:РЕКОМЕНДАЦИИ|$)/i
    ];
    
    for (const pattern of aboutPatterns) {
        const match = content.match(pattern);
        if (match) {
            let aboutText = match[1]
                .replace(/[-=]{10,}/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            
            // Clean up bullet points
            aboutText = aboutText.replace(/•/g, '').trim();
            
            if (aboutText.length > 20) {
                cvData.about = aboutText.substring(0, 400);
                break;
            }
        }
    }
    
    // If still no about, try to create summary from experience section
    if (!cvData.about) {
        const expMatch = content.match(/(?:ОПЫТ РАБОТЫ|Experience)([\s\S]{0,1000})(?:ОБРАЗОВАНИЕ|Education|$)/i);
        if (expMatch) {
            let expSummary = expMatch[1]
                .replace(/[-=]{10,}/g, '')
                .split('\n')
                .filter(line => {
                    const trimmed = line.trim();
                    return trimmed.length > 30 && 
                           !trimmed.match(/^\d{4}/) && 
                           !trimmed.match(/^(ООО|ЗАО|ИП|АО)/);
                })
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();
            
            if (expSummary.length > 50) {
                cvData.about = expSummary.substring(0, 400);
            }
        }
    }
    
    // If still empty, create a basic summary from available data
    if (!cvData.about && (cvData.position || cvData.experience)) {
        const parts = [];
        if (cvData.position) parts.push(cvData.position);
        if (cvData.experience) parts.push(`с опытом работы ${cvData.experience} лет`);
        if (cvData.skills) parts.push(`Навыки: ${cvData.skills.substring(0, 100)}`);
        
        cvData.about = parts.join('. ');
    }
    
    console.log('Extracted CV data:', cvData);
    return cvData;
}

/**
 * Fill profile form with AI-generated data
 * @param {Object} data - Extracted CV data
 */
function fillProfileFormWithAI(data) {
    // Fill form fields with extracted data
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePhone = document.getElementById('profilePhone');
    const profilePosition = document.getElementById('profilePosition');
    const profileExperience = document.getElementById('profileExperience');
    const profileEducation = document.getElementById('profileEducation');
    const profileSkills = document.getElementById('profileSkills');
    const profileAbout = document.getElementById('profileAbout');
    
    // Fill and highlight fields that have data
    if (profileName && data.name) {
        profileName.value = data.name;
        profileName.style.background = '#E8F5E9';
        profileName.style.transition = 'background 0.3s ease';
    }
    if (profileEmail && data.email) {
        profileEmail.value = data.email;
        profileEmail.style.background = '#E8F5E9';
        profileEmail.style.transition = 'background 0.3s ease';
    }
    if (profilePhone && data.phone) {
        profilePhone.value = data.phone;
        profilePhone.style.background = '#E8F5E9';
        profilePhone.style.transition = 'background 0.3s ease';
    }
    if (profilePosition && data.position) {
        profilePosition.value = data.position;
        profilePosition.style.background = '#E8F5E9';
        profilePosition.style.transition = 'background 0.3s ease';
    }
    if (profileExperience && data.experience) {
        profileExperience.value = data.experience;
        profileExperience.style.background = '#E8F5E9';
        profileExperience.style.transition = 'background 0.3s ease';
    }
    if (profileEducation && data.education) {
        profileEducation.value = data.education;
        profileEducation.style.background = '#E8F5E9';
        profileEducation.style.transition = 'background 0.3s ease';
    }
    if (profileSkills && data.skills) {
        profileSkills.value = data.skills;
        profileSkills.style.background = '#E8F5E9';
        profileSkills.style.transition = 'background 0.3s ease';
    }
    if (profileAbout && data.about) {
        profileAbout.value = data.about;
        profileAbout.style.background = '#E8F5E9';
        profileAbout.style.transition = 'background 0.3s ease';
    }
    
    console.log('Profile form filled with extracted CV data');
}

/**
 * Handle file upload
 * @param {File} file - The uploaded file
 */
function handleFileUpload(file) {
    console.log('File uploaded:', file.name);
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        alert('Файл слишком большой. Максимальный размер: 10MB');
        return;
    }
    
    // Check file type
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
        alert('Неподдерживаемый формат файла. Используйте: PDF, DOC, DOCX, TXT');
        return;
    }
    
    // Show progress
    const uploadArea = document.getElementById('aiUploadArea');
    const uploadProgress = document.getElementById('aiUploadProgress');
    
    if (uploadArea) uploadArea.style.display = 'none';
    if (uploadProgress) uploadProgress.style.display = 'block';
    
    // Simulate file processing
    simulateFileProcessing();
}

/**
 * Handle text submission
 * @param {string} text - The submitted text
 */
function handleTextSubmit(text) {
    console.log('Text submitted:', text);
    
    // Show processing
    const textSection = document.querySelector('.ai-text-section');
    const uploadProgress = document.getElementById('aiUploadProgress');
    
    if (textSection) textSection.style.display = 'none';
    if (uploadProgress) {
        uploadProgress.style.display = 'block';
        document.getElementById('aiProgressText').textContent = 'Анализируем ваш текст...';
    }
    
    // Simulate text processing
    simulateFileProcessing();
}

/**
 * Simulate AI processing of file/text
 */
function simulateFileProcessing() {
    const progressFill = document.getElementById('aiProgressFill');
    const progressText = document.getElementById('aiProgressText');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        if (progress < 30) {
            if (progressText) progressText.textContent = 'Анализируем ваш файл...';
        } else if (progress < 60) {
            if (progressText) progressText.textContent = 'Извлекаем информацию...';
        } else if (progress < 90) {
            if (progressText) progressText.textContent = 'Заполняем профиль...';
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            if (progressText) progressText.textContent = 'Готово! ✓';
            
            // Simulate profile filled
            setTimeout(() => {
                closeAIProfileModal();
                alert('Отлично! Ваш профиль успешно заполнен с помощью AI.\n\nВы можете просмотреть и отредактировать его в настройках профиля.');
                
                // Mark profile as filled
                const userData = JSON.parse(localStorage.getItem('prommeAuthUser') || '{}');
                userData.profileFilled = true;
                userData.profileFilledByAI = true;
                localStorage.setItem('prommeAuthUser', JSON.stringify(userData));
            }, 1000);
        }
    }, 200);
}

/**
 * Check if user is logged in and show AI chat
 * Opens every time the page loads if user is logged in and profile not filled
 */
function checkForNewLogin() {
    const userDataString = localStorage.getItem('prommeAuthUser');
    
    // Check if user is logged in
    if (!userDataString) {
        console.log('No user data found, skipping AI chat');
        return;
    }
    
    const userData = JSON.parse(userDataString);
    
    // Check if user has email (meaning they're actually logged in)
    if (!userData.email) {
        console.log('User not properly logged in, skipping AI chat');
        return;
    }
    
    console.log('Checking AI chat conditions:', {
        email: userData.email,
        profileFilled: userData.profileFilled,
        aiHelp: userData.aiHelp
    });
    
    // Show AI chat every time page loads if profile not filled and user hasn't declined
    if (!userData.profileFilled && userData.aiHelp !== false) {
        console.log('Opening AI chat modal automatically on page load...');
        
        // Wait a bit for page to load
        setTimeout(() => {
            const aiChatModal = document.getElementById('aiChatModal');
            if (aiChatModal) {
                aiChatModal.classList.add('active');
                
                // Initialize AI chat handlers if not already done
                if (!window.aiChatInitialized) {
                    initializeAIChat();
                    window.aiChatInitialized = true;
                }
                
                console.log('AI chat modal opened successfully!');
            } else {
                console.error('AI Chat modal element not found');
            }
        }, 800);
    } else {
        console.log('AI chat conditions not met:', {
            reason: userData.profileFilled ? 'Profile already filled' :
                    userData.aiHelp === false ? 'User declined AI help' : 'Unknown'
        });
    }
}

// Export functions for use in other scripts
window.PROMME = {
    formatCurrency,
    debounce,
    toggleMobileMenu,
    closeMobileMenu,
    logoutUser,
    toggleAIChatModal,
    closeAIChatModal,
    openAIProfileModal,
    closeAIProfileModal
};

