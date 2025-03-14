import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import WeatherDisplay from './components/WeatherDisplay';
import ErrorMessage from './components/ErrorMessage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/v1'; 

function App() {
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/cities`);
        
        const filteredCities = response.data.filter(city => city.city_name);
        
        const cityGroups = {};
        filteredCities.forEach(city => {
          const displayName = city.display_name || city.city_name;
          
          if (!cityGroups[displayName]) {
            cityGroups[displayName] = [];
          }
          cityGroups[displayName].push(city);
        });
        
        const topCityCandidates = [];
        
        Object.values(cityGroups).forEach(cities => {
          const sortedGroup = [...cities].sort((a, b) => 
            (Number(b.popularity) || -Infinity) - (Number(a.popularity) || -Infinity)
          );
          if (sortedGroup[0].popularity) {
            topCityCandidates.push(sortedGroup[0]);
          }
        });
        
        const citiesWithPopularity = topCityCandidates;
        
        const sortedCities = [...citiesWithPopularity].sort((a, b) => 
          (Number(b.popularity) || -Infinity) - (Number(a.popularity) || -Infinity)
        );
        
        const topCities = sortedCities.slice(0, 10);
        
        const formattedCities = filteredCities.map(city => {
          const displayName = city.display_name || city.city_name;
          return {
            id: city.city_name,
            name: displayName,
            data: city
          };
        });
        
        setCities(formattedCities);
        
        const topCityNames = topCities.map(city => city.city_name);
        setSelectedCities(topCityNames);
        
        setError(null);
      } catch (err) {
        setError('Failed to load cities. Please try again later.');
        console.error('Error fetching cities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (selectedCities.length === 0) return;
      
      setLoading(true);
      const newWeatherData = { ...weatherData };

      console.log(selectedCities)
      
      try {
        for (const cityName of selectedCities) {
          if (newWeatherData[cityName]) continue;
          
          const encodedCityName = encodeURIComponent(cityName);
          const response = await axios.get(`${API_BASE_URL}/cities/${encodedCityName}/weather`);
          const { city, weather } = response.data;

          newWeatherData[cityName] = {
            temperature: Math.round(weather.list[0].main.temp - 273.15), // Convert from Kelvin to Celsius
            temp_max: Math.round(weather.list[0].main.temp_max - 273.15),
            temp_min: Math.round(weather.list[0].main.temp_min - 273.15), 
            condition: weather.list[0].weather[0].main,
            humidity: weather.list[0].main.humidity,
            wind_speed: weather.list[0].wind.speed,
            unit: 'C',
            wind_unit: 'm/s',
            rawCityData: city,
            rawWeatherData: weather
          };
        }
        
        setWeatherData(newWeatherData);
        setError(null);
      } catch (err) {
        setError('Failed to load weather data. Please try again later.');
        console.error('Error fetching weather:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [selectedCities]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="left">
          Weather Forecast
        </Typography>

        {error && <ErrorMessage message={error} />}

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            color="text.secondary"
            gutterBottom
            sx={{ pb: 2 }}
          >
            Check the current forecast for the 10 most booked cities in our site!
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <WeatherDisplay
              weatherData={weatherData}
              selectedCities={selectedCities}
              cities={cities}
            />
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default App;
