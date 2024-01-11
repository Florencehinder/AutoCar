import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Bus } from "phosphor-react";
import { renderToStaticMarkup } from "react-dom/server";

const GPSLocationTracker = () => {
  const [currentPosition, setCurrentPosition] = useState({
    lat: 0, // Default latitude
    lng: 0, // Default longitude
  });

  const updatePosition = (position) => {
    setCurrentPosition({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  };

  const busIconMarkup = renderToStaticMarkup(<Bus size={24} />);
  const busIcon = new L.Icon({
    iconUrl: "data:image/svg+xml;base64," + btoa(busIconMarkup),
    iconSize: [48, 48],
    iconAnchor: [12, 48],
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(updatePosition, console.error, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    }
  }, []);

  console.log(currentPosition); // Debug log

  return (
    <MapContainer
      center={[currentPosition.lat, currentPosition.lng]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[currentPosition.lat, currentPosition.lng]} icon={busIcon}>
        <Popup>You are here</Popup>
      </Marker>
    </MapContainer>
  );
};

export default GPSLocationTracker;
