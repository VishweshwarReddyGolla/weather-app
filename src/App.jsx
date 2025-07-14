

import { useEffect, useState } from 'react';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState('metric');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiKey = 'ed6971832276d9640349828f7c28827c'; // 🔁 Replace with your OpenWeatherMap API key

  const fetchWeatherByCity = async (cityName) => {
    if (!cityName) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`
      );

      if (!response.ok) throw new Error('City not found');

      const data = await response.json();
      setWeather(data);
      localStorage.setItem('lastCity', cityName);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`
      );

      if (!response.ok) throw new Error('Location fetch failed');

      const data = await response.json();
      setCity(data.name);
      setWeather(data);
      localStorage.setItem('lastCity', data.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLocationWeather = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (err) => {
          setError('Location permission denied.');
        }
      );
    } else {
      setError('Geolocation not supported');
    }
  };

  // 🔁 On load or when unit changes, fetch weather by geolocation or saved city
  useEffect(() => {
    const savedCity = localStorage.getItem('lastCity');
    if (savedCity) {
      fetchWeatherByCity(savedCity);
    } else {
      getLocationWeather(); // fallback to geolocation
    }
  }, [unit]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchWeatherByCity(city);
  };

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🌤️ Weather App</h1>
      <div style={styles.inputGroup}>
        <input
          type="text"
          placeholder="Enter your city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.input}
        />
        <button onClick={() => fetchWeatherByCity(city)} style={styles.button}>Search</button>
       
      </div>
      <div>
      <button onClick={getLocationWeather} style={styles.geoButton}>
        📍 Use My Location
      </button>
       <button onClick={toggleUnit} style={styles.toggleButton}>
          Switch to {unit === 'metric' ? '°F' : '°C'}
        </button>
      </div>

      {loading && <p>Loading weather data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weather && (
        <div style={styles.weatherBox}>
          <h2>{weather.name}, {weather.sys.country}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather icon"
          />
          <p><strong>{weather.weather[0].main}</strong> - {weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp} {unit === 'metric' ? '°C' : '°F'}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
        </div>
      )}
    </div>
  );
}


const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    marginTop: '2rem',
    backgroundColor: '#e0f7fa',
    minHeight: '100vh',
    padding: '1rem',
    color: '#033e57', // ✅ dark blue text for visibility
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1.5rem',
    color: '#0077b6',
  },
  inputGroup: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap', // responsive on small screens
    marginBottom: '1rem',
  },
  input: {
    padding: '0.6rem',
    fontSize: '1rem',
    width: '220px',
    border: '2px solid #0077b6',
    borderRadius: '5px',
    outline: 'none',
    color: 'white',
  },
  button: {
    padding: '0.6rem 1.2rem',
    fontSize: '1rem',
    backgroundColor: '#0077b6',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  toggleButton: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#48cae4',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  weatherBox: {
    marginTop: '2rem',
    padding: '1.5rem',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    display: 'inline-block',
    minWidth: '280px',
    color: '#033e57',
  },
  geoButton: {
  marginTop: '10px',
  padding: '0.6rem 1.2rem',
  backgroundColor: '#00b4d8',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  fontSize: '1rem',
  cursor: 'pointer',
}

};


export default App;

