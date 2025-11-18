// Vacancies page functionality

let currentPage = 1;
const itemsPerPage = 10;
let filteredVacancies = [...vacanciesData];

document.addEventListener('DOMContentLoaded', () => {
    initializeVacanciesPage();
    setupFilters();
    setupSorting();
    checkURLParameters();
});

function initializeVacanciesPage() {
    renderVacancies();
    renderPagination();
}

function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        const searchFilter = document.getElementById('searchFilter');
        if (searchFilter) {
            searchFilter.value = searchQuery;
            applyFilters();
        }
    }
}

function setupFilters() {
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
}

function applyFilters() {
    const searchValue = document.getElementById('searchFilter')?.value.toLowerCase() || '';
    const salaryValue = parseInt(document.getElementById('salaryFilter')?.value) || 0;
    const experienceValue = document.getElementById('experienceFilter')?.value || '';
    const scheduleValue = document.getElementById('scheduleFilter')?.value || '';
    const workFormatValue = document.getElementById('workFormatFilter')?.value || '';
    
    filteredVacancies = vacanciesData.filter(vacancy => {
        const matchesSearch = !searchValue || 
            vacancy.title.toLowerCase().includes(searchValue) ||
            vacancy.company.toLowerCase().includes(searchValue) ||
            vacancy.description.toLowerCase().includes(searchValue);
        
        const matchesSalary = !salaryValue || 
            parseInt(vacancy.salary.split('-')[0]) >= salaryValue;
        
        const matchesExperience = !experienceValue || 
            vacancy.experience === experienceValue;
        
        const matchesSchedule = !scheduleValue || 
            vacancy.schedule === scheduleValue;
        
        const matchesWorkFormat = !workFormatValue || 
            vacancy.workFormat === workFormatValue;
        
        return matchesSearch && matchesSalary && matchesExperience && 
               matchesSchedule && matchesWorkFormat;
    });
    
    currentPage = 1;
    renderVacancies();
    renderPagination();
}

function resetFilters() {
    document.getElementById('searchFilter').value = '';
    document.getElementById('salaryFilter').value = '';
    document.getElementById('experienceFilter').value = '';
    document.getElementById('scheduleFilter').value = '';
    document.getElementById('workFormatFilter').value = '';
    
    filteredVacancies = [...vacanciesData];
    currentPage = 1;
    renderVacancies();
    renderPagination();
}

function setupSorting() {
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (event) => {
            const sortBy = event.target.value;
            sortVacancies(sortBy);
            renderVacancies();
        });
    }
}

function sortVacancies(sortBy) {
    switch (sortBy) {
        case 'date':
            filteredVacancies.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'salary':
            filteredVacancies.sort((a, b) => {
                const salaryA = parseInt(a.salary.split('-')[0]);
                const salaryB = parseInt(b.salary.split('-')[0]);
                return salaryB - salaryA;
            });
            break;
        case 'title':
            filteredVacancies.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
}

function renderVacancies() {
    const vacanciesListContainer = document.getElementById('vacanciesList');
    const resultsCountElement = document.getElementById('resultsCount');
    
    if (!vacanciesListContainer) return;
    
    // Update results count
    if (resultsCountElement) {
        resultsCountElement.textContent = `Найдено: ${filteredVacancies.length} вакансий`;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const vacanciesPage = filteredVacancies.slice(startIndex, endIndex);
    
    // Render vacancies
    vacanciesListContainer.innerHTML = '';
    
    if (vacanciesPage.length === 0) {
        vacanciesListContainer.innerHTML = '<div class="loading">Вакансии не найдены. Попробуйте изменить фильтры.</div>';
        return;
    }
    
    vacanciesPage.forEach(vacancy => {
        const vacancyItem = createVacancyListItem(vacancy);
        vacanciesListContainer.appendChild(vacancyItem);
    });
}

function createVacancyListItem(vacancy) {
    const item = document.createElement('div');
    item.className = 'vacancy-list-item';
    item.onclick = () => showVacancyDetails(vacancy);
    
    item.innerHTML = `
        <div class="vacancy-list-header">
            <div class="vacancy-list-info">
                <h3>${vacancy.title}</h3>
                <p class="vacancy-list-company">${vacancy.company}</p>
            </div>
            <div class="vacancy-list-salary">${formatSalary(vacancy.salary)}</div>
        </div>
        <p style="color: var(--text-secondary); margin-bottom: 0.75rem;">${vacancy.description}</p>
        <div class="vacancy-list-details">
            <span class="detail-badge">Опыт: ${vacancy.experience}</span>
            <span class="detail-badge">${vacancy.schedule}</span>
            <span class="detail-badge">${vacancy.workFormat}</span>
        </div>
    `;
    
    return item;
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(filteredVacancies.length / itemsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    paginationContainer.innerHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        const prevBtn = createPageButton('« Назад', currentPage - 1);
        paginationContainer.appendChild(prevBtn);
    }
    
    // Page numbers
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
        ) {
            const pageBtn = createPageButton(pageNumber, pageNumber);
            if (pageNumber === currentPage) {
                pageBtn.classList.add('active');
            }
            paginationContainer.appendChild(pageBtn);
        } else if (
            pageNumber === currentPage - 2 ||
            pageNumber === currentPage + 2
        ) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.padding = '0.5rem';
            paginationContainer.appendChild(ellipsis);
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        const nextBtn = createPageButton('Вперед »', currentPage + 1);
        paginationContainer.appendChild(nextBtn);
    }
}

function createPageButton(text, pageNumber) {
    const button = document.createElement('button');
    button.className = 'page-btn';
    button.textContent = text;
    button.addEventListener('click', () => {
        currentPage = pageNumber;
        renderVacancies();
        renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    return button;
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

function showVacancyDetails(vacancy) {
    alert(`${vacancy.title}\n\n` +
          `Компания: ${vacancy.company}\n` +
          `Зарплата: ${formatSalary(vacancy.salary)}\n` +
          `Опыт: ${vacancy.experience}\n` +
          `График: ${vacancy.schedule}\n` +
          `Формат: ${vacancy.workFormat}\n\n` +
          `${vacancy.description}\n\n` +
          `Дата публикации: ${new Date(vacancy.date).toLocaleDateString('ru-RU')}`);
}

