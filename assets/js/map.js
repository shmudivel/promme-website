// PROMME - Yandex Maps Integration
// ==================================

// Industrial parks data (coordinates: LON first, then LAT)
const industrialParks = [
    {
        name: "Парк Весна",
        code: "koledino",
        lat: 55.674489,
        lon: 37.435116,
        address: "микрорайон Климовск, Коммунальная ул., 44",
        vacanciesCount: 9
    },
    {
        name: "Парк Лето",
        code: "synkovo",
        lat: 55.522953,
        lon: 38.00623,
        address: "Деревня Новосёлки, территория Технопарка, д.6",
        vacanciesCount: 5
    },
    {
        name: "Томилино Лайт Индастриал Парк",
        code: "tomilino",
        lat: 55.636427,
        lon: 37.93033,
        address: "Томилино",
        vacanciesCount: 9
    },
    {
        name: "KALEVA PARK",
        code: "kaleva",
        lat: 55.617456,
        lon: 37.472088,
        address: "Технопарк KALEVA PARK",
        vacanciesCount: 9
    },
    {
        name: "Индустриальный парк Ворсино",
        code: "vorsino",
        lat: 55.229358,
        lon: 36.68257,
        address: "Калужская область",
        vacanciesCount: 9
    }
];

// Educational institutions data
const educationalInstitutions = [
    {
        name: "Подмосковный колледж «Энергия»",
        code: "edu1",
        lat: 55.805735,
        lon: 37.978192,
        address: "Московская область"
    },
    {
        name: "Колледж «Подмосковье»",
        code: "edu2",
        lat: 56.338654,
        lon: 36.740494,
        address: "Московская область"
    },
    {
        name: "Сергиево-Посадский колледж",
        code: "edu3",
        lat: 56.322823,
        lon: 38.156988,
        address: "Сергиев Посад"
    },
    {
        name: "Дмитровский техникум",
        code: "edu4",
        lat: 56.34155,
        lon: 37.528121,
        address: "Дмитров"
    },
    {
        name: "Мытищинский колледж",
        code: "edu5",
        lat: 55.922925,
        lon: 37.758038,
        address: "Мытищи"
    }
];

/**
 * Initialize Yandex Map when DOM is loaded and API is ready
 */
document.addEventListener('DOMContentLoaded', async function() {
    // Check if ymaps3 is available
    if (typeof ymaps3 === 'undefined') {
        console.warn('Yandex Maps API not loaded. Map will not be displayed.');
        console.info('Please add your Yandex Maps API key to index.html');
        return;
    }
    
    try {
        await initializeMap();
    } catch (error) {
        console.error('Error initializing map:', error);
    }
});

/**
 * Initialize the Yandex Map
 */
async function initializeMap() {
    // Register CDN for additional UI components
    ymaps3.import.registerCdn(
        'https://cdn.jsdelivr.net/npm/{package}',
        '@yandex/ymaps3-default-ui-theme@latest'
    );
    
    // Wait for ymaps3 to be ready
    await ymaps3.ready;
    
    // Load default components
    const {
        YMap,
        YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer,
        YMapMarker,
        YMapControls
    } = ymaps3;
    
    // Load additional UI theme package
    const uiThemePackage = await ymaps3.import('@yandex/ymaps3-default-ui-theme');
    const {
        YMapZoomControl,
        YMapGeolocationControl,
        YMapRotateTiltControl
    } = uiThemePackage;
    
    // Initialize the map
    const mapInstance = new YMap(
        document.getElementById('yandex-map'),
        {
            location: {
                center: [37.609813, 55.756258], // Moscow center [LON, LAT]
                zoom: 10
            },
            behaviors: ['drag', 'pinchZoom', 'dblClick']
        }
    );
    
    // Add controls to the map
    const controls = new YMapControls({
        position: 'top right',
        orientation: 'vertical'
    });
    
    controls.addChild(new YMapZoomControl({}));
    controls.addChild(new YMapGeolocationControl({}));
    controls.addChild(new YMapRotateTiltControl({}));
    
    mapInstance.addChild(controls);
    
    // Add scheme layer (map tiles)
    mapInstance.addChild(new YMapDefaultSchemeLayer({
        customization: await loadMapCustomization()
    }));
    
    // Add features layer (for markers)
    mapInstance.addChild(new YMapDefaultFeaturesLayer());
    
    // Add markers for industrial parks
    addIndustrialParkMarkers(mapInstance, YMapMarker);
    
    // Add markers for educational institutions
    addEducationalMarkers(mapInstance, YMapMarker);
    
    console.log('Yandex Map initialized successfully');
}

/**
 * Load map customization/styling
 * @returns {Promise<Object>} Map style configuration
 */
async function loadMapCustomization() {
    // You can load custom map styles from a JSON file
    // For now, return empty object for default styling
    return {};
}

/**
 * Add industrial park markers to the map
 * @param {YMap} mapInstance - The map instance
 * @param {YMapMarker} YMapMarker - The marker constructor
 */
function addIndustrialParkMarkers(mapInstance, YMapMarker) {
    industrialParks.forEach(park => {
        const markerElement = document.createElement('div');
        markerElement.className = 'marker marker_park';
        markerElement.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#196dff" opacity="0.2"/>
                <circle cx="16" cy="16" r="8" fill="#196dff"/>
                <circle cx="16" cy="16" r="4" fill="white"/>
            </svg>
        `;
        
        markerElement.setAttribute('data-park-code', park.code);
        markerElement.setAttribute('title', park.name);
        
        // Add click event listener
        markerElement.addEventListener('click', () => {
            showParkInfo(park);
        });
        
        // Create and add marker
        const marker = new YMapMarker(
            {
                coordinates: [park.lon, park.lat],
                draggable: false
            },
            markerElement
        );
        
        mapInstance.addChild(marker);
    });
}

/**
 * Add educational institution markers to the map
 * @param {YMap} mapInstance - The map instance
 * @param {YMapMarker} YMapMarker - The marker constructor
 */
function addEducationalMarkers(mapInstance, YMapMarker) {
    educationalInstitutions.forEach(institution => {
        const markerElement = document.createElement('div');
        markerElement.className = 'marker marker_edu';
        markerElement.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#F43" opacity="0.2"/>
                <circle cx="16" cy="16" r="8" fill="#F43"/>
                <path d="M16 10L20 13V18H12V13L16 10Z" fill="white"/>
            </svg>
        `;
        
        markerElement.setAttribute('data-edu-code', institution.code);
        markerElement.setAttribute('title', institution.name);
        
        // Add click event listener
        markerElement.addEventListener('click', () => {
            showEducationInfo(institution);
        });
        
        // Create and add marker
        const marker = new YMapMarker(
            {
                coordinates: [institution.lon, institution.lat],
                draggable: false
            },
            markerElement
        );
        
        mapInstance.addChild(marker);
    });
}

/**
 * Show industrial park information
 * @param {Object} park - Park data object
 */
function showParkInfo(park) {
    const infoHtml = `
        <strong>${park.name}</strong><br>
        ${park.address}<br>
        Вакансий: ${park.vacanciesCount}
    `;
    
    // You can implement a custom popup/modal here
    alert(infoHtml.replace(/<br>/g, '\n').replace(/<\/?strong>/g, ''));
    
    console.log('Park info:', park);
}

/**
 * Show educational institution information
 * @param {Object} institution - Institution data object
 */
function showEducationInfo(institution) {
    const infoHtml = `
        <strong>${institution.name}</strong><br>
        ${institution.address}
    `;
    
    // You can implement a custom popup/modal here
    alert(infoHtml.replace(/<br>/g, '\n').replace(/<\/?strong>/g, ''));
    
    console.log('Education info:', institution);
}

// Export for external access if needed
window.PRROMEMap = {
    industrialParks,
    educationalInstitutions,
    showParkInfo,
    showEducationInfo
};

