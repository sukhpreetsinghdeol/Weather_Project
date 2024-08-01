"use client";
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Geolocation from './Geolocation';
import 'weather-icons/css/weather-icons.css';

const WeatherComponent = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const locationNameRef = useRef('');

  const fetchWeather = async (lat, lon) => {
    try {
      setError('');
      const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: lat,
          longitude: lon,
          hourly: 'temperature_2m,weathercode',
          current_weather_units: 'winddirection,windspeed',
          timezone: 'auto',
          current_weather: true,
        },
      });

      if (!locationNameRef.current) {
        const cityNameResponse = await axios.get(`https://geocode.xyz/${lat},${lon}?geoit=json`);
        const cityName = cityNameResponse.data.city || "Unknown Location";
        locationNameRef.current = cityName;
      }
      setWeather(weatherResponse.data);
    } catch (err) {
      setError('Failed to fetch weather data');
    }
  };
  
  useEffect(() => {
    if (latitude && longitude) {
      fetchWeather(latitude, longitude);
    }
  }, [latitude, longitude]);

  const handleLocationChange = (lat, lon) => {
    setLatitude(lat);
    setLongitude(lon);
    locationNameRef.current = '';
  };

  const weatherCodeToIcon = {
    0: 'wi-day-sunny',
    1: 'wi-day-cloudy',
    2: 'wi-cloudy',
    3: 'wi-showers',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6 text-white">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <header className="bg-gray-600 text-white p-4 text-center text-4xl font-bold">
          Weather App
        </header>
        <div className="p-6">
          <Geolocation onLocationChange={handleLocationChange} />
          {error && <p className="text-red-500 mt-4 text-lg">{error}</p>}
          {weather && (
            <div>
              <div className="mb-6 bg-gray-700 p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-2">{locationNameRef.current}</h2>
                <p className="text-xl mb-2">Current Weather</p>
                <div className="flex items-center">
                  <i className={`wi ${weatherCodeToIcon[weather.current_weather.weathercode] || 'wi-na'} text-6xl mr-4`}></i>
                  <div>
                    <p className="text-lg font-medium">Time: {new Date(weather.current_weather.time).toLocaleTimeString()}</p>
                    <p className="text-xl font-bold">Temperature: {weather.current_weather.temperature}°C</p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Hourly Weather</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {weather.hourly.time
                    .map((time, index) => ({ time, index }))
                    .filter(({ time }) => new Date(time) > new Date(weather.current_weather.time))
                    .slice(0, 6)
                    .map(({ time, index }) => (
                      <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-md">
                        <p className="font-bold">{new Date(time).toLocaleTimeString()}</p>
                        <div className="flex items-center">
                          <i className={`wi ${weatherCodeToIcon[weather.hourly.weathercode[index]] || 'wi-na'} text-4xl mr-2`}></i>
                          <div>
                            <p className="text-lg font-medium">Temperature: {weather.hourly.temperature_2m[index]}°C</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Detailed Observations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <p className="font-bold">Wind</p>
                    <p>{weather.current_weather.windspeed} {weather.current_weather_units.windspeed}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <p className="font-bold">Wind Direction</p>
                    <p>{weather.current_weather.winddirection} {weather.current_weather_units.winddirection}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                    <p className="font-bold">Elevation</p>
                    <p>{weather.elevation} m</p>
                  </div> 
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherComponent;
