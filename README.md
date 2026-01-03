# Accessible-Weather-App
 weather app that displays the current weather details based on the location entered by the user.
# Accessible Weather App — SASSy Weather

A compact, accessible client-side weather app demo with SASSy.code branding.

Live demo: (will be available once you enable GitHub Pages on this repository; see below)

Live roadmap
- This project follows the public roadmap: https://roadmap.sh/projects/weather-app

Features
- Enter a location (city, postal code, or coordinates).
- View current temperature, wind speed, chance of rain, and general conditions.
- See previous 24 hours and next 24 hours in a horizontal hourly timeline.
- Refresh or use your device's location (Geolocation API).

API key (placeholder)
- This repo includes a placeholder API key in docs/app.js: `const API_KEY = 'YOUR_API_KEY_HERE'`.
- Get a free Visual Crossing API key: https://www.visualcrossing.com/
- Replace the placeholder with your key in docs/app.js before publishing (or set up a server-side proxy for private keys).

How to use locally
1. Clone the repo:
   git clone https://github.com/<your-username>/Accessible-Weather-App.git
2. Open docs/index.html in your browser.
3. Edit docs/app.js and replace API_KEY with your Visual Crossing key.


Notes on privacy and API keys
- Visual Crossing API keys used client-side are visible to users. For production, consider a small server-side proxy to hide the key.

License
- MIT
