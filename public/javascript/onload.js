// Function to show the section corresponding to the hash
function showSectionFromHash() {
    const hash = window.location.hash;
    const sectionId = hash.substring(1);
    const page = document.getElementById('pagePg');

    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the section corresponding to the hash
    if (sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
        }
    }

    // Assuming the URL to your server.js API endpoint
    const serverUrl = 'http://localhost:5000';

    let filename = 'weather';
    let content = ['current', 'condition', 'text'];
    
    axios.get(`${serverUrl}/readJsonFile`, { params: { filename, content } })
        .then(response => {
            let weatherConditionText = response.data;
            console.log(weatherConditionText); // Output: example "Partly cloudy"
            setBackground(weatherConditionText, page);
        })
        .catch(error => {
            // If a 404 error occurs, call getUserLocation and then recall the axios request
            if (error.response && error.response.status === 404) {
                axios.get(`${serverUrl}/userlocation`)
                .then(response => {
                    const data = response.data;
                                    // Make a GET request to the server API endpoint with the city as a query parameter
                    axios.get(`${serverUrl}/weather?city=${data.city}`)
                    .then(response => {
                        // Extract the data from the response object
                        const data = response.data;
                        setBackground(data.current.condition.text, page);
                    })
                    .catch(error => {
                        // Log an error message if the request fails
                        console.error('Error fetching weather data:', error);
                    });
                })
                .catch(error => {
                    console.error('Error fetching location data:', error);
                });
                
            } else {
                console.error('Error fetching JSON content:', error);
            }
        });
}



// Call the function when the page loads, only if the active page is page.html
window.addEventListener('load', () => {
    if (window.location.pathname.includes('page.html')) {
        showSectionFromHash();
    }
});

// Call the function when the hash changes
window.addEventListener('hashchange', showSectionFromHash);