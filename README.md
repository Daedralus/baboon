# 🌍 Interactive World Map - The Baboon Travels

A lightweight, interactive world map that allows users to click on countries and browse photos from those locations. Perfect for showcasing your personal travel memories with local photo support and visual indicators for countries with content.

## 🚀 Features

- **Interactive World Map**: Click on any country to explore photos
- **🆕 Local Photo Support**: Use your private photos stored locally
- **🆕 Visual Country Indicators**: Countries with photos are colored green, others gray
- **Beautiful Photo Gallery**: Modal popup with image navigation
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Elegant transitions and hover effects
- **Keyboard Navigation**: Use arrow keys and ESC to navigate
- **Lightweight**: Uses CDN resources for fast loading
- **Easy Customization**: Simple data structure for adding photos

## 🎨 Visual Indicators

- **🟢 Green Countries**: Have photos available (click to view!)
- **⚪ Gray Countries**: No photos yet
- **Different hover effects** for each type of country

## 📁 Project Structure

```
baboon/
├── index.html          # Main HTML file
├── script.js           # Interactive map functionality
├── styles.css          # Beautiful styling and responsive design
├── data.js             # Photo data for countries
├── README.md           # This file
├── PHOTO_SETUP.md      # Detailed photo setup guide
└── photos/             # Your local photos (create this folder)
    ├── US/             # Country folders using 2-letter codes
    ├── FR/
    ├── IT/
    └── etc...
```

## 🎯 How to Use

1. **Set up your photos**: See `PHOTO_SETUP.md` for detailed instructions
2. **Open the webpage**: Simply open `index.html` in any modern web browser
3. **Explore the map**: Green countries have photos, gray ones don't yet
4. **Click countries**: Click on green countries to view your travel photos
5. **Navigate photos**: Use the Previous/Next buttons or arrow keys
6. **Close modal**: Click the X, press ESC, or click outside the modal

## 📸 Adding Your Own Photos

### Option 1: Local Photos (Recommended for Private Photos)
1. Create a `photos` folder in your project directory
2. Create country subfolders using 2-letter codes (US, FR, IT, etc.)
3. Add your photos to the appropriate country folders
4. Update `data.js` with your photo information

Example structure:
```
photos/
├── US/
│   ├── new_york_trip.jpg
│   └── california_sunset.jpg
├── FR/
│   └── paris_vacation.jpg
```

### Option 2: Online Photos
You can still use online photo URLs if you prefer.

**For detailed setup instructions, see `PHOTO_SETUP.md`**

### Country Codes
Use ISO 2-letter country codes:
- US = United States
- FR = France  
- JP = Japan
- GB = United Kingdom
- IT = Italy
- etc.

## 🎨 Customization

### Styling
- Edit `styles.css` to change colors, fonts, and layout
- The design uses CSS custom properties for easy theming
- Gradient backgrounds and smooth animations included

### Map Appearance
- Modify the map colors in `script.js` in the `createMap()` function
- Change hover effects and country styling
- Adjust zoom levels and interaction settings

### Photo Display
- Customize the modal layout in `styles.css`
- Modify photo information display format
- Add new navigation features

## 📱 Mobile Support

The application is fully responsive and includes:
- Touch-friendly navigation
- Optimized modal sizes for small screens
- Responsive image sizing
- Mobile-optimized button layouts

## 🌐 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 📄 License

This project uses:
- **amCharts 4**: Free for commercial use with attribution
- **Unsplash Photos**: Sample photos used under Unsplash License
- **Custom Code**: MIT License - feel free to use and modify

## 🔧 Development

To extend functionality:

1. **Add new features** in `script.js`
2. **Style updates** in `styles.css` 
3. **Data management** in `data.js`
4. **Layout changes** in `index.html`

## 💡 Ideas for Enhancement

- Add photo upload functionality
- Implement photo categories/tags
- Add search functionality
- Include photo metadata (date, camera, etc.)
- Add fullscreen photo viewing
- Implement lazy loading for better performance
- Add social sharing features

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

---

**Happy exploring! 🗺️✈️📸**
