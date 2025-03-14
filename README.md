# Weather Forecast Application

A modern weather forecast application with a React frontend and Ruby on Rails backend API. The application displays weather information for the top 10 most popular cities and allows users to view detailed 7-day forecasts.

## Application Structure

- `weather-api/` - Rails backend API
- `weather-app/` - React frontend

## Prerequisites

- Ruby 3.3.5
- Node.js (v18+)
- npm or yarn
- SQLite3
- Docker (optional, for containerized deployment)

## Setup and Installation

### 1. Backend API Setup

```bash
# Navigate to the API directory
cd weather-api

# Install dependencies
bundle install

# Setup the database
bin/rails db:setup

# Start the Rails server (development mode)
bin/rails server -p 3001
```

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd weather-app

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

## Running the Application

1. Ensure the backend API is running on port 3001
2. Start the frontend application (will run on port 5173 by default)
3. Access the application in your browser at http://localhost:5173

## Features

- Display of current weather for top 10 most popular cities
- Detailed 7-day weather forecast for each city
- Temperature display in Celsius
- Weather conditions with appropriate icons
- Additional weather information like humidity and wind speed

## API Endpoints

- `/api/v1/cities` - Get list of all cities
- `/api/v1/cities/:city_name/weather` - Get weather data for a specific city

## Docker Deployment

The backend API includes a Dockerfile for containerized deployment:

```bash
# Build the Docker image
docker build -t weather_api ./weather-api

# Run the container
docker run -d -p 3001:80 -e RAILS_MASTER_KEY=<your_master_key> --name weather_api weather_api
```

## Development

- Backend: The Rails API uses caching to optimize multiple weather API calls
- Frontend: Built with React, Material UI, and axios for API communication

