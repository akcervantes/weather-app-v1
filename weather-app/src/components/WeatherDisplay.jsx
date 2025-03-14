import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Divider,
  Grid,
  CircularProgress,
  CardActionArea
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import GrainIcon from '@mui/icons-material/Grain';
import CloudIcon from '@mui/icons-material/Cloud';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ForecastDetails from './ForecastDetails';

function WeatherDisplay({ weatherData, selectedCities, cities }) {
  const [selectedCity, setSelectedCity] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCardClick = (city) => {
    setSelectedCity(city);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  if (selectedCities.length === 0) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          Select cities to view weather information
        </Typography>
      </Box>
    );
  }

  // Helper function to get weather icon based on condition
  const getWeatherIcon = (condition) => {
    condition = condition ? condition.toLowerCase() : '';
    
    if (condition.includes('sun') || condition.includes('clear')) {
      return <WbSunnyIcon sx={{ fontSize: 40, color: '#FFB300' }} />;
    } else if (condition.includes('snow')) {
      return <AcUnitIcon sx={{ fontSize: 40, color: '#90CAF9' }} />;
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      return <GrainIcon sx={{ fontSize: 40, color: '#64B5F6' }} />;
    } else {
      return <CloudIcon sx={{ fontSize: 40, color: '#BDBDBD' }} />;
    }
  };

  // Sort cities by popularity (higher number = more popular)
  const sortedCities = [...selectedCities].sort((a, b) => {
    const cityA = cities.find(c => c.id === a);
    const cityB = cities.find(c => c.id === b);
    const popularityA = cityA?.data?.popularity ? Number(cityA.data.popularity) : -Infinity;
    const popularityB = cityB?.data?.popularity ? Number(cityB.data.popularity) : -Infinity;
    return popularityB - popularityA;
  });
  
  return (
    <>
    <ForecastDetails 
      open={dialogOpen}
      onClose={handleDialogClose}
      city={selectedCity}
      weatherData={selectedCity ? weatherData[selectedCity.id] : null}
    />
    <Grid container spacing={3}>
      {sortedCities.map((cityName) => {
        const city = cities.find(c => c.id === cityName);
        const weather = weatherData[cityName];
        
        if (!weather) {
          return (
            <Grid item xs={12} sm={6} md={4} key={cityName}>
              <Card elevation={3} sx={{ height: '100%', opacity: 0.7 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h5" component="h2">
                        {city ? city.name : cityName}
                      </Typography>
                      {city && city.data.state && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOnIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {city.data.state}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <CircularProgress size={30} />
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="textSecondary">Loading weather data...</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        }
        
        const cityRank = sortedCities.indexOf(cityName) + 1;
        const showRank = cityRank <= 10;
        
        return (
          <Grid item xs={12} sm={6} md={4} key={cityName}>
            <Card elevation={3} sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
              {showRank && (
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: -10, 
                    right: -10, 
                    backgroundColor: 'primary.main',
                    color: 'white',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    zIndex: 2,
                    boxShadow: '0 3px 5px rgba(0,0,0,0.2)'
                  }}
                >
                  {cityRank}
                </Box>
              )}
              <CardActionArea 
                onClick={() => handleCardClick(city, weather)}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, overflow: 'visible' }}>
                    <Box>
                      <Typography variant="h5" component="h2">
                        {city ? city.name : cityName}
                      </Typography>
                      {city && city.data.state && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOnIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {city.data.state}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  {getWeatherIcon(weather.condition)}
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="h4" component="p" sx={{ mb: 1 }}>
                  {weather.temperature}°{weather.unit || 'C'}
                </Typography>
                
                <Typography color="textSecondary">
                  {weather.condition}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" component="p">
                    Humidity: {weather.humidity}%
                  </Typography>
                  <Typography variant="body2" component="p">
                    Wind: {weather.wind_speed} {weather.wind_unit || 'km/h'}
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Typography 
                    variant="body2" 
                    color="primary"
                    sx={{ 
                      fontWeight: 'medium',
                      textAlign: 'center' 
                    }}
                  >
                    View 5-day forecast
                  </Typography>
                </Box>
              </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
    </>
  );
}

export default WeatherDisplay;