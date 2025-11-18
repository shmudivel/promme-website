// Homepage functionality

document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedVacancies();
    loadFeaturedParks();
    setupQuickSearch();
});

function loadFeaturedVacancies() {
    const featuredVacanciesContainer = document.getElementById('featuredVacancies');
    
    if (!featuredVacanciesContainer) return;
    
    // Get first 6 vacancies
    const featuredVacancies = vacanciesData.slice(0, 6);
    
    featuredVacanciesContainer.innerHTML = '';
    
    featuredVacancies.forEach(vacancy => {
        const vacancyCard = createVacancyCard(vacancy);
        featuredVacanciesContainer.appendChild(vacancyCard);
    });
}

function createVacancyCard(vacancy) {
    const card = document.createElement('div');
    card.className = 'vacancy-card';
    card.onclick = () => showVacancyDetails(vacancy);
    
    card.innerHTML = `
        <div class="vacancy-header">
            <div>
                <h3 class="vacancy-title">${vacancy.title}</h3>
                <p class="vacancy-company">${vacancy.company}</p>
            </div>
            <div class="vacancy-salary">${formatSalary(vacancy.salary)}</div>
        </div>
        <div class="vacancy-details">
            <div class="detail-item">Опыт: ${vacancy.experience}</div>
            <div class="detail-item">${vacancy.schedule}</div>
            <div class="detail-item">${vacancy.workFormat}</div>
        </div>
    `;
    
    return card;
}

function formatSalary(salary) {
    if (!salary) return 'Не указана';
    
    const parts = salary.split('-');
    if (parts.length === 2) {
        return `${formatNumber(parts[0])} - ${formatNumber(parts[1])} ₽`;
    }
    return `${formatNumber(salary)} ₽`;
}

function formatNumber(numString) {
    const num = parseInt(numString);
    return num.toLocaleString('ru-RU');
}

function loadFeaturedParks() {
    const featuredParksContainer = document.getElementById('featuredParks');
    
    if (!featuredParksContainer) return;
    
    // Get first 3 parks
    const featuredParks = parksData.slice(0, 3);
    
    featuredParksContainer.innerHTML = '';
    
    featuredParks.forEach(park => {
        const parkCard = createParkCard(park);
        featuredParksContainer.appendChild(parkCard);
    });
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
            <p class="park-contact">📞 ${park.phone}</p>
            <p class="park-contact">✉️ ${park.email}</p>
            <p class="park-contact">🏢 Компаний: ${park.companies} | 📐 Площадь: ${park.area}</p>
        </div>
    `;
    
    return card;
}

function setupQuickSearch() {
    const quickSearchBtn = document.getElementById('quickSearchBtn');
    const quickSearchInput = document.getElementById('quickSearchInput');
    
    if (!quickSearchBtn || !quickSearchInput) return;
    
    quickSearchBtn.addEventListener('click', () => {
        const searchQuery = quickSearchInput.value.trim();
        if (searchQuery) {
            window.location.href = `vacancies.html?search=${encodeURIComponent(searchQuery)}`;
        }
    });
    
    quickSearchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            quickSearchBtn.click();
        }
    });
}

function showVacancyDetails(vacancy) {
    alert(`${vacancy.title}\n\n` +
          `Компания: ${vacancy.company}\n` +
          `Зарплата: ${formatSalary(vacancy.salary)}\n` +
          `Опыт: ${vacancy.experience}\n` +
          `График: ${vacancy.schedule}\n` +
          `Формат: ${vacancy.workFormat}\n\n` +
          `${vacancy.description}`);
}

