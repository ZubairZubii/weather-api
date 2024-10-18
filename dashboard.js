const apiKey = "3262aec225a0be7d86e0bc7c03d2bc85"; // Your API key
const forecastLimit = 5; // Limit of forecasts to show per page
let currentPage = 1;
let forecasts = [];

// Loading and error message elements
const loadingSpinner = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");

// Fetching the current location using geolocation
async function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            await fetchCityName(lat, lon); // Fetch city name using Nominatim
        }, (error) => {
            console.error("Error fetching location:", error);
            showError("Unable to retrieve your location. Please search for a city.");
        });
    } else {
        showError("Geolocation is not supported by this browser.");
    }
}

async function fetchCityName(lat, lon) {
    loadingSpinner.style.display = 'block'; // Show loading spinner
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        if (!response.ok) throw new Error("Unable to retrieve city name. Please check your connection."); // Check response
        const data = await response.json();
        const city = data.address.city || data.address.town || data.address.village; // Get city name
        if (!city) throw new Error("City name not found. Please try a different location.");
        await fetchWeatherData(city); // Fetch weather data using city name
    } catch (error) {
        console.error("Error fetching city name:", error);
        showError(error.message);
    } finally {
        loadingSpinner.style.display = 'none'; // Hide loading spinner
    }
}

async function fetchWeatherData(city) {
    loadingSpinner.style.display = 'block'; // Show loading spinner
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!res.ok) throw new Error("Weather data not found. Please check the city name."); // Check response
        const data = await res.json();
        updateWeatherUI(data); // Update the UI with weather data
        await fetchForecastData(data.coord.lat, data.coord.lon); // Fetch and display the forecast data
    } catch (error) {
        showError(error.message);
    } finally {
        loadingSpinner.style.display = 'none'; // Hide loading spinner
    }
}

let currentTemperatureCelsius = null;
let currentTemperatureFahrenheit = null;

function updateWeatherUI(data) {
    const { name, main, wind, weather } = data; // Ensure all properties are correctly extracted
    document.getElementById("city-name").innerText = name;

    // Store the current temperatures
    currentTemperatureCelsius = main.temp;
    currentTemperatureFahrenheit = (main.temp * 9 / 5) + 32;

    // Set initial temperature in Celsius
    document.getElementById("temperature").innerText = `${Math.round(currentTemperatureCelsius)}°C`;

    document.getElementById("humidity").innerText = `Humidity: ${main.humidity}%`; // Humidity
    document.getElementById("wind-speed").innerText = `Wind Speed: ${wind.speed} m/s`; // Wind Speed
    document.getElementById("weather-description").innerText = weather[0].description; // Weather Description
    document.getElementById("weather-icon").src = `http://openweathermap.org/img/wn/${weather[0].icon}.png`; // Weather Icon

    // Apply fade-in effect
    const weatherDetails = document.querySelectorAll('#city-name, #temperature, #humidity, #wind-speed, #weather-description, #weather-icon');
    weatherDetails.forEach(detail => {
        detail.classList.add('fade-in');
        // Trigger reflow to ensure the animation works
        void detail.offsetWidth; // This forces a reflow
        detail.classList.add('visible');
    });
}

// Updated search functionality to use city name
document.getElementById("search-button").addEventListener("click", async () => {
    const cityInput = document.getElementById("city-input").value.trim();
    if (cityInput) {
        await fetchWeatherDataByCity(cityInput);
    }
});

// Function to fetch weather data by city name
async function fetchWeatherDataByCity(city) {
    loadingSpinner.style.display = 'block'; // Show loading spinner
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!res.ok) throw new Error("Weather data not found. Please check the city name."); // Check response
        const data = await res.json();
        updateWeatherUI(data); // Update the UI with weather data
        await fetchForecastData(data.coord.lat, data.coord.lon); // Fetch and display the forecast data
    } catch (error) {
        showError(error.message);
    } finally {
        loadingSpinner.style.display = 'none'; // Hide loading spinner
    }
}

async function fetchForecastData(lat, lon) {
    loadingSpinner.style.display = 'block'; // Show loading spinner
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        if (!res.ok) throw new Error("Forecast data not found. Please try again later."); // Check response
        const data = await res.json();
        forecasts = data.list;
        renderForecasts();
        renderCharts(data.city.name);
    } catch (error) {
        showError(error.message);
    } finally {
        loadingSpinner.style.display = 'none'; // Hide loading spinner
    }
}

function renderForecasts() {
    const forecastInfo = document.getElementById("forecast-info");
    forecastInfo.innerHTML = ''; // Clear previous forecasts
    const start = (currentPage - 1) * forecastLimit;
    const end = start + forecastLimit;

    forecasts.slice(start, end).forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temp = Math.round(forecast.main.temp);
        const condition = forecast.weather[0];

        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecast-item", "fade-in");
        forecastItem.innerHTML = `
            <p>${time}</p>
            <p>Temp: ${temp}°C</p>
            <img src="http://openweathermap.org/img/wn/${condition.icon}.png" alt="${condition.description}">
        `;

        // Trigger reflow to ensure the animation works
        void forecastItem.offsetWidth; // This forces a reflow
        forecastItem.classList.add('visible');

        forecastInfo.appendChild(forecastItem);
    });

    document.getElementById("prev-page").disabled = currentPage === 1;
    document.getElementById("next-page").disabled = end >= forecasts.length;
}

// Variables to store chart instances
let barChartInstance = null;
let doughnutChartInstance = null;
let lineChartInstance = null;

function renderCharts(cityName) {
    // Prepare data for the charts
    const temperatures = forecasts.slice(0, 5).map(f => f.main.temp);
    const weatherCounts = {};

    forecasts.forEach(forecast => {
        const condition = forecast.weather[0].main;
        weatherCounts[condition] = (weatherCounts[condition] || 0) + 1;
    });

    const weatherLabels = Object.keys(weatherCounts);
    const weatherData = Object.values(weatherCounts);

    // Destroy old chart instances before creating new ones
    if (barChartInstance) {
        barChartInstance.destroy();
    }
    if (doughnutChartInstance) {
        doughnutChartInstance.destroy();
    }
    if (lineChartInstance) {
        lineChartInstance.destroy();
    }

    // Bar Chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    barChartInstance = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Now', 'Next 4 Hours', 'Next 8 Hours', 'Next 12 Hours', 'Next 16 Hours'],
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            animations: {
                y: {
                    delay: (context) => context.index * 100,
                },
            },
        },
    });

    // Doughnut Chart
    const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');
    doughnutChartInstance = new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
            labels: weatherLabels,
            datasets: [{
                label: 'Weather Conditions',
                data: weatherData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            }]
        },
        options: {
            animations: {
                animateScale: true,
                animateRotate: true,
            },
        },
    }
    
    );

    // Line Chart
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    lineChartInstance = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Now', 'Next 4 Hours', 'Next 8 Hours', 'Next 12 Hours', 'Next 16 Hours'],
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
            }]
        },
        options: {
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear',
                    from: 1,
                    to: 0,
                    loop: true,
                },
            },
        },
    });
}

// Pagination controls
document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderForecasts();
    }
});

document.getElementById("next-page").addEventListener("click", () => {
    if (currentPage * forecastLimit < forecasts.length) {
        currentPage++;
        renderForecasts();
    }
});

// Error handling function to display error messages
function showError(message) {
    errorMessage.innerText = message; // Set error message
    errorMessage.style.display = 'block'; // Show error message
    setTimeout(() => {
        errorMessage.style.display = 'none'; // Hide error message after a delay
    }, 5000); // Hide after 5 seconds
}

// Initialize the application
getLocation();
