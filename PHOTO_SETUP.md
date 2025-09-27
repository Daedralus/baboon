# 📂 Photo Folder Structure Guide

To use your own local photos, create the following folder structure in your project:

```
baboon/
├── index.html
├── script.js
├── styles.css
├── data.js
├── README.md
├── PHOTO_SETUP.md (this file)
└── photos/                    # Create this folder
    ├── US/                    # Country folders (use 2-letter codes)
    │   ├── nyc_skyline.jpg
    │   ├── golden_gate.jpg
    │   └── grand_canyon.jpg
    ├── FR/
    │   ├── eiffel_tower.jpg
    │   └── louvre_visit.jpg
    ├── IT/
    │   ├── rome_colosseum.jpg
    │   └── venice_canals.jpg
    └── GB/
        ├── london_bridge.jpg
        └── big_ben.jpg
```

## 🔧 Setup Instructions

1. **Create the photos folder** in your project directory
2. **Create country subfolders** using 2-letter country codes:
   - US = United States
   - FR = France
   - GB = United Kingdom
   - IT = Italy
   - DE = Germany
   - ES = Spain
   - JP = Japan
   - AU = Australia
   - CA = Canada
   - etc.

3. **Add your photos** to the country folders
4. **Update data.js** with your photo information

## 📝 Adding Photos to data.js

For each country, add entries like this:

```javascript
"US": [
    {
        url: "photos/US/my_photo.jpg",           // Path to your local photo
        title: "My Amazing Trip",                // Your photo title
        description: "What an incredible day!",  // Your description
        location: "New York City, NY"           // Specific location
    }
],
```

## 🎨 Country Color Coding

- **Green countries** 🟢 = Have photos (clickable)
- **Gray countries** ⚪ = No photos yet
- **Hover effects** show different colors for each type

## 📸 Photo Tips

- **Supported formats**: JPG, PNG, GIF, WebP
- **Recommended size**: 800px - 1200px wide for best quality
- **File naming**: Use descriptive names (no spaces, use underscores)
- **Organization**: Group by country for easy management

## 🚀 Quick Start

1. Copy your travel photos into the photos folder structure
2. Update the country entries in `data.js`
3. Open `index.html` in your browser
4. Click on green countries to see your photos!

---

**Happy photo organizing! 📷✈️**