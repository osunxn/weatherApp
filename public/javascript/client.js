let noLocationData = true; // Set location data tracker to regulate getUserLocation

// Import Axios library if not already imported
// You can import it using a script tag in HTML or import it if you're using a module bundler like Webpack
// import axios from 'axios';

const descriptionPage = document.getElementById('pageDescription');
const features = document.querySelector('.features-container');
const errorDiv = document.getElementById('error');
const onlandDiv = document.getElementById('onland');
const featuresDiv = document.getElementById('features');


function pageController(one, two) {

    if (one === "yes") {
        // Remove the 'hidden' attribute from the 'page' element
        descriptionPage.removeAttribute('hidden');
        onlandDiv.hidden = false;
        errorDiv.innerHTML = '';
        errorDiv.style.width = '0px';
        errorDiv.style.height = '0px';
        features.hidden = true;
    }  else if (two === "yes") {
        // Remove the 'hidden' attribute from the 'page' element
        descriptionPage.hidden = true;
        onlandDiv.hidden = true;
        errorDiv.hidden = false;
        features.hidden = false;
    }
}

function getUserLocation() {
    // Assuming the URL to your server.js API endpoint
    const serverUrl = 'http://localhost:5000';

    // Return a promise to handle the asynchronous operation
    // return new Promise((resolve, reject) => {
        axios.get(`${serverUrl}/userlocation`)
            .then(response => {
                const data = response.data;

                // Extract location data from the response
                const city = data.city;
                const country = data.country_name;
                const latitude = data.latitude;
                const longitude = data.longitude;

                console.log('City:', city);
                console.log('Country:', country);
                console.log('Latitude:', latitude);
                console.log('Longitude:', longitude);

                // Resolve the promise with the location data
                //resolve({ city, country, latitude, longitude });
            })
            .catch(error => {
                console.error('Error fetching location data:', error);
                // Reject the promise if there's an error
                //reject(error);
            });
    //});
}


document.addEventListener('DOMContentLoaded', function() {
    const page = document.querySelector('.page');
    const getWeatherButton = document.getElementById('get-weather');
    const celsiusToggle = document.getElementById('celsius');
    const fahrenheitToggle = document.getElementById('fahrenheit');
    const kilometers = document.getElementById('km');
    const miles = document.getElementById('mile');
    const milePerHour = document.getElementById('m/h');
    const kilometersPerHour = document.getElementById('km/h');
    const miloMeter = document.getElementById('mm');
    const inches = document.getElementById('in');
    const millibar = document.getElementById('mb');
    const inHg = document.getElementById('inHg');
    const map2D = document.getElementById('2Dmap');
    const map3D = document.getElementById('3Dmap');
    let isCelsius = true;
    let isKm = true;
    let isMph = true;
    let isMm = true;
    let isMb = true;
    let city = null;
    let isclicked = 'none'; // Flag to track the current degrees
    let initialCity = '';
    const serverUrl = 'http://localhost:5000';
    // Define the filename and content for reading JSON file
    let filename = 'location';
    let content = ['city'];
    
    // Initialize the function to set the landingPage to the info to user location
    if (noLocationData == true) {
        getUserLocation();

    // Make a request to read the JSON file for initial city
    axios.get(`${serverUrl}/readJsonFile`, { params: { filename, content } })
        .then(response => {
            // Extract the initial city from the response data
            initialCity = response.data;
            console.log('City name form location.json:', initialCity);
            noLocationData = false;
            handleGetWeather(initialCity);
        })
        .catch(error => {
            console.error('Error fetching JSON content:', error);
        });
    
    } else {

        // Make a request to read the JSON file for initial city
        axios.get(`${serverUrl}/readJsonFile`, { params: { filename, content } })
            .then(response => {
                // Extract the initial city from the response data
              initialCity = response.data;
              console.log('City name form location.json:', initialCity, 'call made cause noLocationData == false');
              // Call handleGetWeather with the initial city
              handleGetWeather(initialCity);
            })
            .catch(error => {
                console.error('Error fetching JSON content:', error);
            });
    }  
    
    // Function to toggle between Celsius and Fahrenheit
    function toggleTemperatureUnit() {
        // Toggle the temperature unit flag
        isCelsius = !isCelsius;

        // Update temperature display for current weather
        const currentTemperatureElement = document.querySelector('.hour-temperature');
        const currentTemperature = parseFloat(currentTemperatureElement.textContent);
        const updatedTemperature = convertTemperature(currentTemperature, isCelsius);
        currentTemperatureElement.textContent = updatedTemperature.toFixed(2) + (isCelsius ? "°C" : "°F");

        // Update temperature display for next 12 hours
        const hourTemperatureElements = document.querySelectorAll('.hour-info .hour-temperature');
        hourTemperatureElements.forEach(element => {
            const temperature = parseFloat(element.textContent);
            const updatedTemperature = convertTemperature(temperature, isCelsius);
            element.textContent = updatedTemperature.toFixed(2) + (isCelsius ? "°C" : "°F");
        });
    }

    // Function to convert temperature based on current unit
    function convertTemperature(temperature, isCelsius) {
        return isCelsius ? convertToCelsius(temperature) : convertToFahrenheit(temperature);
    }

    // Function to convert Celsius to Fahrenheit
    function convertToFahrenheit(celsius) {
        return (celsius * 9 / 5) + 32;
    }

    // Function to convert Fahrenheit to Celsius
    function convertToCelsius(fahrenheit) {
        return (fahrenheit - 32) * 5 / 9;
    }

    // Event listeners for toggle buttons
    celsiusToggle.addEventListener('click', function() {
        if (!isCelsius) {
            toggleTemperatureUnit();
        }
    });

    fahrenheitToggle.addEventListener('click', function() {
        if (isCelsius) {
            toggleTemperatureUnit();
        }
    });


    // Function to update active unit
    function setActiveUnit(container, activeId) {
        container.querySelectorAll('span').forEach(span => {
            span.classList.remove('active');
        });
        document.getElementById(activeId).classList.add('active');
    }


    getWeatherButton.addEventListener('click', getWeather);
    
    function getWeather() {
        city = document.getElementById('city').value;
        if (city) {
            handleGetWeather(city);
            pageController("yes", "no");
        } 
    }

    document.addEventListener('keydown', function(event) {
        const city = document.getElementById('city').value.trim(); // Trim whitespace
        if (event.key === 'Enter' && city) {
            handleGetWeather(city);
            pageController("yes", "no");
        }
    });

    // Event listener for the View Features button
    const viewFeaturesBtn = document.getElementById('viewFeaturesBtn');

    // Function to show or hide videos
    function toggleVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.hidden = !video.hidden;
            
            if (video.hidden) {
                video.pause(); // Pause the video if it's hidden
            } else {
                video.play(); // Play the video if it's shown
            }
        });

        // Change button text based on video visibility
        const buttonText = viewFeaturesBtn.textContent;
        if (buttonText === 'View Features') {
            viewFeaturesBtn.textContent = 'Hide Features';
        } else {
            viewFeaturesBtn.textContent = 'View Features';
        }
    }
    

    viewFeaturesBtn.addEventListener('click', toggleVideos);

    // Function to get the weather data for the current city
    function handleGetWeather(city) {
        // Define the URL of the server API endpoint
        const serverUrl = 'http://localhost:5000';
        
        // Make a GET request to the server API endpoint with the city as a query parameter
        axios.get(`${serverUrl}/weather?city=${city}`)
            .then(response => {
                // Extract the data from the response object
                const data = response.data;
                
                // Call the function to update the weather display with the received data
                updateWeatherDisplay(data);
                setBackground(data.current.condition.text, page);
            })
            .catch(error => {
                // Log an error message if the request fails
                if (error.response && error.response.status === 500) {
                    // Apply styles to the errorDiv
                    errorDiv.style.position = 'relative';
                    errorDiv.style.width = '50%';
                    errorDiv.style.height = '470px';
                    errorDiv.style.margin = '5% 0px 5% 27%';
                    errorDiv.style.alignItems = 'center';
                    errorDiv.style.justifyContent = 'center';
                    errorDiv.style.top = '0';
                    errorDiv.style.left = '0';
                    errorDiv.style.backgroundColor = 'transparent'; // Adjust if needed
                    //errorDiv.style.zIndex = '1000'; // Ensure it appears above other content

                    // Insert the SVG content into the errorDiv
                    errorDiv.innerHTML = brokenLocationSvg;
                    pageController("no", "yes");

                } else {
                    console.error('Error fetching weather data:', error);
                }
            });
    }

function updateWeatherDisplay(data) {
            // Update current weather information
            const todayWeatherInfo = document.querySelector('.today-weather-info');
            const currentWeather = data.current;
            const todayDate = new Date().toDateString();
            const temperature = isCelsius ? currentWeather.temp_c : currentWeather.temp_f;
            const temperatureUnit = isCelsius ? "°C" : "°F";

            todayWeatherInfo.querySelector('.hour-temperature').textContent = `${temperature}${temperatureUnit}`;
            todayWeatherInfo.querySelector('.hour-icon').src = currentWeather.condition.icon;
            todayWeatherInfo.querySelector('.location-name').textContent = data.location.name + ',';
            todayWeatherInfo.querySelector('.location-region');
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

// Functions to update the forecast display
function updateForecastDisplay() {
    const forecastData = data.forecast.forecastday[0].day;
    const forecastDayContainer = document.getElementById('forecastInfo');

    // Determine units based on flags
    const tempUnit = isCelsius ? '°C' : '°F';
    const distanceUnit = isKm ? 'km' : 'mile';
    const speedUnit = isMph ? 'm/h' : 'km/h';
    const precipUnit = isMm ? 'mm' : 'in';

    // Array of forecast details
    const forecastDetails = [
        { title: 'Max Temp', info: isCelsius ? forecastData.maxtemp_c : forecastData.maxtemp_f, icon: img.maxTemp, unit: tempUnit },
        { title: 'Min Temp', info: isCelsius ? forecastData.mintemp_c : forecastData.mintemp_f, icon: img.minTemp, unit: tempUnit },
        { title: 'Average Temp', info: isCelsius ? forecastData.avgtemp_c : forecastData.avgtemp_f, icon: img.averageTemp, unit: tempUnit },
        { title: 'Max Wind', info: isMph ? forecastData.maxwind_mph : forecastData.maxwind_kph, icon: img.maxWind, unit: speedUnit },
        { title: 'Total Precipitation', info: isMm ? forecastData.totalprecip_mm : forecastData.totalprecip_in, icon: img.totalPrecipitation, unit: precipUnit },
        { title: 'Total Snow', info: forecastData.totalsnow_cm, icon: img.totalSnow, unit: 'cm' },
        { title: 'Average Visibility', info: isKm ? forecastData.avgvis_km : forecastData.avgvis_miles, icon: img.averageVisibility, unit: distanceUnit },
        { title: 'Average Humidity', info: forecastData.avghumidity, icon: img.averageHumidity, unit: '%' },
        { title: 'Condition', info: forecastData.condition.text, icon: forecastData.condition.icon, unit: '' }
    ];

    if (forecastDayContainer) {
        forecastDayContainer.innerHTML = ''; // Clear existing forecast data

            // Loop through each forecast detail and append it to the container
            forecastDetails.forEach(detail => {
                const detailElement = document.createElement('div');
                detailElement.classList.add('forecast-detail');
                detailElement.innerHTML = `
                    <h5>${detail.title}</h5>
                    <h5>${detail.info} ${detail.unit}</h5>
                    <img class="forecastImg" src="${detail.icon}" alt="${detail.title} Icon">
                `;
                forecastDayContainer.appendChild(detailElement);
            });
        } else {
            console.error('Element with ID "forecastInfo" not found.');
        }
    }

    // Event listeners for unit conversion toggles
    celsiusToggle.addEventListener('click', () => {
        isCelsius = true;
        setActiveUnit(temperatureToggle, 'celsius');
        updateForecastDisplay();
    });

    fahrenheitToggle.addEventListener('click', () => {
        isCelsius = false;
        setActiveUnit(temperatureToggle, 'fahrenheit');
        updateForecastDisplay();
    });

    kilometers.addEventListener('click', () => {
        isKm = true;
        setActiveUnit(document.querySelector('.kmNmile'), 'km');
        updateForecastDisplay();
    });

    miles.addEventListener('click', () => {
        isKm = false;
        setActiveUnit(document.querySelector('.kmNmile'), 'mile');
        updateForecastDisplay();
    });

    milePerHour.addEventListener('click', () => {
        isMph = true;
        setActiveUnit(document.querySelector('.mphNkph'), 'm/h');
        updateForecastDisplay();
    });

    kilometersPerHour.addEventListener('click', () => {
        isMph = false;
        setActiveUnit(document.querySelector('.mphNkph'), 'km/h');
        updateForecastDisplay();
    });

    miloMeter.addEventListener('click', () => {
        isMm = true;
        setActiveUnit(document.querySelector('.mmNin'), 'mm');
        updateForecastDisplay();
    });

    inches.addEventListener('click', () => {
        isMm = false;
        setActiveUnit(document.querySelector('.mmNin'), 'in');
        updateForecastDisplay();
    });

    // Initial call to display the forecast
    updateForecastDisplay();


 
       // Add weather details
            const weatherDetailsContainer = document.querySelector('.weather-details');
            weatherDetailsContainer.innerHTML = ''; // Clear existing weather details

                      
        // Extracting the pieces of information
        const weatherDetails = [
            { title: 'Sunrise', info: data.forecast.forecastday[0].astro.sunrise, icon: icons.sunrise },
            { title: 'Sunset', info: data.forecast.forecastday[0].astro.sunset, icon: icons.sunset },
            { title: 'Precipitation', info: `${data.current.precip_mm} mm, ${data.current.precip_in} in`, icon: icons.precipitation, defaultUnit: 'mm' },
            { title: 'Humidity', info: `${data.current.humidity}%`, icon: icons.humidity },
            { title: 'Wind', info: `${data.current.wind_kph} km/h, ${data.current.wind_mph} m/h ${data.current.wind_dir}`, icon: icons.wind, defaultUnit: 'kph' },
            { title: 'Pressure', info: `${data.current.pressure_mb} mb, ${data.current.pressure_in} in`, icon: icons.pressure, defaultUnit: 'mb' },
            { title: 'Feels Like', info: `${data.current.feelslike_c}°C, ${data.current.feelslike_f}°F`, icon: icons.feelsLike, defaultUnit: 'C' },
            { title: 'Visibility', info: `${data.current.vis_km} km, ${data.current.vis_miles} miles`, icon: icons.visibility, defaultUnit: 'km' },
            { title: 'Weather Description', info: data.current.condition.text, icon: currentHourData.condition.icon },
            { title: 'UV Index', info: data.current.uv, icon: icons.uvIndex },
            { title: 'Cloud Cover', info: `${data.current.cloud}%`, icon: icons.cloudCover },
            { title: 'Moonrise', info: data.forecast.forecastday[0].astro.moonrise, icon: icons.moonrise },
            { title: 'Moonset', info: data.forecast.forecastday[0].astro.moonset, icon: icons.moonset },
            { title: 'Will it Rain', info: data.forecast.forecastday[0].day.daily_will_it_rain ? 'Yes' : 'No', icon: icons.rain },
            { title: 'Chance of Rain', info: `${data.forecast.forecastday[0].day.daily_chance_of_rain}%`, icon: icons.chanceOfRain },
            { title: 'Will it Snow', info: data.forecast.forecastday[0].day.daily_will_it_snow ? 'Yes' : 'No', icon: icons.snow },
            { title: 'Chance of Snow', info: `${data.forecast.forecastday[0].day.daily_chance_of_snow}%`, icon: icons.chanceOfSnow }
        ];

        // Function to toggle detail info based on the clicked element
        const toggleDetailInfo = (detail, detailInfoElement) => {
            if (typeof detail.info !== 'string' || !detail.info.includes(',')) return;

            const [primaryInfo, secondaryInfo] = detail.info.split(', ');
            const currentText = detailInfoElement.textContent.trim();

            if (currentText === primaryInfo) {
                detailInfoElement.textContent = secondaryInfo;
            } else {
                detailInfoElement.textContent = primaryInfo;
            }
        };

        // Function to update detail info based on unit flags
        const updateDetailInfo = (detail) => {
            const detailsTitles = document.querySelectorAll('.detailsTitle');
            let detailInfoElement;

            // Find the correct detail element
            detailsTitles.forEach(titleElement => {
                if (titleElement.textContent === detail.title) {
                    detailInfoElement = titleElement.nextElementSibling.querySelector('.detailinfo');
                }
            });

            if (!detailInfoElement) return; // If detail element is not found, exit

            // Update detail info based on unit flags
            if (detail.title === 'Wind') {
                detailInfoElement.textContent = isMph ? `${detail.info.split(', ')[1]}` : `${detail.info.split(', ')[0]} ${data.current.wind_dir}`;
            } else if (detail.title === 'Visibility') {
                detailInfoElement.textContent = isKm ? `${detail.info.split(', ')[0]}` : `${detail.info.split(', ')[1]}`;
            } else if (detail.title === 'Precipitation') {
                detailInfoElement.textContent = isMm ? `${detail.info.split(', ')[0]}` : `${detail.info.split(', ')[1]}`;
            } else if (detail.title === 'Pressure') {
                detailInfoElement.textContent = isMb ? `${detail.info.split(', ')[0]}` : `${detail.info.split(', ')[1]}`;
            } else if (detail.title === 'Feels Like') {
                detailInfoElement.textContent = isCelsius ? `${detail.info.split(', ')[0]}` : `${detail.info.split(', ')[1]}`;
            }
        };

        // Loop through each weather detail and update HTML elements
        weatherDetails.forEach(detail => {
            if (detail.title !== 'Weather Description') {
                // Create HTML elements for other weather details
                const detailElement = document.createElement('div');
                detailElement.classList.add('detail-info');
                
                const detailInfoElement = document.createElement('h5');
                detailInfoElement.classList.add('detailinfo');

                // Use default unit based on the flags
                if (typeof detail.info === 'string' && detail.info.includes(',')) {
                    const [primaryInfo, secondaryInfo] = detail.info.split(', ');
                    if (detail.title === 'Wind') {
                        detailInfoElement.textContent = isMph ? secondaryInfo : primaryInfo;
                    } else if (detail.title === 'Visibility') {
                        detailInfoElement.textContent = isKm ? primaryInfo : secondaryInfo;
                    } else if (detail.title === 'Precipitation') {
                        detailInfoElement.textContent = isMm ? primaryInfo : secondaryInfo;
                    } else if (detail.title === 'Pressure') {
                        detailInfoElement.textContent = isMb ? primaryInfo : secondaryInfo;
                    } else if (detail.title === 'Feels Like') {
                        detailInfoElement.textContent = isCelsius ? primaryInfo : secondaryInfo;
                    } else {
                        detailInfoElement.textContent = primaryInfo;
                    }
                } else {
                    // If info is not a string or doesn't include a comma, use it directly
                    detailInfoElement.textContent = detail.info;
                }

                detailElement.innerHTML = `
                    <p class="detailsTitle">${detail.title}</p>
                    <div class="detail-content">
                        ${detailInfoElement.outerHTML}
                        <span class="material-symbols-outlined">${detail.icon}</span>
                    </div>
                `;

                // <img class="detailImg" src="${detail.icon}" alt="Detail Icon">

                // Append the detail to weatherDetailsContainer
                weatherDetailsContainer.appendChild(detailElement);

                // Add event listener to toggle units on click
                detailElement.addEventListener('click', () => toggleDetailInfo(detail, detailElement.querySelector('.detailinfo')));
            }
        });
        // Event listeners for unit toggle buttons
        celsiusToggle.addEventListener('click', () => {
            isCelsius = true;
            weatherDetails.forEach(detail => {
                if (detail.title === 'Feels Like') {
                    updateDetailInfo(detail, 'isCelsius');
                }
            });
        });

        fahrenheitToggle.addEventListener('click', () => {
            isCelsius = false;
            weatherDetails.forEach(detail => {
                if (detail.title === 'Feels Like') {
                    updateDetailInfo(detail, 'isCelsius');
                }
            });
        });

        kilometersPerHour.addEventListener('click', () => {
            isMph = false;
            weatherDetails.forEach(detail => {
                if (detail.title === 'Wind') {
                    updateDetailInfo(detail, 'isMph');
                }
            });
        });

        milePerHour.addEventListener('click', () => {
            isMph = true;
            weatherDetails.forEach(detail => {
                if (detail.title === 'Wind') {
                    updateDetailInfo(detail, 'isMph');
                }
            });
        });

        kilometers.addEventListener('click', () => {
            isKm = true;
            weatherDetails.forEach(detail => {
                if (detail.title === 'Visibility') {
                    updateDetailInfo(detail, 'isKm');
                }
            });
        });

        miles.addEventListener('click', () => {
            isKm = false;
            weatherDetails.forEach(detail => {
                if (detail.title === 'Visibility') {
                    updateDetailInfo(detail, 'isKm');
                }
            });
        });

        miloMeter.addEventListener('click', () => {
            isMm = true;
            weatherDetails.forEach(detail => {
                if (detail.title === 'Precipitation') {
                    updateDetailInfo(detail, 'isMm');
                }
            });
        });

        inches.addEventListener('click', () => {
            isMm = false;
            weatherDetails.forEach(detail => {
                if (detail.title === 'Precipitation') {
                    updateDetailInfo(detail, 'isMm');
                }
            });
        });

        millibar.addEventListener('click', () => {
            isMb = true;
            weatherDetails.forEach(detail => {
                if (detail.title === 'Pressure') {
                    updateDetailInfo(detail, 'isMb');
                }
            });
        });

        inHg.addEventListener('click', () => {
            isMb = false;
            weatherDetails.forEach(detail => {
                if (detail.title === 'Pressure') {
                    updateDetailInfo(detail, 'isMb');
                }
            });
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
                    <div class="locationname">
                        <h4 class="location-name">${data.location.name}</h4>
                        <h4 class="location-region"></h4>
                        <h4 class="location-country">${data.location.country}</h4>
                    </div>
                    <div class="toggletwo">
                        <span id="threeDmapDetail" class="active">3D</span>
                        <span id="twoDmapDetail" class="active">2D</span>
                    </div>
                    <div class="boxsizingmain">
                        <h4 class="titleName">${weatherDescription.info}</h4>
                        <img class="hour-iconweather" src="${weatherDescription.icon}" alt="Weather Icon">
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

        // Set dimensions for the map div
        const mapElement = document.getElementById('twodmap');
        mapElement.style.width = '750px'; // Example width
        mapElement.style.height = '400px'; // Example height
        
        // Weatherapi may goes here
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
 
        
// Function to get the weather data for the current city
function cesiumMap() {
    // Define the URL of the server API endpoint
    const serverUrl = 'http://localhost:5000';

    axios.get(`${serverUrl}/cesiumMap`)
    .then(response => {
        // Execute the code as a function
        const dynamicFunction = new Function(response.data);
        console.log("Dynamic function:", dynamicFunction);
        
        // Execute the dynamically created function
        const apiKey = dynamicFunction(); // Execute the function directly
        
        // Check if apiKey is defined
        if (apiKey) {
            // Set Cesium.Ion.defaultAccessToken to the apiKey
            Cesium.Ion.defaultAccessToken = apiKey;
            initializeCesiumMap();
            console.log("api key is ", Cesium.Ion.defaultAccessToken);
        } else {
            console.error("Received undefined API key from the dynamic function.");
        }
    })
    .catch(error => {
        console.error('Error fetching function:', error);
    });
}




// Function to initialize the Cesium map
function initializeCesiumMap() {
    // Define the initial camera position
    const initialCameraPosition = Cesium.Cartesian3.fromDegrees(data.location.lon, data.location.lat, 10000.0);
    const homeCameraView = {
        destination: initialCameraPosition,
        orientation: {
            heading: Cesium.Math.toRadians(0), // Adjust as needed
            pitch: Cesium.Math.toRadians(-90), // Adjust as needed
            roll: Cesium.Math.toRadians(0) // Adjust as needed
        }
    };

    // Initialize the Cesium 3D map within the 3D map div
    const viewer = new Cesium.Viewer('threedmap', {
        terrainProvider: Cesium.createWorldTerrain(),
        animation: false,  // Disable animation control
        baseLayerPicker: true,  // Enable base layer picker
        fullscreenButton: false,  // Disable fullscreen button
        vrButton: false,  // Disable VR button
        geocoder: false,  // Disable geocoder
        homeButton: false,  // Disable home button
        infoBox: false,  // Disable info box
        sceneModePicker: true,  // Enable scene mode picker
        selectionIndicator: false,  // Disable selection indicator
        timeline: false,  // Disable timeline
        navigationHelpButton: false,  // Disable navigation help button
        navigationInstructionsInitiallyVisible: false  // Hide navigation instructions initially
    });

    // Fly the camera to the specified position
    viewer.camera.flyTo({
        destination: initialCameraPosition
    });

    // Create a new HTML element for the icon
    const iconElement = document.createElement('div');
    iconElement.innerHTML = `<img src="${icons.position}" width="48" height="48">`; // Adjust width and height as needed
    iconElement.style.position = 'absolute';
    iconElement.style.pointerEvents = 'none'; // Prevent the HTML element from capturing mouse events
    iconElement.style.zIndex = '100'; // Ensure the HTML element is rendered above the map
    iconElement.style.visibility = 'hidden'; // Initially hide the HTML element
    iconElement.style.transition = 'visibility 0.001s, left 0.001s, top 0.001s'; // Faster transition for smoother movement

    // Position the HTML element over the map at the specified location
    const position = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(data.location.lon, data.location.lat),
        billboard: {
            show: false // Hide the billboard to prevent it from being displayed
        }
    });

    // Add the HTML element to the map container
    const mapContainer = viewer.canvas.parentElement;
    mapContainer.appendChild(iconElement);

    // Function to update the position and visibility of the HTML element
    function updateIconPosition() {
        const canvasPosition = viewer.scene.cartesianToCanvasCoordinates(position.position.getValue(viewer.clock.currentTime));
        if (Cesium.defined(canvasPosition)) {
            iconElement.style.left = `${canvasPosition.x - iconElement.offsetWidth / 2}px`; // Adjust position for center alignment
            iconElement.style.top = `${canvasPosition.y - iconElement.offsetHeight}px`; // Adjust position for bottom alignment
            iconElement.style.visibility = 'visible'; // Show the HTML element if it's within the view
        } else {
            iconElement.style.visibility = 'hidden'; // Hide the HTML element if it's out of view
        }
    }

    // Update the position and visibility of the HTML element when the camera or map view changes
    viewer.scene.preRender.addEventListener(() => {
        updateIconPosition();
    });

    // Update the position and visibility when the window is resized
    window.addEventListener('resize', () => {
        updateIconPosition();
    });

    // Filter out problematic imagery layers
    const excludedLayers = ['Sentinel-2', 'Blue Marble', 'Earth at night', 'Stamen Toner', 'Stamen Watercolor', 'ESRI World Street Map'];
    const filteredImageryProviders = viewer.baseLayerPicker.viewModel.imageryProviderViewModels.filter(viewModel => {
        return !excludedLayers.includes(viewModel.name);
    });
    viewer.baseLayerPicker.viewModel.imageryProviderViewModels = filteredImageryProviders;

    // Add event listener to base layer picker if it's defined
    if (viewer.baseLayerPicker && viewer.baseLayerPicker.viewModel) {
        const selectedImageryProviderViewModelChanged = viewer.baseLayerPicker.viewModel.selectedImageryProviderViewModelChanged;
        if (selectedImageryProviderViewModelChanged) {
            selectedImageryProviderViewModelChanged.addEventListener(function() {
                // Fly the camera to the initial position when a new base layer is selected
                viewer.camera.flyTo({
                    destination: initialCameraPosition,
                    orientation: homeCameraView.orientation
                });
            });
        }
    } else {
        console.error("Base layer picker or its view model is not available.");
    }
}

        cesiumMap();


        // Function to get the weather data for the current city
function securitycheck() {
    // Define the URL of the server API endpoint
    const serverUrl = 'http://localhost:5000';

    axios.get(`${serverUrl}/getActualApiKey`)
    .then(response => {
        // Execute the code as a function
        console.log('haha the key is:', response.data);

    })
    .catch(error => {
        console.error('Error fetching function:', error);
    });
}

securitycheck();

        const map2Ddetail = document.getElementById('twoDmapDetail');
        const map3Ddetail = document.getElementById('threeDmapDetail');

        // Function to switch between 2D and 3D maps
        function callmap() {
            if (isclicked === '2map') {
                // Hide 3D map and show 2D map
                document.getElementById('threedmap').style.display = 'none';
                document.getElementById('twodmap').style.display = 'block';
            } else if (isclicked === '3map') {
                // Hide 2D map and show 3D map
                document.getElementById('twodmap').style.display = 'none';
                document.getElementById('threedmap').style.display = 'block';
            } else {
                // By default, show the 2D map
                document.getElementById('threedmap').style.display = 'none';
                document.getElementById('twodmap').style.display = 'block';

            }
        }
    

        // Event listener for the 2D map button click
        map2D.addEventListener('click', function() {
            isclicked = '2map';
            // Call the callmap function after the event listeners are set up
            callmap(); 
        });

        // Event listener for the 3D map button click
        map3D.addEventListener('click', function() {
            isclicked = '3map';
            // Call the callmap function after the event listeners are set up
            callmap(); 
        });


        // Event listener for both 2D map and detail button click
        [map2D, map2Ddetail].forEach(element => {
            element.addEventListener('click', function() {
                isclicked = '2map';
                console.log('Button clicked is', isclicked);
                // Call the callmap function after the event listeners are set up
                callmap(); 
            });
        });

        // Event listener for both 3D map and detail button click
        [map3D, map3Ddetail].forEach(element => {
            element.addEventListener('click', function() {
                isclicked = '3map';
                console.log('Button clicked is', isclicked);
                // Call the callmap function after the event listeners are set up
                callmap(); 
            });
        });


        // Call the callmap function after the event listeners are set up
        callmap(); 

        // Set the flex-basis of all .detail-info elements to 50% to make them span 2 columns
        const detailInfoElements = document.querySelectorAll('.detail-info');
        detailInfoElements.forEach(element => {
            element.style.flexBasis = '50%';
        });
        
    }

    // Update weather every 12 hours
    setInterval(() => {
        getWeatherButton.click();
    }, 1000 * 60 * 60 * 12); // 12 hours in milliseconds

});