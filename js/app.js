// PROMME Website JavaScript

// Audio Control
let isAudioPlaying = false;
let backgroundAudio = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeCookieBanner();
    initializeAudioToggle();
    initializeSearchFunctionality();
    initializeMapMarkers();
    initializeAnimations();
    initializeCarousel();
});

// Cookie Banner
function initializeCookieBanner() {
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptButton = document.getElementById('acceptCookies');
    
    // Check if cookie banner elements exist (they may not exist on all pages)
    if (!cookieBanner || !acceptButton) {
        return;
    }
    
    // Check if cookies were already accepted
    if (localStorage.getItem('cookiesAccepted') === 'true') {
        cookieBanner.classList.add('hidden');
    }
    
    acceptButton.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.style.animation = 'slideUp 0.5s ease reverse';
        setTimeout(() => {
            cookieBanner.classList.add('hidden');
        }, 500);
    });
}

// Audio Toggle
function initializeAudioToggle() {
    const audioToggle = document.getElementById('audioToggle');
    
    if (audioToggle) {
        audioToggle.addEventListener('click', toggleBackgroundMusic);
    }
    
    // Add audio toggle to hero section if exists
    const heroAudioButtons = document.querySelectorAll('.hero .audio-toggle, .volume-icon');
    heroAudioButtons.forEach(button => {
        button.addEventListener('click', toggleBackgroundMusic);
    });
}

function toggleBackgroundMusic() {
    isAudioPlaying = !isAudioPlaying;
    
    const volumeIcons = document.querySelectorAll('.volume-icon');
    volumeIcons.forEach(icon => {
        icon.textContent = isAudioPlaying ? '🔊' : '🔇';
    });
    
    if (isAudioPlaying) {
        // In a real implementation, you would play actual audio here
        console.log('Background music started');
        // backgroundAudio = new Audio('path/to/background-music.mp3');
        // backgroundAudio.loop = true;
        // backgroundAudio.volume = 0.3;
        // backgroundAudio.play();
    } else {
        console.log('Background music stopped');
        // if (backgroundAudio) {
        //     backgroundAudio.pause();
        // }
    }
}

// Search Functionality
function initializeSearchFunctionality() {
    const searchInput = document.getElementById('jobSearch');
    const searchButton = document.querySelector('.btn-search');
    
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Location tags
    const locationTags = document.querySelectorAll('.location-tag');
    locationTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const locationName = this.textContent.trim();
            searchByLocation(locationName);
        });
    });
}

function performSearch() {
    const searchInput = document.getElementById('jobSearch');
    const searchQuery = searchInput.value.trim();
    
    if (searchQuery) {
        console.log('Searching for:', searchQuery);
        // Redirect to vacancies page with search query
        window.location.href = `vacancies.html?search=${encodeURIComponent(searchQuery)}`;
    }
}

function searchByLocation(locationName) {
    console.log('Searching in location:', locationName);
    window.location.href = `vacancies.html?location=${encodeURIComponent(locationName)}`;
}

// Map Markers
function initializeMapMarkers() {
    const mapMarkers = document.querySelectorAll('.map-marker');
    
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', function() {
            const parkId = this.getAttribute('data-park');
            highlightParkCard(parkId);
        });
    });
    
    // Map filter buttons
    const mapFilters = document.querySelectorAll('.map-filter');
    mapFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            mapFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            const filterType = this.textContent.trim();
            filterMapMarkers(filterType);
        });
    });
}

function highlightParkCard(parkId) {
    const parkCards = document.querySelectorAll('.park-card');
    parkCards.forEach(card => {
        card.style.transition = 'all 0.3s ease';
        card.style.transform = 'scale(1)';
        card.style.boxShadow = 'var(--shadow)';
    });
    
    // Scroll to parks list
    const parksSection = document.querySelector('.parks-list');
    if (parksSection) {
        parksSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function filterMapMarkers(filterType) {
    console.log('Filtering map by:', filterType);
    // In a real implementation, you would filter markers based on type
}

// Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Animate elements on scroll
    const animatedElements = document.querySelectorAll('.mission-card, .company-card, .about-card, .park-card, .company-item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Carousel for companies
function initializeCarousel() {
    const carousels = document.querySelectorAll('.companies-carousel, .companies-grid');
    
    carousels.forEach(carousel => {
        // Add hover effects
        const cards = carousel.querySelectorAll('.company-card, .company-item');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    });
}

// Company card actions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-outline') || e.target.classList.contains('btn-text')) {
        const companyCard = e.target.closest('.company-card, .company-item, .park-card');
        if (companyCard) {
            const companyName = companyCard.querySelector('h3, h4, h5')?.textContent || 'company';
            console.log('Viewing vacancies for:', companyName);
            // In a real implementation, navigate to company vacancies page
            window.location.href = `vacancies.html?company=${encodeURIComponent(companyName)}`;
        }
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add dynamic "Show more" functionality
const showMoreButtons = document.querySelectorAll('.btn-secondary');
showMoreButtons.forEach(button => {
    if (button.textContent.includes('Показать еще')) {
        button.addEventListener('click', function() {
            // In a real implementation, load more companies
            console.log('Loading more companies...');
            this.textContent = 'Загрузка...';
            setTimeout(() => {
                this.textContent = 'Показать еще';
            }, 1000);
        });
    }
});

// Header scroll effect
let lastScrollPosition = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
    const currentScrollPosition = window.pageYOffset;
    
    if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollPosition = currentScrollPosition;
});

