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

function findClosestMatch(targetString, stringArray) {
    let maxSimilarity = 0;
    let closestMatch = '';

    // Loop through the array of strings and calculate the similarity
    for (const str of stringArray) {
        const similarity = calculateSimilarity(targetString.toLowerCase(), str.toLowerCase());
        if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            closestMatch = str;
        }
    }

    return closestMatch;
}

function calculateSimilarity(str1, str2) {
    const set1 = new Set(str1.split(' '));
    const set2 = new Set(str2.split(' '));

    // Calculate Jaccard similarity coefficient
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    const similarity = intersection.size / union.size;

    return similarity;
}


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
