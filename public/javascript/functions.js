const icons = {
    sunrise: '\uf172',
    sunset: '\ue1c6',
    precipitation: '\ue798',
    humidity: '\uf87e',
    wind: '\uefd8',
    pressure: '\ue69d',
    feelsLike: '\uf077',
    visibility: '\ue8f4',
    uvIndex: '\ue518', // Placeholder for the UV Index icon
    cloudCover: '\ue2be', // Placeholder for the Cloud Cover icon
    dewPoint: '\uf879', // Placeholder for the Dew Point icon
    moonrise: '\ue20c', // Placeholder for the Moonrise icon
    moonset: '\uf036', // Placeholder for the Moonset icon
    airQualityIndex: '\uf077', // Placeholder for the Air Quality Index icon
    rain: '\uf61e', // Placeholder for the Moon Phase icon
    chanceOfRain: '\uf176', // Placeholder for the Heat Index icon
    snow: '\ueb3b', // Placeholder for the Solar Radiation icon
    chanceOfSnow: '\ue819', // Position icon
    position: 'assets/position.png', // Position
    notFound: 'assets/notFound/noLocationFound.webp', //
    // Add more icons as needed
};

const img = {
    sunrise: 'assets/sunrise.png',
    sunset: 'assets/sunset.png',
    precipitation: 'assets/precipitation.png',
    humidity: 'assets/humidity.png',
    wind: 'assets/wind.png',
    pressure: 'assets/pressure.png',
    feelsLike: 'assets/feelsLike.png',
    visibility: 'assets/visibility.png',
    uvIndex: 'assets/uvIndex.png', 
    cloudCover: 'assets/cloudCover.png', 
    dewPoint: 'assets/dewPoint.png',
    moonrise: 'assets/moonrise.png',
    moonset: 'assets/moonset.png',
    airQualityIndex: 'assets/airQuality.png',
    rain: 'assets/rain.png',
    chanceOfRain: 'assets/chanceOfRain.png',
    snow: 'assets/snow.png',
    chanceOfSnow: 'assets/chanceOfSnow.png',
    position: 'assets/position.png',
    maxTemp: 'assets/maxTemp.png',
    minTemp: 'assets/minTemp.png',
    averageTemp: 'assets/averageTemp.png',
    maxWind: 'assets/maxWind.png',
    totalPrecipitation: 'assets/totalPrecipitation.png',
    totalSnow: 'assets/totalSnow.png',
    averageVisibility: 'assets/averageVisibility.png',
    averageHumidity: 'assets/averageHumidity.png',
    // Add more icons as needed
};

function countOccurrence(mainPhrase, ...searchPhrases) {
    // Initialize a variable to store the count
    let count = 0;

    // Loop through each search phrase
    searchPhrases.forEach(phrase => {
        // Use a regular expression to find all occurrences of the search phrase in the main phrase
        const regex = new RegExp(phrase, 'gi');
        const matches = mainPhrase.match(regex);
        
        // If matches are found, increment the count by the number of matches
        if (matches) {
            count += matches.length;
        }
    });

    // Return the total count
    return count;
}


// Function to set background color based on weather condition
function setBackground(weatherCondition, unHidePage) {
    const body = document.body;

    // Define color mappings based on weather conditions using linear gradients
    const colorMappings = {
        'clear': 'linear-gradient(180deg, hsl(210, 70%, 60%), hsl(50, 100%, 70%))', // This gradient transitions from blue to yellow, indicating clear skies
        'partly cloudy': 'linear-gradient(180deg, hsl(210, 73%, 33%), hsl(0, 7%, 84%), hsl(47, 8%, 77%), hsl(52, 73%, 47%)', // This gradient transitions from dark blue to dark gray to dark yellow for partly cloudy weather
        'overcast': 'linear-gradient(180deg, hsl(0, 0%, 60%), hsl(0, 0%, 70%), hsl(0, 2%, 18%))', // Start with darker gray and transition to lighter gray for overcast weather
        'cloudy': 'linear-gradient(180deg, hsl(0, 0%, 30%), hsl(0, 0%, 70%))', // Start with darker gray and transition to lighter gray for cloudy weather
        'rain': 'linear-gradient(180deg, hsl(207, 75%, 42%), hsl(211, 28%, 42%))', // Start with darker blue and transition to lighter blue for rainy weather
        'snow': 'linear-gradient(180deg, hsl(200, 30%, 50%), hsl(200, 20%, 85%))', // Start with darker white and transition to lighter white for snowy weather
        'sunny': 'linear-gradient(180deg, hsl(59, 29%, 53%), hsl(200, 60%, 76%))', // Start with darker yellow and transition to lighter yellow for sunny weather
        'fog': 'linear-gradient(180deg, hsl(0, 0%, 50%), hsl(0, 0%, 65%))', // Start with darker gray and transition to lighter gray for foggy weather
        'Thundery outbreaks in nearby': 'linear-gradient(180deg, hsl(240, 50%, 40%), hsl(0, 0%, 40%), hsl(50, 67%, 42%))', // This gradient transitions from a slightly dark blue to a dark grayish-white, with a touch of yellow for lightning
        'Thunderstorm': 'linear-gradient(180deg, hsl(240, 80%, 20%), hsl(240, 70%, 15%), hsl(0, 0%, 70%), hsl(0, 0%, 20%))', // Start with darker purple and transition to lighter purple for thunderstorm
        'windy': 'linear-gradient(180deg, hsl(120, 70%, 50%), hsl(120, 50%, 60%))', // Start with darker green and transition to lighter green for windy weather
        'haze': 'linear-gradient(180deg, hsl(60, 70%, 60%), hsl(60, 50%, 70%))', // Start with darker brown and transition to lighter brown for hazy weather
        'smoke': 'linear-gradient(180deg, hsl(0, 0%, 10%), hsl(0, 0%, 20%))', // Start with darker gray and transition to lighter gray for smokey weather
        'dust': 'linear-gradient(180deg, hsl(30, 90%, 60%), hsl(30, 70%, 65%))', // Start with darker orange and transition to lighter orange for dusty weather
        'tornado': 'linear-gradient(180deg, hsl(0, 100%, 10%), hsl(0, 100%, 20%))', // Start with darker black and transition to lighter black for tornado weather
        'sandstorm': 'linear-gradient(180deg, hsl(40, 90%, 60%), hsl(40, 90%, 70%))', // Start with darker sand color and transition to lighter sand color for sandstorm
        'hail': 'linear-gradient(180deg, hsl(240, 50%, 30%), hsl(240, 30%, 45%))', // Start with darker cyan and transition to lighter cyan for hail weather
        'blizzard': 'linear-gradient(180deg, hsl(200, 30%, 70%), hsl(200, 10%, 85%))', // Start with darker blue and transition to lighter blue for blizzard weather
        'drizzle': 'linear-gradient(180deg, hsl(210, 50%, 50%), hsl(210, 40%, 65%))', // Start with darker blue and transition to lighter blue for drizzle weather
        'sleet': 'linear-gradient(180deg, hsl(215, 94%, 82%), hsl(200, 56%, 47%), hsl(200, 42%, 42%), hsl(201, 29%, 28%))', // Start with darker blue and transition to lighter blue for sleet weather
        'freezing rain': 'linear-gradient(180deg, hsl(210, 40%, 50%), hsl(210, 30%, 60%))', // Start with darker blue and transition to lighter blue for freezing rain weather
        'icy': 'linear-gradient(180deg, hsl(240, 10%, 85%), hsl(240, 5%, 95%))', // Start with darker blue and transition to lighter blue for icy weather
        'squall': 'linear-gradient(180deg, hsl(240, 70%, 40%), hsl(240, 50%, 65%))', // Start with darker blue and transition to lighter blue for squall weather
        'tropical storm': 'linear-gradient(180deg, hsl(240, 70%, 40%), hsl(240, 50%, 65%))', // Start with darker blue and transition to lighter blue for tropical storm weather
        'ash': 'linear-gradient(180deg, hsl(0, 0%, 20%), hsl(0, 0%, 40%), hsl(0, 0%, 60%))', // This gradient transitions from darker shades to lighter shades of gray
        'volcanic eruption': 'linear-gradient(180deg, hsl(0, 0%, 10%), hsl(0, 0%, 25%))', // Start with darker gray and transition to lighter gray for volcanic eruption weather
        'rainbow': 'linear-gradient(180deg, hsl(0, 100%, 30%), hsl(360, 100%, 70%))', // Start with darker rainbow colors and transition to lighter rainbow colors for rainbow weather
        'meteor shower': 'linear-gradient(180deg, hsl(240, 60%, 40%), hsl(240, 30%, 70%))', // Start with darker blue and transition to lighter blue for meteor shower weather
        'patchy light rain with thunder': 'linear-gradient(180deg, hsl(210, 70%, 60%), hsl(0, 0%, 70%), hsl(50, 100%, 70%))', // Blue to gray to yellow for patchy light rain with thunder
        'mist': 'linear-gradient(180deg, hsl(210, 70%, 60%), hsl(0, 0%, 70%), hsl(50, 100%, 70%))', // Blue to gray to yellow for patchy light rain with
        'light sleet': 'linear-gradient(180deg, hsl(215, 94%, 82%), hsl(200, 99%, 71%), hsl(200, 55%, 57%), hsl(200, 34%, 23%))' // This gradient starts with a light shade of blue (Hue: 200), gradually darkens to represent the sleet, and ends with a darker shade of blue.

        // Add more weather conditions and their corresponding colors as needed
    };

    let maxKeywordsCount = 0;
    let matchingColor = '';
    
    // Loop through color mappings and find the one with the most matched keywords
    for (const condition in colorMappings) {
        const keywords = condition.toLowerCase().split(' '); // Split condition into keywords
        let keywordsCount = 0;
    
        // Count occurrence of each keyword in the weather condition
        keywords.forEach(keyword => {
            if (weatherCondition.toLowerCase().includes(keyword)) {
                keywordsCount++;
            }
        });
    
        // Update matchingColor if more keywords are matched
        if (keywordsCount > maxKeywordsCount) {
            maxKeywordsCount = keywordsCount;
            matchingColor = colorMappings[condition];
        }
    }

    // Set background color based on weather condition or default to light blue if no specific condition is found
    if (maxKeywordsCount > 0) {
        // If any weather condition keyword is found, set background color based on the most matched keywords
        body.style.backgroundImage = matchingColor;
        unHidePage.removeAttribute('hidden');
    } else {
        // If no specific condition is found, default to light blue
        document.body.style.backgroundImage = 'linear-gradient(to bottom, #fff, #fff)';
        unHidePage.removeAttribute('hidden');
    }
}

// // Select the logo div
// const logoDiv = document.getElementById('logo');

// // SVG content as a string
const brokenLocationSvg = `
<svg id="SvgjsSvg1001" width="470" height="470" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs"><defs id="SvgjsDefs1002"></defs><g id="SvgjsG1008"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="550" height="550"><g data-name="10"><path fill="#4f3cc9" d="m831.37 750.1-10.26-2.23-2.33-10.25a.8.8 0 0 0-1.56 0l-2.34 10.29-10.27 2.44a.79.79 0 0 0 0 1.55l10.26 2.24 2.33 10.24a.8.8 0 0 0 1.56 0l2.34-10.29 10.27-2.44a.79.79 0 0 0 0-1.55ZM280.37 579.1l-10.26-2.23-2.33-10.25a.8.8 0 0 0-1.56 0l-2.34 10.29-10.27 2.44a.79.79 0 0 0 0 1.55l10.26 2.24 2.33 10.24a.8.8 0 0 0 1.56 0l2.34-10.29 10.27-2.44a.79.79 0 0 0 0-1.55ZM894 821.66l-6.7-1.46-1.52-6.68a.52.52 0 0 0-1 0l-1.53 6.71-6.7 1.59a.53.53 0 0 0-.4.52.51.51 0 0 0 .41.5l6.7 1.46 1.52 6.69a.53.53 0 0 0 1 0l1.52-6.72 6.71-1.59a.52.52 0 0 0 .4-.51.52.52 0 0 0-.41-.51Z" class="color4f3cc9 svgShape"></path><path fill="#4f3cc9" d="M612.27 274.66h6v46.37h-6z" transform="rotate(-39.7 615.362 297.86)" class="color4f3cc9 svgShape"></path><path fill="#4f3cc9" d="M677.67 270.26h60.3v6h-60.3z" transform="rotate(-78.14 707.781 273.27)" class="color4f3cc9 svgShape"></path><path fill="#4f3cc9" d="M766.83 339.96h39.42v6h-39.42z" transform="rotate(-34.34 786.582 342.965)" class="color4f3cc9 svgShape"></path><ellipse cx="570.5" cy="937.75" fill="#f582ae" rx="274.5" ry="28.25" class="colorf582ae svgShape"></ellipse><path fill="#4f3cc9" d="M570.5 969c-73.42 0-142.46-2.94-194.41-8.29-25.34-2.61-45.27-5.65-59.23-9.05-16.5-4-23.86-8.3-23.86-13.91s7.36-9.9 23.86-13.91c14-3.4 33.89-6.44 59.23-9.05 52-5.35 121-8.29 194.41-8.29s142.46 2.94 194.41 8.29c25.34 2.61 45.27 5.65 59.23 9.05 16.5 4 23.86 8.3 23.86 13.91s-7.36 9.9-23.86 13.91c-14 3.4-33.89 6.44-59.23 9.05C713 966.06 643.92 969 570.5 969Zm0-56.5c-72.78 0-141.3 2.9-192.95 8.17-76.85 7.84-78.54 17-78.55 17.08s1.7 9.24 78.55 17.08c51.65 5.27 120.17 8.17 193 8.17s141.3-2.9 193-8.17C840 947 842 937.92 842 937.75s-2-9.27-78.55-17.08c-51.65-5.27-120.17-8.17-192.95-8.17Z" class="color4f3cc9 svgShape"></path><g data-name="Map mark" fill="none"><path fill="#77e0b5" d="m719 372.45-35.3 31.68L692 447l-15.49 18.56a112.53 112.53 0 0 1-37.88 202.35l-30.39 40.87 35.16 135.94 128.67-143.24a214.05 214.05 0 0 0-53.08-329Z" class="color77e0b5 svgShape"></path><path fill="#4f3cc9" d="M641.94 850.9 605 708.15l31.9-42.9 1.1-.25a109.53 109.53 0 0 0 36.87-197l-2.71-1.87 16.68-20-8.42-43.13 38.18-34.26 1.88 1.08A217 217 0 0 1 829.15 577a215.09 215.09 0 0 1-54.85 126.48Zm-30.4-141.48L645 838.57l124.89-139.1a209.13 209.13 0 0 0 53.33-123 211.77 211.77 0 0 0-103.84-200.33L687 405.23l8.3 42.6L680.94 465a115.54 115.54 0 0 1-40.51 205.6Z" class="color4f3cc9 svgShape"></path><path fill="#77e0b5" d="m627 407 12 42-13.84 19.82a112.49 112.49 0 1 0-20.39 204.86L578 717l46.69 132.43L570 922 398.94 695.67a213 213 0 0 1-43.19-128.92c0-118.19 95.81-214 214-214a213.17 213.17 0 0 1 89.71 19.66Z" class="color77e0b5 svgShape"></path><path fill="#4f3cc9" d="m570 927-2.39-3.17-171.06-226.35a217 217 0 0 1 264.17-327.79l3.77 1.74-34.14 36.38 11.93 41.74-16.22 23.23-2.38-1.35a109.49 109.49 0 1 0-19.85 199.4l7.81-2.57-30.33 49.1L628.05 850Zm-.25-571.23c-116.35 0-211 94.65-211 211a209.11 209.11 0 0 0 42.58 127.11L570 917l51.33-68.11-46.64-132.25 23.43-37.91a115.5 115.5 0 1 1 26.13-213.84l11.47-16.44-12.07-42.26 30.75-32.77a209.17 209.17 0 0 0-84.65-17.67Z" class="color4f3cc9 svgShape"></path></g><g fill="none"><path fill="#ffffff" d="M512 743.07s-12.89-35.45-47.27-25.78c0 0-4.29-51.56-60.15-54.79s-73.05 40.82-73.05 40.82-47.26-25.78-79.49 14c0 0-36.52 0-44 25.78Z" class="colorfff svgShape"></path><path fill="#4f3cc9" d="M516.28 746.07H204l1.12-3.84c7.26-24.91 38.29-27.62 45.48-27.91 17.33-20.58 38.62-23.3 53.55-21.91a83.72 83.72 0 0 1 25.94 6.88 73.14 73.14 0 0 1 15-19.77c10.72-10.08 29.79-21.74 59.7-20 30.16 1.74 45.7 17.3 53.42 30a71.64 71.64 0 0 1 9.07 24c34.16-7.21 47.44 28.1 47.58 28.46Zm-303.95-6h295c-4.39-8.52-17-26.87-41.81-19.89l-3.5 1-.3-3.62a64.56 64.56 0 0 0-8.83-25.08c-10.16-16.62-26.49-25.69-48.51-27-22.2-1.28-40.73 4.84-55.05 18.21a64.12 64.12 0 0 0-15 20.71l-1.25 3.16-3-1.62a76.73 76.73 0 0 0-26.71-7.59c-19.87-1.79-36.37 5.21-49 20.81l-.9 1.11H252c-.28.02-30.48.31-39.67 19.8Z" class="color4f3cc9 svgShape"></path><path fill="#ffffff" d="M955 637s-8.14-22.39-29.86-16.29c0 0-2.71-32.57-38-34.6S841 611.89 841 611.89s-29.86-16.28-50.22 8.82c0 0-23.07 0-27.82 16.29Z" class="colorfff svgShape"></path><path fill="#4f3cc9" d="M959.32 640H759l1.12-3.84c4.64-15.91 23.77-18.1 29.26-18.4 17.83-20.76 42.08-13.22 50.26-9.8 4.08-7.41 17.62-26.58 47.71-24.85 30.45 1.76 38.35 25.12 40.26 34 17.3-3 27.28 10.73 30.25 18.88Zm-191.72-6h182.63c-3.27-5.49-10.78-14.18-24.24-10.4l-3.5 1-.3-3.63c-.11-1.21-3-30-35.18-31.86-32.59-1.88-42.76 22.84-43.18 23.89l-1.25 3.15-3-1.61c-1.13-.61-27.94-14.75-46.45 8.07l-.9 1.11h-1.43c-.16-.01-16.86.17-23.2 10.28Z" class="color4f3cc9 svgShape"></path></g></g></svg></g></svg>`;

// // Set the innerHTML of the logo div to the SVG content
// logoDiv.innerHTML = svgContent;


// Function to get a short definition for weather description
function getWeatherDefinition(title) {
    switch (title.toLowerCase()) {
        case 'clear':
            return 'Clear sky means that there are no clouds in the sky, resulting in sunny weather with bright sunshine.';
        case 'partly cloudy':
            return 'Partly cloudy weather means that the sky is partly covered with clouds, resulting in a mixture of sun and clouds.';
        case 'overcast':
            return 'Overcast weather refers to a sky that is completely covered with clouds, resulting in a dull and gloomy appearance.';
        case 'cloudy':
            return 'Cloudy weather means that the sky is covered with clouds, resulting in limited sunshine and subdued lighting.';
        case 'rain':
            return 'Rainy weather refers to the presence of precipitation in the form of water droplets falling from the sky.';
        case 'snow':
            return 'Snowy weather refers to the presence of frozen precipitation in the form of ice crystals falling from the sky.';
        case 'sunny':
            return 'Sunny weather means that the sky is clear and bright, with abundant sunshine.';
        case 'fog':
            return 'Foggy weather refers to the presence of thick mist close to the ground, resulting in reduced visibility.';
        case 'thunderstorm':
            return 'Thunderstorm weather is characterized by thunder, lightning, heavy rain, and sometimes hail.';
        case 'windy':
            return 'Windy weather is characterized by strong winds blowing across the landscape.';
        case 'haze':
            return 'Hazy weather is characterized by the presence of fine dust, smoke, or other dry particles that obscure visibility.';
        case 'smoke':
            return 'Smokey weather refers to the presence of suspended particles and gases released from burning materials, often resulting in reduced air quality.';
        case 'dust':
            return 'Dusty weather refers to the presence of suspended particles of sand or fine soil carried by strong winds.';
        case 'tornado':
            return 'Tornado weather is characterized by a violent rotating column of air extending from a thunderstorm to the ground.';
        case 'sandstorm':
            return 'Sandstorm weather refers to the presence of strong winds carrying sand particles, resulting in reduced visibility and potential damage.';
        case 'hail':
            return 'Hail weather refers to the presence of small balls or lumps of ice falling from the sky during a thunderstorm.';
        case 'blizzard':
            return 'Blizzard weather is characterized by strong winds, low temperatures, and heavy snowfall, resulting in reduced visibility and dangerous travel conditions.';
        case 'drizzle':
            return 'Drizzle weather refers to light rain falling in very fine droplets.';
        case 'sleet':
            return 'Sleet weather refers to a mixture of rain and snow falling from the sky.';
        case 'freezing rain':
            return 'Freezing rain weather refers to rain that freezes upon contact with surfaces, creating hazardous conditions.';
        case 'icy':
            return 'Icy weather refers to conditions where surfaces are covered with a layer of ice, making them slippery and dangerous.';
        case 'squall':
            return 'Squall weather refers to sudden, sharp increases in wind speed accompanied by rain or snow.';
        case 'tropical storm':
            return 'Tropical storm weather refers to a localized, very intense low-pressure wind system, forming over tropical oceans and with winds of hurricane force.';
        case 'ash':
            return 'Ash weather refers to the presence of particles of pulverized rock, minerals, and volcanic glass created during volcanic eruptions, often causing respiratory issues and reducing visibility.';
        case 'volcanic eruption':
            return 'Volcanic eruption weather refers to atmospheric conditions during a volcanic eruption, characterized by the release of gases, ash, and volcanic materials.';
        case 'rainbow':
            return 'Rainbow weather refers to the appearance of a spectrum of light in the sky, caused by the refraction and dispersion of sunlight.';
        case 'meteor shower':
            return 'Meteor shower weather refers to the occurrence of numerous meteors visible in the sky, typically during specific periods of the year when the Earth passes through a trail of debris left by a comet or asteroid.';
        case 'patchy light rain with thunder':
            return 'Patchy light rain with thunder refers to the occurrence of light rain accompanied by thunder, resulting in scattered thunderstorms with minimal rainfall.';
        case 'light sleet':
            return 'Light sleet weather refers to a mixture of light rain and snow falling from the sky. Light sleet typically occurs when there is a mixture of rain and snow, with the snowflakes partially melting before reaching the ground. This weather condition is characterized by light precipitation that may create a thin layer of ice on surfaces, including roads and sidewalks';
        // Add more cases for other color names as needed
        default:
            return 'Weather conditions vary. Please check the detailed forecast for more information.';
    }
}


