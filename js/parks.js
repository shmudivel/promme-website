// Parks Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeParkMap();
    initializeParkCards();
});

function initializeParkMap() {
    const mapMarkers = document.querySelectorAll('.map-marker');
    
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', function() {
            const parkId = this.getAttribute('data-park');
            scrollToParkCard(parkId);
        });
    });
}

function scrollToParkCard(parkId) {
    const parkCards = document.querySelectorAll('.park-detailed-card');
    parkCards.forEach((card, index) => {
        if (index === 0 && parkId === 'vesna' ||
            index === 1 && parkId === 'leto' ||
            index === 2 && parkId === 'tomilino' ||
            index === 3 && parkId === 'psk' ||
            index === 4 && parkId === 'synkovo') {
            
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.style.boxShadow = '0 0 20px rgba(44, 90, 160, 0.3)';
            
            setTimeout(() => {
                card.style.boxShadow = '';
            }, 2000);
        }
    });
}

function initializeParkCards() {
    const parkCards = document.querySelectorAll('.park-detailed-card');
    
    parkCards.forEach(card => {
        const viewAllButton = card.querySelector('.btn-primary');
        
        if (viewAllButton) {
            viewAllButton.addEventListener('click', function() {
                const parkName = card.querySelector('h3')?.textContent || '';
                console.log('Viewing all vacancies for:', parkName);
                window.location.href = `vacancies.html?park=${encodeURIComponent(parkName)}`;
            });
        }
        
        const companyButtons = card.querySelectorAll('.btn-text');
        companyButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const companyCard = this.closest('.company-mini-card');
                const companyName = companyCard.querySelector('h5')?.textContent || '';
                console.log('Viewing vacancies for:', companyName);
                window.location.href = `vacancies.html?company=${encodeURIComponent(companyName)}`;
            });
        });
    });
}

