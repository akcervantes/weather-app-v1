import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Typography, 
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import GrainIcon from '@mui/icons-material/Grain';
import CloudIcon from '@mui/icons-material/Cloud';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function ForecastDetails({ open, onClose, city, weatherData }) {
  if (!weatherData || !weatherData.rawWeatherData || !city) {
    return null;
  }

  const forecast = weatherData.rawWeatherData;
  
  const getWeatherIcon = (condition, size = 'medium') => {
    condition = condition ? condition.toLowerCase() : '';
    
    const iconSize = size === 'small' ? { fontSize: 20 } : { fontSize: 40 };
    const colors = {
      sunny: '#FFB300',
      snow: '#90CAF9',
      rain: '#64B5F6',
      cloud: '#BDBDBD'
    };
    
    if (condition.includes('sun') || condition.includes('clear')) {
      return <WbSunnyIcon sx={{ ...iconSize, color: colors.sunny }} />;
    } else if (condition.includes('snow')) {
      return <AcUnitIcon sx={{ ...iconSize, color: colors.snow }} />;
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      return <GrainIcon sx={{ ...iconSize, color: colors.rain }} />;
    } else {
      return <CloudIcon sx={{ ...iconSize, color: colors.cloud }} />;
    }
  };

  const groupForecastByDay = () => {
    const days = {};
    const now = new Date();
    const today = now.toDateString();

    function calculateCelsius(temperature) {
      return Math.round(temperature - 273.15) 
    }
    
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();
      
      // Skip today
      if (dayKey === today) return;
      
      if (!days[dayKey]) {
        days[dayKey] = {
          date,
          items: [],
          temps: [],
          conditions: []
        };
      }
      
      days[dayKey].items.push(item);
      days[dayKey].temps.push(item.main.temp);
      days[dayKey].conditions.push(item.weather[0].main);
    });
    
    Object.values(days).forEach(day => {
      day.maxTemp = calculateCelsius(Math.max(...day.temps));
      day.minTemp = calculateCelsius(Math.min(...day.temps));

      const sum = day.temps.reduce((a, b) => a + b, 0);
      console.log(day);
      day.avgTemp = calculateCelsius(sum / day.temps.length); 
      
      const conditionCounts = {};
      day.conditions.forEach(c => {
        conditionCounts[c] = (conditionCounts[c] || 0) + 1;
      });
      day.mainCondition = Object.entries(conditionCounts)
        .sort((a, b) => b[1] - a[1])
        [0][0];
    });
    
    return Object.values(days).slice(0, 7); 
  };
  
  const dailyForecast = groupForecastByDay();
  
  const formatDay = (date) => {
    return date.toLocaleDateString(undefined, { weekday: 'long' });
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5">{city.name}</Typography>
          {city.data.state && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {city.data.state}
              </Typography>
            </Box>
          )}
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: "grey.500" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" gutterBottom>
          5-Day Forecast
        </Typography>
        
        <Box
          component={Paper}
          elevation={0}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "left",
                p: 2,
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="body1">Date</Typography>
              <Typography variant="body1" fontWeight="medium">
                Min 
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                Max 
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                Average
              </Typography>
            </Box>
          {dailyForecast.map((day) => (
            <Box
              key={day.date.toISOString()}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "left",
                p: 2,
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="body2">{formatDate(day.date)}</Typography>
              <Typography variant="body1" fontWeight="medium">
                {day.minTemp}°C
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {day.maxTemp}°C
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {day.avgTemp}°C
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3 }}>
          Forecast data from OpenWeatherMap
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default ForecastDetails;