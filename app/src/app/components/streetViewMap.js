'use client';
import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const icon = L.icon({ iconUrl: "/images/marker-icon.png" });
const icon2 = L.icon({ iconUrl: "images/marker-icon-red.png" });

export default function StreetViewMap({ visible, setVisible, destination }) {

  // Function to calculate displacement using Haversine formula
  function calculateDisplacement(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius of the Earth in meters
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters
    return distance;
  }

  function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  const [userPos, setUserPos] = useState(null);  // Stores user's position
  const [displacement, setDisplacement] = useState(0); // Stores displacement

  // Geolocation function to update user position
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPos([latitude, longitude]); // Update user position
        },
        (error) => {
          console.error("Error occurred: ", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Effect to handle initial user position and set interval for updates
  useEffect(() => {
    getCurrentLocation(); // Get initial position on mount
    const intervalId = setInterval(getCurrentLocation, 5000); // Update every 2 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  // Effect to calculate displacement when userPos or destination changes
  useEffect(() => {
    if (userPos && destination) {
      const distance = calculateDisplacement(userPos[0], userPos[1], destination[0], destination[1]);
      setDisplacement(distance); // Update displacement state

      if (displacement <= 50) {
        setVisible(true);
      }
    }
  }, [userPos, destination]); // Runs when either userPos or destination changes

  // If the map is not visible, return null
  if (!visible) return null;

  return (
    <div>
      <p>Distance: {displacement.toFixed(2)} meters</p> {/* Display the displacement */}
      {userPos ? (
        <MapContainer center={userPos} zoom={15} scrollWheelZoom={false} style={{ height: '20vh', width: '100%', 'z-index':'0' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User marker */}
          <Marker position={userPos} icon={icon}>
            <Popup>You are here!</Popup>
          </Marker>

          {/* Destination marker if destination coordinates exist */}
          {destination && (
            <Marker position={destination} icon={icon2}>
              <Popup>Destination</Popup>
            </Marker>
          )}
        </MapContainer>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
}
