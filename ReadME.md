# Weather Dashboard & Tables - README

## Overview
This project is a weather application that provides detailed weather information for different cities. It includes two main sections:

1. **Dashboard**: Displays the current weather, forecast, and charts representing weather data.
2. **Tables**: Provides a tabular view of weather forecasts with sorting, filtering options, and a chatbot for queries.

The app is designed to be visually appealing and responsive across various devices.

---

## Features
### Weather Dashboard (`Dashboard.html`)
- **City Search**: Users can search for a city's weather by entering the city name in the search bar.
- **Current Weather**: Displays the current temperature, humidity, wind speed, weather description, and a relevant weather icon.
- **Temperature Toggle**: Users can toggle between Celsius and Fahrenheit to view the temperature in their preferred unit.
- **Forecast**: Shows today's weather forecast for different times of the day.
- **Charts**: Visualizes weather data using three charts:
  - **Bar Chart**: Displays the temperature forecast for the next five days.
  - **Doughnut Chart**: Shows the percentage of different weather conditions (e.g., sunny, rainy) over the five-day period.
  - **Line Chart**: Illustrates the temperature trends over the next five days.
- **Pagination**: Allows users to navigate through the forecast data.
  
### Weather Tables (`table.html`)
- **Tabular Forecast View**: Provides a table format to view the weather forecast with columns for date, temperature, conditions, and an icon representing the weather.
- **Sorting & Filtering**: Users can sort the forecast by temperature (ascending or descending) and filter days with rain.
- **Pagination**: Navigate through weather data in pages.
- **Weather Details Panel**: Displays additional weather details like humidity, wind speed, and conditions for a selected forecast day.
- **Chatbot**: A built-in weather chatbot that answers queries about the weather using AI and can respond to both weather and country-based questions.

---

## File Structure

### HTML Files
- **`Dashboard.html`**: Contains the structure for the weather dashboard, including search functionality, current weather, forecast, and charts.
- **`table.html`**: Contains the structure for the weather forecast table with sorting, filtering, and a chatbot for interactions.

### CSS Files
- **`Dashboard.css`**: Defines the layout and styling of the dashboard, including the search bar, current weather container, charts, and sidebar.
- **`tables.css`**: Defines the layout and styling for the table view, filters, pagination, and chatbot.

### JavaScript Files
- **`dashboard.js`**: Handles the dynamic behavior of the dashboard, including city search, current weather retrieval, chart updates, and pagination.
- **`table.js`**: Manages the table functionalities, including sorting, filtering, pagination, and chatbot responses.

---

## Key Components

### Dashboard Components
- **Search Input**: 
  - Allows the user to search for a city.
  - Implemented using `<input type="text">` with an associated search button.
  
- **Current Weather Section**:
  - Displays the selected city's weather details like temperature, humidity, and weather icon.
  - Includes a temperature toggle button (Celsius/Fahrenheit).

- **Forecast Container**:
  - Dynamically updates the forecast data for different times throughout the day.
  - Includes pagination to navigate through the forecast periods.

- **Charts**:
  - Three types of charts implemented using **Chart.js**:
    - Bar chart, Doughnut chart, and Line chart.
  - Visualize weather trends over five days.

### Table Components
- **Forecast Table**:
  - Displays forecast details in rows with columns for date, temperature, and weather icon.
  - Sorting buttons allow ascending and descending sorting of temperatures.
  - Filter buttons help narrow down forecasts (e.g., show days with rain only).
  
- **Weather Details Panel**:
  - Provides detailed information about a selected forecast day, including city name, humidity, wind speed, and selected date.
  
- **Pagination**:
  - Displays weather data across multiple pages, ensuring a manageable view of data.

- **Chatbot**:
  - Uses AI to respond to weather-related queries.
  - Provides a user-friendly interface for weather-related questions.

---

## How to Run the Application

### Prerequisites
- Modern web browser (e.g., Chrome, Firefox, Safari).
- Internet connection for fetching weather data from APIs.

### Instructions
1. Clone the repository or download the files.
2. Open `Dashboard.html` in your web browser to view the weather dashboard.
3. Open `table.html` to view the weather forecast in a tabular format.

---

## Technologies Used
- **HTML5**: Markup language for creating the structure of the application.
- **CSS3**: Stylesheets to create the visual design of the app, including layouts and responsive elements.
- **JavaScript**: Used for interactivity, dynamic content loading, and integrating external APIs.
- **Chart.js**: A library to display weather data using charts (bar, doughnut, and line).
- **OpenWeatherMap API**: Used to fetch weather data based on city or coordinates.
- **Google Generative AI**: Utilized in the chatbot for weather-related queries.

---

## Customization
To customize the design or functionality of the application, you can:
- Modify the CSS files (`Dashboard.css`, `tables.css`) to change the layout, colors, and design elements.
- Update the JavaScript files (`dashboard.js`, `table.js`) to add more features or change existing behaviors (e.g., adding new filters or chatbot capabilities).
  
---

## Future Enhancements
- **Improved Chatbot**: Further integration with AI to answer more detailed weather-related queries.
- **More Weather Insights**: Add charts for additional weather data (e.g., precipitation, pressure).
- **Extended Table Functionalities**: Add more filtering and sorting options for enhanced usability.

---

## License
This project is open-source and free to use for educational and personal purposes.

