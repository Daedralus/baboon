// Paris Real-Time Photo Integration
// This script connects your Disney Princess timeline with the travel map

class ParisPhotoSync {
    constructor() {
        this.photoUpdateInterval = null;
        this.currentStageIndex = -1;
        this.init();
    }

    init() {
        // Check for photo updates every 30 seconds
        this.photoUpdateInterval = setInterval(() => {
            this.checkForPhotoUpdates();
        }, 30000);
        
        // Initial check
        this.checkForPhotoUpdates();
    }

    checkForPhotoUpdates() {
        // Get current Paris time (matching your Disney Princess system)
        const parisTime = this.getParisTime();
        
        // Check which stage we should be at
        const currentStage = this.getCurrentStage(parisTime);
        
        if (currentStage !== this.currentStageIndex) {
            this.currentStageIndex = currentStage;
            this.updateMapPhotos(currentStage);
        }
    }

    getParisTime() {
        try {
            const fmt = new Intl.DateTimeFormat('en-GB', { 
                timeZone: 'Europe/Paris', 
                year:'numeric', 
                month:'2-digit', 
                day:'2-digit', 
                hour:'2-digit', 
                minute:'2-digit', 
                second:'2-digit', 
                hour12:false 
            });
            const parts = fmt.formatToParts(new Date());
            const map = {};
            parts.forEach(p => map[p.type] = p.value);
            const iso = `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}+01:00`;
            return new Date(iso);
        } catch(e) {
            return new Date();
        }
    }

    getCurrentStage(currentTime) {
        // Stage data matching your Disney Princess timeline
        const stages = [
            { time: '2025-11-08T10:30:00+01:00', title: 'Croissant class', pathPhoto: 'Path1.png' },
            { time: '2025-11-08T12:30:00+01:00', title: 'Marais mini-stroll', pathPhoto: 'Path2.png' },
            { time: '2025-11-08T13:30:00+01:00', title: 'Musée Vivant du Fromage', pathPhoto: 'Path3.png' },
            { time: '2025-11-08T15:00:00+01:00', title: 'Notre Dame Walk', pathPhoto: 'Path4.png' },
            { time: '2025-11-08T15:40:00+01:00', title: 'Walk to Batobus', pathPhoto: 'Path4.png' },
            { time: '2025-11-08T16:05:00+01:00', title: 'Eiffel Tower', pathPhoto: 'Path5.png' },
            { time: '2025-11-08T19:00:00+01:00', title: 'Dinner at Le Petit Cler', pathPhoto: 'Path6.png' },
            { time: '2025-11-08T21:00:00+01:00', title: 'Sexy Time', pathPhoto: 'Path7.png' }
        ];

        for (let i = stages.length - 1; i >= 0; i--) {
            if (currentTime >= new Date(stages[i].time)) {
                return i;
            }
        }
        return -1; // Before first stage
    }

    updateMapPhotos(stageIndex) {
        // Update the travel map to highlight current path
        console.log(`📍 Stage ${stageIndex + 1} active - updating Paris photos`);
        
        // Trigger map refresh if the world map app exists
        if (window.worldMapApp) {
            // Force refresh of France photos to show current stage
            this.highlightCurrentPath(stageIndex);
        }
    }

    highlightCurrentPath(stageIndex) {
        // Add visual indicator for current active path
        const pathPhotos = document.querySelectorAll('img[src*="paris/Path"]');
        
        pathPhotos.forEach((photo, index) => {
            if (index === stageIndex) {
                // Highlight current active path
                photo.style.border = '3px solid #4CAF50';
                photo.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.5)';
                photo.parentElement.classList.add('fresh-content');
            } else {
                // Reset other paths
                photo.style.border = '';
                photo.style.boxShadow = '';
                photo.parentElement.classList.remove('fresh-content');
            }
        });
    }

    // Manual stage update (for testing)
    setStage(stageIndex) {
        this.currentStageIndex = stageIndex;
        this.updateMapPhotos(stageIndex);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.parisSync = new ParisPhotoSync();
});

// Export for manual control
window.ParisPhotoSync = ParisPhotoSync;