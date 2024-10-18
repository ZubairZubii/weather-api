document.getElementById("search-button").addEventListener("click", function() {
    const city = document.getElementById("city-input").value;
    if (city) {
        getWeatherData(city);
        getForecastData(city);
    }
});


// API Keys
const weatherApiKey = "3262aec225a0be7d86e0bc7c03d2bc85"; // OpenWeatherMap API Key
const geminiApiKey = "AIzaSyDCBvNqyWWej-m5YnsEmqvhyFNZZC_E8OY"; // Gemini API Key

import { GoogleGenerativeAI } from "@google/generative-ai";

document.addEventListener('DOMContentLoaded', function () {
    const chatbotIcon = document.getElementById('chatbot-icon');
    const chatbotModal = document.getElementById('chatbot-modal');
    const closeButton = document.getElementById('close-button');
    const sendButton = document.getElementById('send-button');
    const chatInput = document.getElementById('chat-input');
    const countryInput = document.getElementById('country-input');
    const answerArea = document.getElementById('answer-area');

    chatbotIcon.addEventListener('click', function () {
        clearAnswerArea();
        chatbotModal.style.display = 'block';
    });

    closeButton.addEventListener('click', function () {
        chatbotModal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === chatbotModal) {
            chatbotModal.style.display = 'none';
        }
    });

    sendButton.addEventListener('click', function () {
        const query = chatInput.value.trim();
        const country = countryInput.value.trim();

        if (query) {
            displayAnswer(query, true);
            handleUserQuery(query, country);
            chatInput.value = "";
            countryInput.value = "";
        }
    });

 // Function to handle the user query
 function handleUserQuery(query, country) {
    const lowerCaseQuery = query.toLowerCase();

    if (lowerCaseQuery.includes("table")) {
        // Fetch data from the forecast table and enhance with Gemini
        getTableDataAndGeminiResponse(query);
    } else {
        const weatherKeywords = ["weather", "temperature", "humidity", "forecast", "wind", "rain", "snow", "storm", "sun", "cloud", "clear sky"];
        const isWeatherRelated = weatherKeywords.some(keyword => lowerCaseQuery.includes(keyword));

        if (isWeatherRelated) {
            getWeatherAndGeminiResponse(query, country);
        } else {
            displayAnswer("I only respond to weather-related queries or table data. Please ask about the weather or forecast table.", false);
        }
    }
}


   // Function to fetch forecast table data and Gemini API response
   function getTableDataAndGeminiResponse(query) {
    const forecastData = getCurrentForecastTableData();
    
    if (forecastData.length > 0) {
        const prompt = `${query}. Here is the forecast data from the table: ${forecastData}`;
        getGeminiResponse(query, prompt);
    } else {
        displayAnswer("No forecast data available in the table.", false);
    }
}


   // Function to get the current forecast table data
   function getCurrentForecastTableData() {
    const tableBody = document.querySelector("#forecast-table tbody");
    const rows = tableBody.querySelectorAll("tr");
    const forecastData = [];

    rows.forEach(row => {
        const columns = row.querySelectorAll("td");
        const date = columns[0].innerText;
        const temp = columns[1].innerText;
        const description = columns[2].innerText;
        const icon = columns[3].querySelector("img").alt;
        forecastData.push(`Date: ${date}, Temp: ${temp}, Description: ${description}, Icon: ${icon}`);
    });

    return forecastData.join(", ");
}


    // Function to fetch weather and Gemini API response
    function getWeatherAndGeminiResponse(query, country) {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${country}&units=metric&appid=${weatherApiKey}`;

        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    const weatherInfo = `Current weather in ${data.name}: ${data.weather[0].description}, ${data.main.temp}°C, humidity ${data.main.humidity}%, wind speed ${data.wind.speed} m/s.`;
                    getGeminiResponse(query, weatherInfo);
                } else {
                    displayAnswer("Country not found. Please try again.", false);
                }
            })
            .catch(error => {
                displayAnswer("Error fetching weather data. Please try again.", false);
            });
    }

    // Function to fetch the response from the Gemini API
    function getGeminiResponse(query, weatherInfo) {
        const prompt = `${query}. Here is the current weather data for the location: ${weatherInfo}`;

        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        model.generateContent(prompt)
            .then(result => {
                const geminiResponse = cleanResponse(result.response.text());
                displayAnswer(geminiResponse, false);
            })
            .catch(error => {
                displayAnswer("Error fetching response from Gemini API. Please try again.", false);
            });
    }

    // Function to clean up the Gemini response
    function cleanResponse(response) {
        return response.replace(/[*]/g, "").replace(/\n/g, "<br>").trim();
    }

    // Function to display the answer in the chat
    function displayAnswer(answer, isUser = false) {
        const answerDiv = document.createElement('div');
        answerDiv.classList.add('chatbot-answer', isUser ? 'user' : 'bot');

        const timestamp = new Date().toLocaleTimeString();
        const timeDiv = document.createElement('div');
        timeDiv.classList.add('timestamp');
        timeDiv.innerText = timestamp;

        answerDiv.innerHTML = answer; // Use innerHTML to render HTML content
        answerDiv.appendChild(timeDiv);
        answerArea.appendChild(answerDiv);
    }

    // Function to clear the chat area
    function clearAnswerArea() {
        answerArea.innerHTML = '';
    }
});

// Function to get current weather data
function getWeatherData(city) {
    const apiKey = weatherApiKey; // Your API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    // Show the loader
    document.getElementById("loading").style.display = "block";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Hide the loader
            document.getElementById("loading").style.display = "none";
            if (data.cod === 200) {
                updateWeatherDetails(data); // Update the weather detail panel
                getForecastData(city); // Get the forecast data as well
            } else {
                alert("City not found!");
            }
        })
        .catch(error => {
            // Hide the loader
            document.getElementById("loading").style.display = "none";
            console.error('Error fetching the weather data:', error);
        });
}


// Forecast and Pagination Functions

let currentPage = 1;
const itemsPerPage = 6; // Show the first 6 entries
let forecastList = []; // Store the forecast data

// Function to get forecast data
function getForecastData(city) {
    const apiKey = weatherApiKey; // Your API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    // Show the loader
    document.getElementById("loading").style.display = "block";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Hide the loader
            document.getElementById("loading").style.display = "none";
            if (data.cod === "200") {
                forecastList = data.list; // Store forecast data
                updateForecastTable(); // Update the table with forecast data
            } else {
                alert("Forecast data not found for this city.");
            }
        })
        .catch(error => {
            // Hide the loader
            document.getElementById("loading").style.display = "none";
            console.error('Error fetching the forecast data:', error);
        });
}

function updateForecastTable(filteredList = forecastList) {
    const tableBody = document.querySelector("#forecast-table tbody");
    tableBody.innerHTML = ''; // Clear previous data

    // Calculate total pages
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    
    // Get entries for the current page
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentForecasts = filteredList.slice(start, end);

    // Populate the table with the current page's forecasts
    currentForecasts.forEach(forecast => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(forecast.dt * 1000).toLocaleDateString()}</td>
            <td>${forecast.main.temp}°C</td>
            <td>${forecast.weather[0].description}</td>
            <td><img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}"></td>
        `;
        
        // Add click event listener to the row to show details
        row.addEventListener('click', () => {
            updateWeatherDetails(forecast); // Call function to update weather details
        });
        
        tableBody.appendChild(row);
    });

    // Create pagination controls
    createPaginationControls(totalPages);
}


// Function to update the weather detail panel based on the selected forecast
function updateWeatherDetails(forecast) {
    const humidity = forecast.main.humidity; // Get humidity
    const windSpeed = forecast.wind.speed; // Get wind speed
    const currentConditions = forecast.weather[0].description; // Get conditions
    const selectedDate = new Date(forecast.dt * 1000); // Selected date

    document.getElementById("city-name").innerText = forecast.name; // Set city name
    document.getElementById("humidity").innerText = `${humidity}%`;
    document.getElementById("wind-speed").innerText = `${windSpeed} m/s`;
    document.getElementById("current-conditions").innerText = currentConditions;
    document.getElementById("selected-date").innerText = selectedDate.toLocaleString();
}


// Create pagination controls
function createPaginationControls(totalPages) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ''; // Clear previous pagination

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.classList.add('pagination-button');
        
        // Event listener for changing pages
        button.addEventListener('click', () => {
            currentPage = i; // Set current page
            updateForecastTable(); // Update table with new page data
        });

        paginationContainer.appendChild(button);
    }
}


// Sort Ascending
document.getElementById("sort-asc").addEventListener("click", function() {
    const sortedList = [...forecastList].sort((a, b) => a.main.temp - b.main.temp);
    currentPage = 1; // Reset to the first page
    updateForecastTable(sortedList);
});

// Sort Descending
document.getElementById("sort-desc").addEventListener("click", function() {
    const sortedList = [...forecastList].sort((a, b) => b.main.temp - a.main.temp);
    currentPage = 1; // Reset to the first page
    updateForecastTable(sortedList);
});

// Filter Days with Rain
document.getElementById("filter-rain").addEventListener("click", function() {
    const filteredList = forecastList.filter(forecast => forecast.weather[0].description.includes("rain"));
    currentPage = 1; // Reset to the first page
    updateForecastTable(filteredList);
});

// Show Highest Temperature
document.getElementById("highest-temp").addEventListener("click", function() {
    const highestTempForecast = forecastList.reduce((max, forecast) => max.main.temp > forecast.main.temp ? max : forecast);
    updateForecastTable([highestTempForecast]); // Display only the highest temp day
});

// Call this function for testing (when city input is 'London')
getWeatherData("Islamabad");
