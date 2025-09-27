// CLEAN TEST VERSION - NO CONSOLE LOGGING
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
        
        this.init();
    }

    init() {
        // Hide loading spinner
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        this.setupModalEvents();
        this.createMap();
    }

    getCountriesWithPhotos() {
        const photoCountries = Object.keys(photoData);
        return photoCountries.map(code => ({
            code: code,
            hasPhotos: true
        }));
    }

    filterGeodataForPhotos(originalGeodata) {
        const countriesWithPhotos = this.getCountriesWithPhotos();
        const photoCodes = new Set(countriesWithPhotos.map(c => c.code));
        
        const filteredGeodata = {
            ...originalGeodata,
            features: originalGeodata.features.filter(feature => {
                const countryCode = feature.properties?.iso_a2 || feature.id;
                return photoCodes.has(countryCode);
            })
        };
        
        return filteredGeodata;
    }

    createMap() {
        // CLEAN VERSION - NO LOGGING
        am4core.options.animationsEnabled = false;
        am4core.options.autoSetClassName = false;
        
        this.chart = am4core.create("chartdiv", am4maps.MapChart);
        const filteredGeodata = this.filterGeodataForPhotos(am4geodata_worldLow);
        this.chart.geodata = filteredGeodata;
        this.chart.projection = new am4maps.projections.Miller();
        
        const polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());
        polygonSeries.useGeodata = true;
        
        const polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}";
        polygonTemplate.stroke = am4core.color("#2196F3");
        polygonTemplate.strokeWidth = 0.5;
        polygonTemplate.fill = am4core.color("#e6f3ff");
        
        polygonTemplate.events.on("hit", (ev) => {
            let country = ev.target.dataItem.dataContext;
            this.handleCountryClick(country);
        });
        
        polygonTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
        
        // Simple country coloring
        polygonSeries.events.on("ready", () => {
            const hasPhotosColor = am4core.color("#4CAF50");
            
            polygonSeries.mapPolygons.each((polygon) => {
                polygon.fill = hasPhotosColor;
                polygon.tooltipText = "{name}";
            });
        });
        
        this.setupZoomControls();
    }

    handleCountryClick(country) {
        const countryName = country.name;
        const countryId = country.id;
        
        const photos = this.getCountryPhotos(countryId, countryName);
        
        if (photos && photos.length > 0) {
            this.showPhotoModal(countryName, photos, countryId, countryId);
        } else {
            this.showNoPhotosMessage(countryName);
        }
    }

    getCountryPhotos(countryId, countryName) {
        const countryData = photoData[countryId] || photoData[countryName] || null;
        
        if (countryData) {
            if (Array.isArray(countryData)) {
                return countryData;
            } else if (countryData.photos) {
                return countryData.photos;
            }
        }
        
        return null;
    }

    getCountryDate(countryId, countryName) {
        const countryData = photoData[countryId] || photoData[countryName] || null;
        
        if (countryData && !Array.isArray(countryData) && countryData.date) {
            return countryData.date;
        }
        
        return null;
    }

    showPhotoModal(countryName, photos, countryId, countryCode) {
        this.currentPhotos = photos;
        this.currentPhotoIndex = 0;
        this.currentCountryDate = this.getCountryDate(countryCode, countryName);
        this.modalTitle.textContent = `📸 ${countryName}`;
        
        this.displayCurrentPhoto();
        this.updatePhotoCounter();
        this.modal.style.display = 'block';
        
        setTimeout(() => {
            this.modal.classList.add('show');
        }, 10);
    }

    displayCurrentPhoto() {
        if (this.currentPhotos.length === 0) return;
        
        const photo = this.currentPhotos[this.currentPhotoIndex];
        
        const photoHTML = [
            '<div class="photo-container">',
            `<img src="${photo.url}" alt="${photo.title}" class="gallery-image">`,
            '<div class="photo-info">',
            `<h3>${photo.title}</h3>`,
            `<p>${photo.description}</p>`,
            photo.location ? `<span class="photo-location">📍 ${photo.location}</span>` : '',
            this.currentCountryDate ? `<span class="photo-date">📅 ${this.currentCountryDate}</span>` : '',
            '</div>',
            '</div>'
        ].filter(Boolean).join('');
        
        this.photoGallery.innerHTML = photoHTML;
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

    prevPhoto() {
        if (this.currentPhotos.length === 0) return;
        
        this.currentPhotoIndex = (this.currentPhotoIndex - 1 + this.currentPhotos.length) % this.currentPhotos.length;
        this.displayCurrentPhoto();
        this.updatePhotoCounter();
    }

    closeModal() {
        this.modal.classList.remove('show');
        setTimeout(() => {
            this.modal.style.display = 'none';
        }, 300);
    }

    showNoPhotosMessage(countryName) {
        this.photoGallery.innerHTML = `
            <div class="no-photos-message">
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

    setupZoomControls() {
        const zoomInBtn = document.querySelector('.zoom-in');
        const zoomOutBtn = document.querySelector('.zoom-out');
        const resetZoomBtn = document.querySelector('.zoom-reset');

        if (zoomInBtn && this.chart) {
            zoomInBtn.addEventListener('click', () => {
                this.chart.zoomIn();
            });
        }

        if (zoomOutBtn && this.chart) {
            zoomOutBtn.addEventListener('click', () => {
                this.chart.zoomOut();
            });
        }

        if (resetZoomBtn && this.chart) {
            resetZoomBtn.addEventListener('click', () => {
                this.chart.goHome();
            });
        }
    }

    setupModalEvents() {
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        document.getElementById('prevBtn').addEventListener('click', () => {
            this.prevPhoto();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextPhoto();
        });

        document.addEventListener('keydown', (e) => {
            if (this.modal.style.display === 'block') {
                if (e.key === 'Escape') {
                    this.closeModal();
                } else if (e.key === 'ArrowLeft') {
                    this.prevPhoto();
                } else if (e.key === 'ArrowRight') {
                    this.nextPhoto();
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WorldMapPhotoExplorer();
});