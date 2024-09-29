'use client';
import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fromAddress } from 'react-geocode';

const icon = L.icon({ iconUrl: "/images/marker-icon.png" });

export default function StreetViewMap({ visible, destination }) {
  const [userPos, setUserPos] = useState(null);       // Stores user's position
  const [destinationPos, setDestinationPos] = useState(null); // Stores destination position

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
    const intervalId = setInterval(getCurrentLocation, 10000); // Update every 10 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  // Convert destination address to coordinates if provided
  useEffect(() => {
    if (destination) {
      fromAddress(destination)
        .then(({ results }) => {
          if (results.length > 0) {
            // Extract lat and lng from the response and update state
            const { lat, lng } = results[0].geometry.location;
            setDestinationPos([lat, lng]); // Set the destination coordinates
          }
        })
        .catch(console.error);
    }
  }, [destination]);

  // If the map is not visible, return null
  if (!visible) return null;

  return (
    <div>
      {userPos ? (
        <MapContainer center={userPos} zoom={15} scrollWheelZoom={false} style={{ height: '20vh', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User marker */}
          <Marker position={userPos} icon={icon}>
            <Popup>You are here!</Popup>
          </Marker>

          {/* Destination marker if destination coordinates exist */}
          {destinationPos && (
            <Marker position={destinationPos} icon={icon}>
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
