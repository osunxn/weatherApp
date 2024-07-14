const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

// Create server application (port 3000)
const serverApp = express();
const serverPort = 5000;

// Middleware to parse JSON bodies
serverApp.use(bodyParser.json());

// Enable CORS
serverApp.use(cors());

// Function to save JSON data to a file
function saveJsonToFile(filename, data) {
    fs.writeFile(path.join(__dirname, filename), JSON.stringify(data, null, 2), err => {
        if (err) {
            console.error('Error saving JSON file:', err);
        } else {
            console.log(`JSON data saved to ${filename}`);
        }
    });
}

// Function to log errors to a file
function logErrorToFile(error) {
    const errorLog = `${new Date().toISOString()} - ${error.stack || error}\n\n`;
    fs.appendFile(path.join(__dirname, 'error.log'), errorLog, err => {
        if (err) {
            console.error('Error logging to file:', err);
        }
    });
}

// Create Express applications for each function
const weatherApp = express();
const userLocationApp = express();
const readJsonFileApp = express();
const cesiumApp = express();
const getActualKeyApp = express();

// Weather endpoint
weatherApp.get('/', (req, res) => {
    console.log('Weather endpoint hit');
    const city = req.query.city;
    const apiKey = '9d25421f1b894a7abb8225858240204'; // Your weather API key
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&alerts=no`;

    axios.get(apiUrl)
        .then(response => {
            const data = response.data;
            saveJsonToFile('weather.json', data); // Save weather data to weather.json
            res.json(data);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error fetching weather data' });
            logErrorToFile(error);
        });
});

// User location endpoint
userLocationApp.get('/', (req, res) => {
    console.log('User location endpoint hit');
    // const apiKey = '0a592ebb2449d59c84ef89c06b60ecdc122d2aa12a2777aff6393503';
    // const apiUrl = `https://api.ipdata.co?api-key=${apiKey}`;
    const apiUrl = 'https://ipapi.co/json/';

    axios.get(apiUrl)
        .then(response => {
            const data = response.data;
            saveJsonToFile('location.json', data); // Save location data to location.json
            res.json(data);
        })
        .catch(error => {
            res.status(500).json({ error: 'Error fetching user location' });
            logErrorToFile(error);
        });
});

// Read JSON file endpoint (changed to accept GET requests)
readJsonFileApp.get('/', (req, res) => {
    console.log('\nRead JSON file endpoint hit');
    try {
        const { filename, content } = req.query; // Use req.query to get parameters from query string

        // Construct file path
        const filePath = path.join(__dirname, `${filename}.json`);

        // Read JSON file synchronously
        const jsonData = fs.readFileSync(filePath);

        // Parse JSON data
        const parsedData = JSON.parse(jsonData);

        // Extract requested content
        let result = parsedData;
        for (const key of content) {
            if (result.hasOwnProperty(key)) {
                result = result[key];
            } else {
                return res.status(404).send('Requested content not found');
            }
        }

        // Check if the result is an object, if so, return the value of the last property
        if (typeof result === 'object') {
            const keys = Object.keys(result);
            const lastKey = keys[keys.length - 1];
            result = result[lastKey];
        }

        return res.send(result);
    } catch (error) {
        logErrorToFile(error);
        return res.status(500).send('Error reading JSON file');
    }
});

// Initialize a flag to track the state (first or second call)
let state = 'first';

// Endpoint to send the function string to the client
cesiumApp.get('/', (req, res) => {
    const serverUrl = 'http://localhost:5000';
    // Modified functionString to include the new logic
    const functionString = `
        function interceptConsoleLog(actualCesiumApiKey, protectedKey) {
            // Override console.log temporarily
            const originalLog = console.log;
            console.log = function(...args) {
                for (const arg of args) {
                    if (typeof arg === 'string' && arg.includes(actualCesiumApiKey)) {
                        originalLog('Cesium API Key:', protectedKey);
                        return;
                    }
                }
                originalLog.apply(console, args);
            };
        }

        async function setCesiumApiKey() {
            try {
                // Fetch the actual API key from the server using axios
                const response = await axios.get(\`${serverUrl}/getActualApiKey\`);
                const actualCesiumApiKey = response.data.apiKey;
                interceptConsoleLog(actualCesiumApiKey, '### REQUEST CONTAIN NO LOG ###');
                return actualCesiumApiKey; // Return the fetched API key
            } catch (error) {
                console.error('Error fetching API key:', error);
                return null; // Return null if there's an error
            }
        }
        
        

        // Execute the function to set the Cesium API key
        setCesiumApiKey();
    `;

    console.log(functionString);
    
    // Send the function string to the client
    res.status(200).send(functionString);
});




// Endpoint to send the actual API key to the client
getActualKeyApp.get('/', (req, res) => {
    console.log('Get actual API key endpoint hit');
    const cesiumApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNGUyZWY1ZS03MzMxLTRkNGMtYjZjMC1lOWE1ZDM5MTBlOTIiLCJpZCI6MjA2NzY3LCJpYXQiOjE3MTIzMDkwMDZ9.JU-rRUMNfeztJ-UUQZEoZ2lMzXC_jhCqs77bEGCXsAk';
    res.status(200).json({ apiKey: cesiumApiKey });
});


// Additional route to handle root path ("/")
serverApp.get('/', (req, res) => {
    const requestData = {
        method: req.method + '\n',
        url: req.url + '\n',
        headers: req.headers,
        query: req.query,
        params: req.params,
        body: req.body // Only available for POST, PUT, and PATCH requests
    };

    // Convert the requestData object to a JSON string with two spaces indentation
    const responseData = JSON.stringify({ message: 'Server is running on port 3000', requestData }, null, 2);

    // Send the response
    res.set('Content-Type', 'application/json').send(responseData + '\n');
});

// Mount the Express applications at different paths
serverApp.use('/weather', weatherApp);
serverApp.use('/userlocation', userLocationApp);
serverApp.use('/readJsonFile', readJsonFileApp);
serverApp.use('/cesiumMap', cesiumApp);
serverApp.use('/getActualApiKey', getActualKeyApp);

// Start the server application
serverApp.listen(serverPort, () => {
    console.log(`Server is running on http://localhost:${serverPort}`);
});



const app = express();
const port = 3000;

// Serve HTML files from the public/html directory
app.use(express.static(path.join(__dirname, '..', 'public', '..', 'html')));

// Serve CSS files from the public/styling directory
app.use('/css', express.static(path.join(__dirname, '..', 'public', '..', 'styling')));

// Serve JavaScript files from the public/javascript directory
app.use('/js', express.static(path.join(__dirname, '..', 'public', '..', 'javascript')));

// Serve image files from the public/assets directory
app.use('/assets', express.static(path.join(__dirname, '..', 'public', '..', 'assets')));

// Handle root path ("/")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'html', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});