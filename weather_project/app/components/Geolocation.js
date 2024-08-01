"use client"
import React, { useState, useEffect } from 'react';

const Geolocation = ({ onLocationChange }) => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null
          });
          if (onLocationChange) onLocationChange(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setLocation({
            latitude: null,
            longitude: null,
            error: error.message
          });
        }
      );
    } else {
      setLocation({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by this browser.'
      });
    }
  }, []);

  return (
    <main>

    </main>
  );
};

export default Geolocation;
