// PROMME - Authentication Page JavaScript
// =========================================

// Global variable to store selected profile type
let selectedProfileType = null;

// Profile type labels mapping
const profileTypeLabels = {
    'company': 'Компания',
    'job-seeker': 'Соискатель',
    'facilitator': 'Образовательное учреждение'
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('PROMME Authentication Page initialized');

    // Check if user is already authenticated
    checkAuthenticationStatus();

    // Initialize authentication components
    initializeProfileSelection();
    initializeAuthTabs();
    initializeAuthForms();

    // Check URL parameters for tab switching
    checkURLParameters();
});

/**
 * Check if user is already authenticated and redirect to main page
 */
function checkAuthenticationStatus() {
    const authenticatedUser = localStorage.getItem('prommeAuthUser');

    if (authenticatedUser) {
        console.log('User already authenticated, redirecting to main page');
        // Redirect to main page
        window.location.href = 'index.html';
    }
}

/**
 * Initialize profile selection functionality
 */
function initializeProfileSelection() {
    const profileOptions = document.querySelectorAll('.profile-option');
    const backButton = document.getElementById('backToProfiles');

    // Profile option click handlers
    profileOptions.forEach(option => {
        option.addEventListener('click', function () {
            const profileType = this.getAttribute('data-profile');
            selectProfileType(profileType);
        });
    });

    // Back button click handler
    if (backButton) {
        backButton.addEventListener('click', function () {
            showProfileSelection();
        });
    }
}

/**
 * Select a profile type and show authentication forms
 * @param {string} profileType - The selected profile type
 */
function selectProfileType(profileType) {
    selectedProfileType = profileType;
    console.log('Profile type selected:', profileType);

    // Update selected profile badge
    const profileBadge = document.getElementById('selectedProfileBadge');
    if (profileBadge) {
        profileBadge.textContent = profileTypeLabels[profileType];
    }

    // Hide profile selection and show auth forms
    const profileSelection = document.getElementById('profileSelection');
    const authFormSection = document.getElementById('authFormSection');

    if (profileSelection) {
        profileSelection.style.display = 'none';
    }

    if (authFormSection) {
        authFormSection.style.display = 'block';
    }
}

/**
 * Show profile selection screen
 */
function showProfileSelection() {
    selectedProfileType = null;

    // Show profile selection and hide auth forms
    const profileSelection = document.getElementById('profileSelection');
    const authFormSection = document.getElementById('authFormSection');

    if (profileSelection) {
        profileSelection.style.display = 'block';
    }

    if (authFormSection) {
        authFormSection.style.display = 'none';
    }
}

/**
 * Initialize authentication tab switching
 */
function initializeAuthTabs() {
    const authTabs = document.querySelectorAll('.auth-tab');

    authTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');
            switchAuthTab(targetTab);
        });
    });
}

/**
 * Switch between login and signup tabs
 * @param {string} tabName - Name of the tab to switch to ('login' or 'signup')
 */
function switchAuthTab(tabName) {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    // Remove active class from all tabs and forms
    authTabs.forEach(tab => tab.classList.remove('active'));
    authForms.forEach(form => form.classList.remove('active'));

    // Add active class to selected tab and form
    const selectedTab = document.querySelector(`.auth-tab[data-tab="${tabName}"]`);
    const selectedForm = document.getElementById(`${tabName}Form`);

    if (selectedTab && selectedForm) {
        selectedTab.classList.add('active');
        selectedForm.classList.add('active');
    }
}

/**
 * Check URL parameters for tab switching
 */
function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');

    if (tab === 'signup') {
        switchAuthTab('signup');
    }
}

/**
 * Initialize authentication form handlers
 */
function initializeAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            handleLogin();
        });
    }

    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function (event) {
            event.preventDefault();
            handleSignup();
        });
    }
}

/**
 * Handle login form submission
 */
function handleLogin() {
    // Check if profile type is selected
    if (!selectedProfileType) {
        alert('Пожалуйста, выберите тип профиля');
        showProfileSelection();
        return;
    }

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    const userEmail = emailInput.value.trim();
    const userPassword = passwordInput.value;
    const shouldRemember = rememberMeCheckbox.checked;

    // Validate inputs
    if (!userEmail || !userPassword) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
        alert('Пожалуйста, введите корректный email');
        return;
    }

    // Check if user exists in storage
    const storedUsers = JSON.parse(localStorage.getItem('prommeUsers') || '[]');
    const existingUser = storedUsers.find(user => user.email === userEmail && user.profileType === selectedProfileType);

    if (!existingUser) {
        alert('Пользователь с таким email не найден для выбранного типа профиля. Пожалуйста, зарегистрируйтесь.');
        switchAuthTab('signup');
        return;
    }

    // Simple password check (in real app, use proper password hashing)
    if (existingUser.password !== userPassword) {
        alert('Неверный пароль');
        return;
    }

    // Authentication successful
    const authenticatedUserData = {
        name: existingUser.name,
        email: existingUser.email,
        profileType: existingUser.profileType,
        profileTypeLabel: profileTypeLabels[existingUser.profileType],
        loginTime: new Date().toISOString(),
        rememberMe: shouldRemember
    };

    localStorage.setItem('prommeAuthUser', JSON.stringify(authenticatedUserData));

    // Clear the AI chat shown flag so it shows on login
    sessionStorage.removeItem('aiChatShown');
    
    // Set a flag to indicate this is a fresh login
    sessionStorage.setItem('freshLogin', 'true');

    console.log('Login successful:', authenticatedUserData);

    // Show success message
    alert(`Добро пожаловать, ${existingUser.name}!`);

    // Redirect to main page
    window.location.href = 'index.html';
}

/**
 * Handle signup form submission
 */
function handleSignup() {
    // Check if profile type is selected
    if (!selectedProfileType) {
        alert('Пожалуйста, выберите тип профиля');
        showProfileSelection();
        return;
    }

    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    const passwordConfirmInput = document.getElementById('signupPasswordConfirm');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');

    const userName = nameInput.value.trim();
    const userEmail = emailInput.value.trim();
    const userPassword = passwordInput.value;
    const userPasswordConfirm = passwordConfirmInput.value;
    const hasAgreedToTerms = agreeTermsCheckbox.checked;

    // Validate inputs
    if (!userName || !userEmail || !userPassword || !userPasswordConfirm) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
        alert('Пожалуйста, введите корректный email');
        return;
    }

    // Password length check
    if (userPassword.length < 6) {
        alert('Пароль должен содержать минимум 6 символов');
        return;
    }

    // Password match check
    if (userPassword !== userPasswordConfirm) {
        alert('Пароли не совпадают');
        return;
    }

    // Terms agreement check
    if (!hasAgreedToTerms) {
        alert('Пожалуйста, согласитесь с условиями использования');
        return;
    }

    // Check if user already exists with this profile type
    const storedUsers = JSON.parse(localStorage.getItem('prommeUsers') || '[]');
    const existingUser = storedUsers.find(user => user.email === userEmail && user.profileType === selectedProfileType);

    if (existingUser) {
        alert('Пользователь с таким email уже существует для выбранного типа профиля. Попробуйте войти.');
        switchAuthTab('login');
        return;
    }

    // Create new user
    const newUser = {
        name: userName,
        email: userEmail,
        password: userPassword, // In real app, hash this!
        profileType: selectedProfileType,
        profileTypeLabel: profileTypeLabels[selectedProfileType],
        registrationDate: new Date().toISOString()
    };

    // Save user to storage
    storedUsers.push(newUser);
    localStorage.setItem('prommeUsers', JSON.stringify(storedUsers));

    // Automatically log in the user
    const authenticatedUserData = {
        name: newUser.name,
        email: newUser.email,
        profileType: newUser.profileType,
        profileTypeLabel: newUser.profileTypeLabel,
        loginTime: new Date().toISOString(),
        rememberMe: true
    };

    localStorage.setItem('prommeAuthUser', JSON.stringify(authenticatedUserData));

    // Clear the AI chat shown flag so it shows on registration
    sessionStorage.removeItem('aiChatShown');
    
    // Set a flag to indicate this is a fresh login
    sessionStorage.setItem('freshLogin', 'true');

    console.log('Registration successful:', authenticatedUserData);

    // Show success message
    alert(`Регистрация успешна! Добро пожаловать, ${userName}!`);

    // Redirect to main page
    window.location.href = 'index.html';
}
