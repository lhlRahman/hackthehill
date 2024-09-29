'use client'
import React from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

const icon = L.icon({ iconUrl: "/images/marker-icon.png" });

export default function StreetViewMap( {visible, position, destination } ) {

return (
  <div className="">
      <MapContainer center={position} zoom={15} scrollWheelZoom={false }style={{height:'20vh', width:'100%', "z-index": '0'}}>
        <TileLayer
          className=""
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={icon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
  </div>
  )
}
