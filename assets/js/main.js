// PROMME - Main JavaScript
// =========================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('PROMME Portal initialized');
    
    // Initialize components
    initializeNavigation();
    initializeSearch();
    initializeSmoothScroll();
    initializeHeaderButtons();
    initializeFooter();
    initializeMenuModal();
    initializeMapSection();
});

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
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
        heroSearchButton.addEventListener('click', function() {
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
        heroSearchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                heroSearchButton.click();
            }
        });
    }
    
    // Location button - use geolocation
    if (locationButton) {
        locationButton.addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        console.log('Location:', position.coords);
                        alert(`Ваше местоположение определено:\nШирота: ${position.coords.latitude.toFixed(4)}\nДолгота: ${position.coords.longitude.toFixed(4)}`);
                    },
                    function(error) {
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
        scrollButton.addEventListener('click', function() {
            const mapSection = document.getElementById('map');
            if (mapSection) {
                mapSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // AI Chat button
    if (aiChatButton) {
        aiChatButton.addEventListener('click', function() {
            console.log('AI Chat clicked');
            alert('AI Чат-помощник\n\nФункция в разработке.\nЗдесь будет интеллектуальный помощник для поиска вакансий.');
        });
    }
    
    // Location badges
    locationBadges.forEach(badge => {
        badge.addEventListener('click', function() {
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
    
    // Post vacancy button click handler
    if (postVacancyButton) {
        postVacancyButton.addEventListener('click', function() {
            console.log('Post vacancy button clicked');
            // TODO: Implement post vacancy form/modal
            alert('Функция размещения вакансии\n\nЗдесь будет форма для размещения вакансии');
        });
    }
    
    // Menu button click handler
    if (menuButton) {
        menuButton.addEventListener('click', function() {
            console.log('Menu button clicked');
            // TODO: Implement mobile menu or navigation drawer
            toggleMobileMenu();
        });
    }
    
    // View all vacancies button
    if (viewAllVacanciesButton) {
        viewAllVacanciesButton.addEventListener('click', function() {
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
        menuModal.addEventListener('click', function(event) {
            if (event.target === menuModal) {
                closeMobileMenu();
            }
        });
    }
    
    // Close on navigation link click
    menuNavLinks.forEach(link => {
        link.addEventListener('click', function(event) {
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
        menuCtaButton.addEventListener('click', function() {
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
    document.addEventListener('keydown', function(event) {
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
    const footerNavLinks = document.querySelectorAll('.footer-nav a');
    
    // Footer CTA button - Post vacancy
    if (footerCtaButton) {
        footerCtaButton.addEventListener('click', function() {
            console.log('Footer CTA button clicked');
            alert('Функция размещения вакансии\n\nЗдесь будет форма для размещения вакансии');
        });
    }
    
    // Footer navigation links - smooth scroll
    footerNavLinks.forEach(link => {
        link.addEventListener('click', function(event) {
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
        mapExploreButton.addEventListener('click', function() {
            console.log('Map explore button clicked');
            alert('Интерактивная карта промышленных парков\n\nФункция в разработке.\nЗдесь будет интерактивная карта с локациями всех промышленных парков Московской области.');
        });
    }
}

// Export functions for use in other scripts
window.PROMME = {
    formatCurrency,
    debounce,
    toggleMobileMenu,
    closeMobileMenu
};

