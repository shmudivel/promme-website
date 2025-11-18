// Parks page functionality

let displayedParks = [...parksData];
let currentIndustryFilter = 'all';
let currentSearchQuery = '';
let displayedParksCount = 6;

document.addEventListener('DOMContentLoaded', () => {
    initializeParksPage();
    setupSearch();
    setupIndustryFilter();
    setupLoadMore();
});

function initializeParksPage() {
    renderParks();
}

function setupSearch() {
    const searchParksBtn = document.getElementById('searchParksBtn');
    const parksSearchInput = document.getElementById('parksSearch');
    
    if (searchParksBtn && parksSearchInput) {
        searchParksBtn.addEventListener('click', performSearch);
        
        parksSearchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function performSearch() {
    const parksSearchInput = document.getElementById('parksSearch');
    currentSearchQuery = parksSearchInput?.value.toLowerCase() || '';
    displayedParksCount = 6;
    filterParks();
}

function setupIndustryFilter() {
    const industryTags = document.querySelectorAll('#industryTags .tag');
    
    industryTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Remove active class from all tags
            industryTags.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tag
            tag.classList.add('active');
            
            // Get selected industry
            currentIndustryFilter = tag.dataset.industry;
            displayedParksCount = 6;
            
            // Filter parks
            filterParks();
        });
    });
}

function filterParks() {
    displayedParks = parksData.filter(park => {
        const matchesSearch = !currentSearchQuery || 
            park.name.toLowerCase().includes(currentSearchQuery) ||
            park.address.toLowerCase().includes(currentSearchQuery) ||
            park.industries.some(industry => industry.toLowerCase().includes(currentSearchQuery));
        
        const matchesIndustry = currentIndustryFilter === 'all' || 
            park.industries.includes(currentIndustryFilter);
        
        return matchesSearch && matchesIndustry;
    });
    
    renderParks();
}

function renderParks() {
    const parksListContainer = document.getElementById('parksList');
    const parksCountElement = document.getElementById('parksCount');
    const loadMoreBtn = document.getElementById('loadMoreParks');
    
    if (!parksListContainer) return;
    
    // Update parks count
    if (parksCountElement) {
        parksCountElement.textContent = `Найдено парков: ${displayedParks.length}`;
    }
    
    // Get parks to display
    const parksToShow = displayedParks.slice(0, displayedParksCount);
    
    // Render parks
    parksListContainer.innerHTML = '';
    
    if (parksToShow.length === 0) {
        parksListContainer.innerHTML = '<div class="loading">Парки не найдены. Попробуйте изменить фильтры.</div>';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        return;
    }
    
    parksToShow.forEach(park => {
        const parkCard = createParkCard(park);
        parksListContainer.appendChild(parkCard);
    });
    
    // Show/hide load more button
    if (loadMoreBtn) {
        if (displayedParksCount < displayedParks.length) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
}

function createParkCard(park) {
    const card = document.createElement('div');
    card.className = 'park-card';
    
    const industriesTags = park.industries.map(industry => 
        `<span class="tag">${industry}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="park-image">🏭</div>
        <div class="park-content">
            <h3 class="park-title">${park.name}</h3>
            <p class="park-address">📍 ${park.address}</p>
            <div class="park-tags">${industriesTags}</div>
            <div style="margin-top: 1rem;">
                <p class="park-contact">📞 ${park.phone}</p>
                <p class="park-contact">✉️ ${park.email}</p>
                <p class="park-contact" style="margin-top: 0.5rem; font-weight: 500;">
                    🏢 Компаний: ${park.companies} | 📐 Площадь: ${park.area}
                </p>
            </div>
        </div>
    `;
    
    return card;
}

function setupLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreParks');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            displayedParksCount += 6;
            renderParks();
            
            // Scroll to new content
            const parksListContainer = document.getElementById('parksList');
            if (parksListContainer) {
                const newPosition = parksListContainer.children[displayedParksCount - 6]?.offsetTop || 0;
                window.scrollTo({ top: newPosition - 100, behavior: 'smooth' });
            }
        });
    }
}

