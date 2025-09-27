// SIMPLIFIED VERSION - Remove heavy debugging
class WorldMapPhotoExplorer {
    constructor() {
        this.chart = null;
        this.currentPhotos = [];
        this.currentPhotoIndex = 0;
        this.currentCountryDate = null;
        this.modal = document.getElementById('photoModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.photoGallery = document.getElementById('photoGallery');
        this.photoCounter = document.getElementById('photoCounter');
        
        // Photo overlay elements
        this.photoOverlay = document.getElementById('photoOverlay');
        this.enlargedPhoto = document.getElementById('enlargedPhoto');
        this.overlayTitle = document.getElementById('overlayTitle');
        this.overlayDescription = document.getElementById('overlayDescription');
        
        this.init();
    }

    openPhotoOverlay(photoUrl, title, description) {
        // Set the enlarged photo content
        this.enlargedPhoto.src = photoUrl;
        this.overlayTitle.textContent = title;
        this.overlayDescription.textContent = description;
        
        // Show the overlay
        this.photoOverlay.style.display = 'block';
        setTimeout(() => {
            this.photoOverlay.classList.add('show');
        }, 10);
    }

    closePhotoOverlay() {
        this.photoOverlay.classList.remove('show');
        setTimeout(() => {
            this.photoOverlay.style.display = 'none';
        }, 300);
    }

    init() {
        
        // Photo overlay elements
        this.photoOverlay = document.getElementById('photoOverlay');
        this.enlargedPhoto = document.getElementById('enlargedPhoto');
        this.overlayTitle = document.getElementById('overlayTitle');
        this.overlayDescription = document.getElementById('overlayDescription');
        
        this.init();
    }

    init() {
        // Hide loading spinner
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        // Setup modal event listeners
        this.setupModalEvents();
        
        // Initialize the map
        this.createMap();
    }

    showLoadingMessage(message) {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.textContent = message;
            loadingElement.style.display = 'block';
        } else {
            // Create loading element if it doesn't exist
            const loading = document.createElement('div');
            loading.id = 'loading';
            loading.textContent = message;
            loading.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 20px;
                border-radius: 8px;
                z-index: 9999;
                font-family: Arial, sans-serif;
                font-size: 18px;
            `;
            document.body.appendChild(loading);
        }
    }

    hideLoadingMessage() {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    getCountriesWithPhotos() {
        // Get all country codes that have photos
        const photoCountries = Object.keys(photoData);
        
        // Map to include country info
        return photoCountries.map(code => ({
            code: code,
            hasPhotos: true
        }));
    }

    filterGeodataForPhotos(originalGeodata) {
        const countriesWithPhotos = this.getCountriesWithPhotos();
        const photoCodes = new Set(countriesWithPhotos.map(c => c.code));
        
        // Filter the geodata to only include countries with photos
        const filteredGeodata = {
            ...originalGeodata,
            features: originalGeodata.features.filter(feature => {
                const countryCode = feature.properties?.iso_a2 || feature.id;
                return photoCodes.has(countryCode);
            })
        };
        
        console.log('🌍 Using full world geodata: all countries visible');
        return filteredGeodata;
    }

    createMap() {
        // Show loading indicator
        this.showLoadingMessage('Initializing world map...');
        
        // PERFORMANCE: Get countries with photos for coloring
        const countriesWithPhotos = this.getCountriesWithPhotos();
        
        // PERFORMANCE: Completely disable amCharts animations
        am4core.options.animationsEnabled = false;
        am4core.options.autoSetClassName = false;
        
        // Create map instance with minimal config
        this.chart = am4core.create("chartdiv", am4maps.MapChart);
        
        // Use FULL world geodata (not filtered)
        this.chart.geodata = am4geodata_worldLow;
        
        this.chart.projection = new am4maps.projections.Miller();
        console.log('🗺️  CreateMap - Projection set:', new Date().toISOString());
        
        // PERFORMANCE: Disable all animations and transitions
        this.chart.hiddenState.transitionDuration = 0;
        this.chart.defaultState.transitionDuration = 0;
        console.timeEnd('amCharts Config');

        // Create map polygon series for countries
        console.time('Polygon Series Setup');
        let polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());
        polygonSeries.useGeodata = true;
        console.log('🗺️  CreateMap - Polygon series created:', new Date().toISOString());
        
        // PERFORMANCE: Disable all polygon animations and transitions
        polygonSeries.hiddenState.transitionDuration = 0;
        polygonSeries.defaultState.transitionDuration = 0;
        console.timeEnd('Polygon Series Setup');

        // Configure country appearance - MINIMAL CONFIG FOR PERFORMANCE
        console.time('Template Configuration');
        let polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}";
        polygonTemplate.stroke = am4core.color("#2196F3");
        polygonTemplate.strokeWidth = 0.5;

        // Default fill for countries without photos
        polygonTemplate.fill = am4core.color("#e6f3ff");
        
        // PERFORMANCE: Disable all template animations
        polygonTemplate.hiddenState.transitionDuration = 0;
        polygonTemplate.defaultState.transitionDuration = 0;

        // PERFORMANCE: Remove hover state creation - major bottleneck
        // No hover state = massive performance gain

        // Add click functionality
        polygonTemplate.events.on("hit", (ev) => {
            let country = ev.target.dataItem.dataContext;
            this.handleCountryClick(country);
        });

        // Add cursor pointer on hover
        polygonTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
        console.timeEnd('Template Configuration');
        console.log('🗺️  CreateMap - Template configured:', new Date().toISOString());

        // PERFORMANCE CRITICAL: Completely simplified country coloring
        console.log('🗺️  CreateMap - Setting up country coloring:', new Date().toISOString());
        console.time('Country Coloring Setup');
        
        polygonSeries.events.on("ready", () => {
            // Update loading message during the long wait
            this.showLoadingMessage('Loading country data...');
            console.log('🎨 Country coloring READY event triggered:', new Date().toISOString());
            console.time('Country Coloring Process');
            
            // Set up colors for countries with and without photos
            const hasPhotosColor = am4core.color("#4CAF50");
            const noPhotosColor = am4core.color("#e6f3ff");
            
            // Process all countries but color differently based on photos
            let processedCount = 0;
            polygonSeries.mapPolygons.each((polygon) => {
                const country = polygon.dataItem.dataContext;
                const hasPhotos = this.hasCountryPhotos(country.id, country.name);
                
                if (hasPhotos) {
                    polygon.fill = hasPhotosColor;
                    polygon.tooltipText = "{name}";
                } else {
                    polygon.fill = noPhotosColor;
                    polygon.tooltipText = "{name} (No photos yet)";
                }
                
                processedCount++;
            });
            
            console.timeEnd('Country Coloring Process');
            console.log(`🎨 All ${processedCount} countries processed instantly!`, new Date().toISOString());
            
            // Hide loading message - map is now ready!
            this.hideLoadingMessage();
        });
        
        console.timeEnd('Country Coloring Setup');

        // Configure map interaction - ENHANCED ZOOM FOR MOBILE
        console.time('Map Interaction Setup');
        this.chart.seriesContainer.draggable = true;
        this.chart.seriesContainer.resizable = false;
        this.chart.maxZoomLevel = 10; // Increased for small countries like Maldives
        this.chart.minZoomLevel = 1;
        
        // Enable mouse wheel zoom for better navigation to small countries
        this.chart.seriesContainer.wheelable = true;
        console.timeEnd('Map Interaction Setup');
        console.log('🗺️  CreateMap - Map interaction configured:', new Date().toISOString());

        // PERFORMANCE: Remove all heavy initialization and setup zoom immediately
        console.time('Zoom Controls Setup');
        this.setupZoomControls();
        console.timeEnd('Zoom Controls Setup');
        
        console.timeEnd('CreateMap Total');
        console.log('🗺️  CreateMap COMPLETE:', new Date().toISOString());
    }

    handleCountryClick(country) {
        const countryName = country.name;
        const countryId = country.id;
        
        console.log(`Clicked on: ${countryName} (${countryId})`);
        
        // Auto-zoom to small countries for better visibility (especially on mobile)
        const smallCountries = ['MV', 'MT', 'SG', 'BH', 'BB', 'LI', 'SM', 'AD', 'MC', 'VA'];
        if (smallCountries.includes(countryId)) {
            // Find the clicked polygon and zoom to it
            this.chart.seriesContainer.zoomToMapObject = country;
            this.chart.zoomLevel = 6; // Good zoom level for small countries
        }
        
        // Get photos for this country
        const photos = this.getCountryPhotos(countryId, countryName);
        
        if (photos && photos.length > 0) {
            this.showPhotoModal(countryName, photos, countryId, countryId);
        } else {
            // Show a message for countries without photos
            this.showNoPhotosMessage(countryName);
        }
    }

    getCountryPhotos(countryId, countryName) {
        // Check if country data exists in our photoData
        const countryData = photoData[countryId] || photoData[countryName] || null;
        
        // Handle both old array format and new object format
        if (countryData) {
            if (Array.isArray(countryData)) {
                // Old format - just return the array
                return countryData;
            } else if (countryData.photos) {
                // New format - return the photos array
                return countryData.photos;
            }
        }
        
        return null;
    }

    getCountryDate(countryId, countryName) {
        // Get the date for a country if available
        const countryData = photoData[countryId] || photoData[countryName] || null;
        
        if (countryData && !Array.isArray(countryData) && countryData.date) {
            return countryData.date;
        }
        
        return null;
    }

    hasCountryPhotos(countryId, countryName) {
        // Check if country has photos available
        const photos = this.getCountryPhotos(countryId, countryName);
        return photos && photos.length > 0;
    }

    showPhotoModal(countryName, photos, countryId, countryCode) {
        console.log('📷 showPhotoModal START:', new Date().toISOString());
        console.time('Modal Setup');
        
        // Show loading state first
        this.modalTitle.textContent = `📸 ${countryName}`;
        this.photoGallery.innerHTML = `
            <div class="photo-container">
                <div class="loading-photo">Loading photos...</div>
            </div>
        `;
        
        this.currentPhotos = photos;
        this.currentPhotoIndex = 0;
        this.currentCountryDate = this.getCountryDate(countryCode, countryName);
        
        // Pre-load the first image before showing modal
        this.preloadAndShowPhoto().then(() => {
            console.timeEnd('Modal Setup');
            console.log('📷 Modal ready, showing:', new Date().toISOString());
            
            this.updatePhotoCounter();
            this.modal.style.display = 'block';
            
            // Add fade-in animation
            setTimeout(() => {
                this.modal.classList.add('show');
            }, 10);
        });
    }

    showNoPhotosMessage(countryName) {
        this.modalTitle.textContent = `📍 ${countryName}`;
        this.photoGallery.innerHTML = `
            <div class="no-photos">
                <div class="no-photos-icon">📷</div>
                <h3>No photos available</h3>
                <p>No menacing has occurred in ${countryName} yet.</p>
                <p>See you soon Baboon!</p>
            </div>
        `;
        this.photoCounter.textContent = '0 photos';
        this.modal.style.display = 'block';
        
        setTimeout(() => {
            this.modal.classList.add('show');
        }, 10);
    }

    preloadAndShowPhoto() {
        return new Promise((resolve) => {
            if (this.currentPhotos.length === 0) {
                resolve();
                return;
            }
            
            const photo = this.currentPhotos[this.currentPhotoIndex];
            const img = new Image();
            let resolved = false;
            
            img.onload = () => {
                if (!resolved) {
                    console.log('📷 First image preloaded:', photo.url);
                    this.displayCurrentPhoto();
                    resolved = true;
                    resolve();
                }
            };
            
            img.onerror = () => {
                if (!resolved) {
                    console.log('❌ Image failed to load:', photo.url);
                    this.displayCurrentPhoto(); // Show anyway with broken image
                    resolved = true;
                    resolve();
                }
            };
            
            // Start loading the image
            img.src = photo.url;
            
            // Timeout fallback - don't wait more than 3 seconds
            setTimeout(() => {
                if (!resolved) {
                    console.log('⏱️ Image load timeout, showing anyway');
                    this.displayCurrentPhoto();
                    resolved = true;
                    resolve();
                }
            }, 3000);
        });
    }

    displayCurrentPhoto() {
        if (this.currentPhotos.length === 0) return;
        
        console.time('Display Photo');
        const photo = this.currentPhotos[this.currentPhotoIndex];
        
        // OPTIMIZED: Build HTML more efficiently
        const photoHTML = [
            '<div class="photo-container">',
            `<img src="${photo.url}" alt="${photo.title}" class="gallery-image clickable-image" onclick="worldMapApp.openPhotoOverlay('${photo.url}', '${photo.title}', '${photo.description}')" loading="lazy">`,
            '<div class="photo-info">',
            `<h3>${photo.title}</h3>`,
            `<p>${photo.description}</p>`,
            photo.location ? `<span class="photo-location">📍 ${photo.location}</span>` : '',
            this.currentCountryDate ? `<span class="photo-date">📅 ${this.currentCountryDate}</span>` : '',
            '</div>',
            '</div>'
        ].filter(Boolean).join('');
        
        this.photoGallery.innerHTML = photoHTML;
        console.timeEnd('Display Photo');
    }

    updatePhotoCounter() {
        if (this.currentPhotos.length > 0) {
            this.photoCounter.textContent = `${this.currentPhotoIndex + 1} / ${this.currentPhotos.length}`;
        }
    }

    nextPhoto() {
        if (this.currentPhotos.length === 0) return;
        
        this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.currentPhotos.length;
        this.displayCurrentPhoto();
        this.updatePhotoCounter();
    }

    previousPhoto() {
        if (this.currentPhotos.length === 0) return;
        
        this.currentPhotoIndex = this.currentPhotoIndex === 0 
            ? this.currentPhotos.length - 1 
            : this.currentPhotoIndex - 1;
        this.displayCurrentPhoto();
        this.updatePhotoCounter();
    }

    closeModal() {
        this.modal.classList.remove('show');
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.currentPhotos = [];
            this.currentPhotoIndex = 0;
            this.currentCountryDate = null;
        }, 300);
    }

    openPhotoOverlay(photoUrl, title, description) {
        // Set the enlarged photo content
        this.enlargedPhoto.src = photoUrl;
        this.overlayTitle.textContent = title;
        this.overlayDescription.textContent = description;
        
        // Show the overlay
        this.photoOverlay.style.display = 'block';
        setTimeout(() => {
            this.photoOverlay.classList.add('show');
        }, 10);
    }

    closePhotoOverlay() {
        this.photoOverlay.classList.remove('show');
        setTimeout(() => {
            this.photoOverlay.style.display = 'none';
        }, 300);
    }

    setupZoomControls() {
        try {
            // PERFORMANCE: Simplified zoom controls
            const zoomInBtn = document.getElementById('zoomInBtn');
            const zoomOutBtn = document.getElementById('zoomOutBtn');
            const resetZoomBtn = document.getElementById('resetZoomBtn');

            if (!zoomInBtn || !zoomOutBtn || !resetZoomBtn) {
                console.warn('Zoom control buttons not found');
                return;
            }

            // Simplified zoom handlers - no console logging for performance
            zoomInBtn.addEventListener('click', () => {
                if (this.chart && this.chart.zoomIn) {
                    this.chart.zoomIn();
                }
            });

            zoomOutBtn.addEventListener('click', () => {
                if (this.chart && this.chart.zoomOut) {
                    this.chart.zoomOut();
                }
            });

            resetZoomBtn.addEventListener('click', () => {
                if (this.chart && this.chart.goHome) {
                    this.chart.goHome();
                }
            });

        } catch (error) {
            console.error('Zoom controls error:', error);
        }
    }

    setupModalEvents() {
        // Close button
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        // Click outside modal to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.previousPhoto();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextPhoto();
        });

        // Photo overlay event listeners
        document.querySelector('.overlay-close').addEventListener('click', () => {
            this.closePhotoOverlay();
        });

        this.photoOverlay.addEventListener('click', (e) => {
            if (e.target === this.photoOverlay) {
                this.closePhotoOverlay();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.photoOverlay.style.display === 'block') {
                // Handle overlay keyboard events
                if (e.key === 'Escape') {
                    this.closePhotoOverlay();
                }
            } else if (this.modal.style.display === 'block') {
                // Handle modal keyboard events
                switch(e.key) {
                    case 'Escape':
                        this.closeModal();
                        break;
                    case 'ArrowLeft':
                        this.previousPhoto();
                        break;
                    case 'ArrowRight':
                        this.nextPhoto();
                        break;
                }
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.worldMapApp = new WorldMapPhotoExplorer();
});