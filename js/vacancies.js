// Vacancies Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeVacancyFilters();
    initializeVacancyCards();
    loadSearchParams();
});

function initializeVacancyFilters() {
    const searchButton = document.querySelector('.btn-search');
    const searchInput = document.getElementById('vacancySearch');
    
    if (searchButton) {
        searchButton.addEventListener('click', filterVacancies);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterVacancies();
            }
        });
    }
    
    // Filter dropdowns
    const locationFilter = document.getElementById('locationFilter');
    const salaryFilter = document.getElementById('salaryFilter');
    
    if (locationFilter) {
        locationFilter.addEventListener('change', filterVacancies);
    }
    
    if (salaryFilter) {
        salaryFilter.addEventListener('change', filterVacancies);
    }
}

function filterVacancies() {
    const searchValue = document.getElementById('vacancySearch')?.value.toLowerCase() || '';
    const locationValue = document.getElementById('locationFilter')?.value || '';
    const salaryValue = document.getElementById('salaryFilter')?.value || '';
    
    const vacancyCards = document.querySelectorAll('.vacancy-card');
    
    vacancyCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const company = card.querySelector('h4')?.textContent.toLowerCase() || '';
        const location = card.querySelector('.location')?.textContent.toLowerCase() || '';
        const salaryText = card.querySelector('.salary-badge')?.textContent || '';
        
        let showCard = true;
        
        // Search filter
        if (searchValue && !title.includes(searchValue) && !company.includes(searchValue)) {
            showCard = false;
        }
        
        // Location filter
        if (locationValue && !location.includes(locationValue)) {
            showCard = false;
        }
        
        // Salary filter
        if (salaryValue) {
            const salaryNumbersOnly = salaryText.replace(/\D/g, '');
            const salary = parseInt(salaryNumbersOnly);
            const minimumSalary = parseInt(salaryValue);
            
            // If salary is missing or malformed (NaN), hide the card when filter is applied
            if (isNaN(salary) || salary < minimumSalary) {
                showCard = false;
            }
        }
        
        card.style.display = showCard ? 'block' : 'none';
    });
}

function initializeVacancyCards() {
    const vacancyCards = document.querySelectorAll('.vacancy-card');
    
    vacancyCards.forEach(card => {
        const applyButton = card.querySelector('.btn-primary');
        
        if (applyButton) {
            applyButton.addEventListener('click', function() {
                const vacancyTitle = card.querySelector('h3')?.textContent || '';
                const companyName = card.querySelector('h4')?.textContent || '';
                
                // Show application form or redirect
                showApplicationForm(vacancyTitle, companyName);
            });
        }
    });
}

function showApplicationForm(vacancyTitle, companyName) {
    alert(`Откликнуться на вакансию:\n${vacancyTitle}\nКомпания: ${companyName}\n\nФункционал в разработке...`);
    console.log('Apply for:', vacancyTitle, 'at', companyName);
}

function loadSearchParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const locationParam = urlParams.get('location');
    const companyParam = urlParams.get('company');
    
    if (searchParam) {
        const searchInput = document.getElementById('vacancySearch');
        if (searchInput) {
            searchInput.value = searchParam;
            filterVacancies();
        }
    }
    
    if (locationParam) {
        const locationFilter = document.getElementById('locationFilter');
        if (locationFilter) {
            // Try to match location
            const options = locationFilter.querySelectorAll('option');
            options.forEach(option => {
                if (locationParam.toLowerCase().includes(option.textContent.toLowerCase())) {
                    locationFilter.value = option.value;
                }
            });
            filterVacancies();
        }
    }
    
    if (companyParam) {
        const searchInput = document.getElementById('vacancySearch');
        if (searchInput) {
            searchInput.value = companyParam;
            filterVacancies();
        }
    }
}

// Pagination
const paginationButtons = document.querySelectorAll('.page-btn');
paginationButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (this.textContent === '...') return;
        
        paginationButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Scroll to top of vacancies list
        document.querySelector('.vacancies-list-section').scrollIntoView({ 
            behavior: 'smooth' 
        });
        
        console.log('Loading page:', this.textContent);
    });
});

