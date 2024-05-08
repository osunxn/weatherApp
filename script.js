document.addEventListener('DOMContentLoaded', function() {
    const getWeatherButton = document.getElementById('get-weather');
    const celsiusToggle = document.getElementById('celsius');
    const fahrenheitToggle = document.getElementById('fahrenheit');
    const map2D = document.getElementById('2Dmap');
    const map3D = document.getElementById('3Dmap');
    let city = "null";
    let isCelsius = true; // Flag to track the current temperature unit
    let isclicked = 'none'; // Flag to

    // inatialize the fuction to set the landingPage to the info to user location
    getUserLocation();
    

    // Function to toggle between Celsius and Fahrenheit
    function toggleTemperatureUnit() {
        // Toggle the temperature unit flag
        isCelsius = !isCelsius;

        // Update temperature display for current weather
        const currentTemperatureElement = document.querySelector('.hour-temperature');
        const currentTemperature = parseFloat(currentTemperatureElement.textContent);
        const updatedTemperature = isCelsius ? convertToFahrenheit(currentTemperature) : convertToCelsius(currentTemperature);
        currentTemperatureElement.textContent = updatedTemperature.toFixed(2) + (isCelsius ? "°C" : "°F");

        // Update temperature display for next 7 hours
        const hourTemperatureElements = document.querySelectorAll('.hour-info .hour-temperature');
        hourTemperatureElements.forEach(element => {
            const temperature = parseFloat(element.textContent);
            const updatedTemperature = isCelsius ? convertToFahrenheit(temperature) : convertToCelsius(temperature);
            element.textContent = updatedTemperature.toFixed(2) + (isCelsius ? "°C" : "°F");
        });
    }

    // Function to convert Celsius to Fahrenheit
    function convertToFahrenheit(celsius) {
        return (celsius * 9 / 5) + 32;
    }

    // Function to convert Fahrenheit to Celsius
    function convertToCelsius(fahrenheit) {
        return (fahrenheit - 32) * 5 / 9;
    }


    setBackground('default');
    celsiusToggle.addEventListener('click', toggleTemperatureUnit);
    fahrenheitToggle.addEventListener('click', toggleTemperatureUnit);

    getWeatherButton.addEventListener('click', handleGetWeather);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            city = document.getElementById('city').value;
            handleGetWeather(city);
            pageController();
        }
    });

    // Event listener for the 2D map button click
    map2D.addEventListener('click', function() {
        isclicked = '2map';
        console.log('Button clicked is', isclicked);
        // Call the callmap function after the event listeners are set up
        callmap(isclicked); 
    });

    // Event listener for the 3D map button click
    map3D.addEventListener('click', function() {
        isclicked = '3map';
        console.log('Button clicked is', isclicked);
        // Call the callmap function after the event listeners are set up
        callmap(isclicked); 
    });
    
    function getUserLocation() {
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                city = data.city;
                const country = data.country_name;
                const latitude = data.latitude;
                const longitude = data.longitude;
                
                console.log('City:', city);
                console.log('Country:', country);
                console.log('Latitude:', latitude);
                console.log('Longitude:', longitude);
    
                // Call handleGetWeather with the location name
                handleGetWeather(city);
            })
            .catch(error => {
                console.error('Error fetching location data:', error);
            });
    }    
    

    function handleGetWeather(city) {
        const apiKey = '9d25421f1b894a7abb8225858240204'; // Replace with your WeatherAPI.com API key
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&alerts=no`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Update current weather information
                const todayWeatherInfo = document.querySelector('.today-weather-info');
                const currentWeather = data.current;
                const todayDate = new Date().toDateString();
                const temperature = isCelsius ? currentWeather.temp_c : currentWeather.temp_f;
                const temperatureUnit = isCelsius ? "°C" : "°F";

                // Assuming data is your object containing the weather information
                const weatherConditionText = data.current.condition.text;
                const weatherConditionCode = data.current.condition.code;

                console.log('Weather condition text:', weatherConditionText);
                console.log('Weather condition code:', weatherConditionCode);

                setBackground(weatherConditionText);

                todayWeatherInfo.querySelector('.hour-temperature').textContent = `${temperature}${temperatureUnit}`;
                todayWeatherInfo.querySelector('.hour-icon').src = currentWeather.condition.icon;
                todayWeatherInfo.querySelector('.location-name').textContent = data.location.name + ',';
                
                
                // Assuming data is your object containing location information
                if (data.location.region && countOccurrence(data.location.region, data.location.name) <= 0) {
                    todayWeatherInfo.querySelector('.location-region').textContent = data.location.region + ',';
                } else {
                    todayWeatherInfo.querySelector('.location-region').hidden = true;
                    console.log('Region name',data.location.region, 'same as location name hidden!');
                }      
                todayWeatherInfo.querySelector('.location-country').textContent = data.location.country;
                todayWeatherInfo.querySelector('.date').textContent = todayDate;

                // Display current time based on the location timezone
                const timezone = data.location.tz_id;
                const currentTime = new Date().toLocaleTimeString('en-US', {timeZone: timezone});
                todayWeatherInfo.querySelector('.current-time').textContent = `Current Time: ${currentTime}`;

                // Function to calculate the hour offset for the forecast
                function calculateHourOffset(currentHour) {
                    const offset = (currentHour + 1) % 24; // Ensure it wraps around the 24-hour clock
                    return offset;
                }

                // Update forecast information for the next 7 hours starting from the hour immediately following the current time
                const forecastContainer = document.querySelector('.nownext12hoursinfo');
                forecastContainer.innerHTML = ''; // Clear existing forecast data

                // Add the current hour data (Now)
                const currentHourEpoch = data.location.localtime_epoch;
                const currentHourData = data.forecast.forecastday[0].hour.find(hourData => {
                    const hourEpoch = hourData.time_epoch;
                    return Math.abs(hourEpoch - currentHourEpoch) < 3600; // Check if the difference is within 1 hour (3600 seconds)
                });

                if (currentHourData) {
                    const currentHourTime = new Date(currentHourData.time_epoch * 1000).toLocaleTimeString('en-US', {timeZone: timezone});
                    const currentTemperature = isCelsius ? currentHourData.temp_c : currentHourData.temp_f;
                    const currentTemperatureUnit = isCelsius ? "°C" : "°F";
                    
                    const currentHourElement = document.createElement('div');
                    currentHourElement.classList.add('hour-info');
                    currentHourElement.innerHTML = `
                        <p class="placeHourDateTime">Now</p>
                        <div class="timeInformation">
                            <!-- <p class="placeHourDateTime">${currentHourTime}</p>  Display current time here -->
                            <img class="hour-icon" src="${currentHourData.condition.icon}" alt="Weather Icon">
                            <h5 class="hour-temperature">${currentTemperature}${currentTemperatureUnit}</h5>
                        </div>
                    `;
                    forecastContainer.appendChild(currentHourElement);
                }

                // Add forecast for the next 12 hours
                const currentTimeEpoch = data.location.localtime_epoch; // Local time provided by the API
                for (let i = 1; i <= 12; i++) {
                    const nextHourEpoch = currentTimeEpoch + i * 3600; // Increment by 3600 seconds (1 hour)

                    const nextHourTime = new Date(nextHourEpoch * 1000).toLocaleTimeString('en-US', {timeZone: timezone});
                    const nextHourData = data.forecast.forecastday[0].hour.find(hourData => {
                        const hourEpoch = hourData.time_epoch;
                        return Math.abs(hourEpoch - nextHourEpoch) < 3600; // Check if the difference is within 1 hour (3600 seconds)
                    });

                    if (nextHourData) {
                        const hourElement = document.createElement('div');
                        hourElement.classList.add('hour-info');
                        hourElement.innerHTML = `
                            <p class="placeHourDateTime">${nextHourTime}</p>
                            <div class="timeInformation">
                                <img class="hour-icon" src="${nextHourData.condition.icon}" alt="Weather Icon">
                                <h5 class="hour-temperature">${isCelsius ? nextHourData.temp_c : nextHourData.temp_f}${temperatureUnit}</h5>
                            </div>
                        `;
                        forecastContainer.appendChild(hourElement);
                    }
                }

                // Add weather details
                const weatherDetailsContainer = document.querySelector('.weather-details');
                weatherDetailsContainer.innerHTML = ''; // Clear existing weather details

            // Extracting the pieces of information
            const weatherDetails = [
                { title: 'Sunrise', info: data.forecast.forecastday[0].astro.sunrise, icon: icons.sunrise },
                { title: 'Sunset', info: data.forecast.forecastday[0].astro.sunset, icon: icons.sunset },
                { title: 'Precipitation', info: `${data.current.precip_mm} mm (${data.current.precip_in} in)`, icon: icons.precipitation },
                { title: 'Humidity', info: `${data.current.humidity}%`, icon: icons.humidity },
                { title: 'Wind', info: `${data.current.wind_kph} km/h (${data.current.wind_mph} mph) ${data.current.wind_dir}`, icon: icons.wind },
                { title: 'Pressure', info: `${data.current.pressure_mb} mb (${data.current.pressure_in} in)`, icon: icons.pressure },
                { title: 'Feels Like', info: `${data.current.feelslike_c}°C (${data.current.feelslike_f}°F)`, icon: icons.feelsLike },
                { title: 'Visibility', info: `${data.current.vis_km} km (${data.current.vis_miles} miles)`, icon: icons.visibility },
                { title: 'Weather Description', info: data.current.condition.text, icon: currentHourData.condition.icon },
                { title: 'UV Index', info: data.current.uv, icon: icons.uvIndex },
                { title: 'Cloud Cover', info: `${data.current.cloud}%`, icon: icons.cloudCover },
                { title: 'Dew Point', info: `${data.current.dewpoint_c}°C (${data.current.dewpoint_f}°F)`, icon: icons.dewPoint },
                { title: 'Moonrise', info: data.forecast.forecastday[0].astro.moonrise, icon: icons.moonrise },
                { title: 'Moonset', info: data.forecast.forecastday[0].astro.moonset, icon: icons.moonset },
                { title: 'Moon Phase', info: data.forecast.forecastday[0].astro.moon_phase, icon: icons.moonPhase },
                { title: 'Heat Index', info: `${data.current.heatindex_c}°C (${data.current.heatindex_f}°F)`, icon: icons.heatIndex },
                { title: 'Solar Radiation', info: `${data.current.solarradiation} W/m²`, icon: icons.solarRadiation },
            
                // Add more weather details as needed
            ];

            // Loop through each weather detail and create HTML elements
            weatherDetails.forEach(detail => {
                if (detail.title !== 'Weather Description') {
                    // Create HTML elements for other weather details
                    console.log("Icon URL:", detail.icon); // Log the icon URL
                    const detailElement = document.createElement('div');
                    detailElement.classList.add('detail-info');
                    detailElement.innerHTML = `
                        <p class="detailsTitle">${detail.title}</p>
                        <div class="detail-content">
                            <h5 class="detailinfo">${detail.info}</h5>
                            <span class="material-symbols-outlined">${detail.icon}</span>
                        </div>
                    `;
                    // Append the detail to weatherDetailsContainer
                    weatherDetailsContainer.appendChild(detailElement);
                }
            });

            
            // Find the index of the 'Visibility' detail
            const visibilityIndex = weatherDetails.findIndex(detail => detail.title === 'Visibility');

            // Find the weather description detail
            const weatherDescription = weatherDetails.find(detail => detail.title === 'Weather Description');
            const explanation = getWeatherDefinition(weatherDescription.info);
            console.log("Explanation:", explanation);


            if (weatherDescription) {
                const weatherDescriptionElement = document.createElement('div');
                weatherDescriptionElement.classList.add('weatherDescription');
                weatherDescriptionElement.innerHTML = `
                    <h2 class="weatherdetailsTitle">${weatherDescription.title}</h2>
                    <div class="theweatherbox">
                        <div class="boxsizingmain">
                            <h4 class="titleName">${weatherDescription.info}</h4>
                            <img class="hour-iconweather" src="${weatherDescription.icon}" alt="Weather Icon">
                        </div>
                        <div class="locationname">
                            <h4 class="location-name">${data.location.name}</h4>
                            <h4 class="location-region"></h4>
                            <h4 class="location-country">${data.location.country}</h4>
                        </div>
                        <div class="toggletwo">
                            <span id="threeDmapDetail" class="active">3D</span>
                            <span id="twoDmapDetail" class="active">2D</span>
                        </div>
                        <p class="descriptionexplain">${explanation}</p>
                    </div>
                    <div id="regionMap">
                        <div id="twodmap"></div>
                        <div id="threedmap"></div>
                    </div>
                `;

                // Define location detail elements
                const regiondetail = document.querySelector('.location-region');

                // Assuming data is your object containing location information
                if (data.location.region && countOccurrence(data.location.region, data.location.name) <= 0) {
                    regiondetail.hidden = true;
                } else {
                    regiondetail.textContent = data.location.region + ',';
                }          

                // Insert the weatherDescription div after the visibility detail
                if (visibilityIndex !== -1) {
                    const visibilityDetail = document.querySelectorAll('.detail-info')[visibilityIndex];
                    const parentContainer = visibilityDetail.parentNode;
                    // Set up styling for the first 8 details to display as a block with 4 details per row
                    parentContainer.style.display = 'grid';
                    parentContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
                    parentContainer.style.gridGap = '20px'; // Adjust as needed
                    // Set the visibility detail to retain its original width
                    visibilityDetail.style.gridColumn = 'auto';
                    // Insert the weather description element
                    parentContainer.insertBefore(weatherDescriptionElement, visibilityDetail.nextSibling);
                    // Set the weather description to span full width
                    weatherDescriptionElement.style.gridColumn = '1 / span 4';
                } else {
                    // If visibility detail is not found, append the weatherDescription div to the end
                    weatherDetailsContainer.appendChild(weatherDescriptionElement);
                }

            }

            // Set dimensions for the 2D map div
            const mapElement = document.getElementById('twodmap');
            mapElement.style.width = '750px'; // Example width
            mapElement.style.height = '400px'; // Example height
            
            // Initialize the Leaflet map within the 2D map div
            const map = L.map(mapElement).setView([data.location.lat, data.location.lon], 10);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data © OpenStreetMap contributors'
            }).addTo(map);
            
            L.marker([data.location.lat, data.location.lon]).addTo(map);
            
            // Set dimensions for the 3D map div
            const map3dElement = document.getElementById('threedmap');
            map3dElement.style.width = '750px'; // Example width
            map3dElement.style.height = '400px'; // Example height
            
            // Set the Cesium ion access token before initializing Cesium APIs
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNGUyZWY1ZS03MzMxLTRkNGMtYjZjMC1lOWE1ZDM5MTBlOTIiLCJpZCI6MjA2NzY3LCJpYXQiOjE3MTIzMDkwMDZ9.JU-rRUMNfeztJ-UUQZEoZ2lMzXC_jhCqs77bEGCXsAk';

            // Initialize the Cesium 3D map within the 3D map div
            const viewer = new Cesium.Viewer('threedmap', {
                terrainProvider: Cesium.createWorldTerrain()
            });

            // Fly the camera to the specified position
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(data.location.lon, data.location.lat, 10000.0)
            });

            // Add the icon entity to the map
            viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(data.location.lon, data.location.lat),
                billboard: {
                    image: icons.position, // Check if this path or URL is correct
                    scale: 0.5,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                }
            });

            // Remember the current location and orientation when switching between map styles
            const homeCameraView = {
                destination: Cesium.Cartesian3.fromDegrees(data.location.lon, data.location.lat, 10000.0),
                orientation: {
                    heading: Cesium.Math.toRadians(0), // Adjust as needed
                    pitch: Cesium.Math.toRadians(-90), // Adjust as needed
                    roll: Cesium.Math.toRadians(0) // Adjust as needed
                }
            };

            // Set the home camera view for each map style
            viewer.homeButton.viewModel.command.beforeExecute.addEventListener((commandInfo) => {
                commandInfo.cancel = true;
                viewer.scene.camera.flyTo(homeCameraView);
            });

            const map2Ddetail = document.getElementById('twoDmapDetail');
            const map3Ddetail = document.getElementById('threeDmapDetail');

            // Event listener for both 2D map and detail button click
            [map2D, map2Ddetail].forEach(element => {
                element.addEventListener('click', function() {
                    isclicked = '2map';
                    console.log('Button clicked is', isclicked);
                    // Call the callmap function after the event listeners are set up
                    callmap(isclicked); 
                });
            });

            // Event listener for both 3D map and detail button click
            [map3D, map3Ddetail].forEach(element => {
                element.addEventListener('click', function() {
                    isclicked = '3map';
                    console.log('Button clicked is', isclicked);
                    // Call the callmap function after the event listeners are set up
                    callmap(isclicked); 
                });
            });


            // Call the callmap function after the event listeners are set up
            callmap(isclicked); 

            // Function to switch between 2D and 3D maps
            function callmap(maptype) {
                if (maptype === '2map') {
                    // Hide 3D map and show 2D map
                    document.getElementById('threedmap').style.display = 'none';
                    document.getElementById('twodmap').style.display = 'block';
                } else if (maptype === '3map') {
                    // Hide 2D map and show 3D map
                    document.getElementById('twodmap').style.display = 'none';
                    document.getElementById('threedmap').style.display = 'block';
                } else {
                    // By default, show the 2D map
                    document.getElementById('threedmap').style.display = 'none';
                    document.getElementById('twodmap').style.display = 'block';

                }
            }

            // Set the flex-basis of all .detail-info elements to 50% to make them span 2 columns
            const detailInfoElements = document.querySelectorAll('.detail-info');
            detailInfoElements.forEach(element => {
                element.style.flexBasis = '50%';
            });


        })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });

    }
 
    // Update weather every 12 hours
    setInterval(() => {
        getWeatherButton.click();
    }, 1000 * 60 * 60 * 12); // 12 hours in milliseconds


});

const page = document.getElementById('pageDescription');

function pageController() {
    // Remove the 'hidden' attribute from the 'page' element
    page.removeAttribute('hidden');
}

    // Show the page HTML by setting the body display property to 'block'
    // document.body.style.display = 'block';