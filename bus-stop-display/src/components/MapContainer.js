import React, { useEffect, useRef } from "react";
import { Bus } from "phosphor-react";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { lineData205 } from "../data/custom/205-line-route";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Polyline,
} from "react-leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

const busIconMarkup = renderToStaticMarkup(<Bus size={24} />);
const busIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(busIconMarkup),
  iconSize: [48, 48],
  iconAnchor: [12, 48],
});

const HandleMapClick = ({ setCoordinates }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setCoordinates(lat, lng);
    },
  });
  return null; // Component does not render anything
};

const CustomMapContainer = ({ busStops, geolocation, onMapClick }) => {
  const watchIdRef = useRef(null);
  const MAX_READINGS = 10;
  const readingsQueueRef = useRef([]);

  useEffect(() => {
    const updateLocation = (newLat, newLong) => {
      onMapClick(newLat, newLong);
    };

    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          if (!isNaN(latitude) && !isNaN(longitude)) {
            console.log("CALLED");
            const newReading = { latitude, longitude, accuracy };
            readingsQueueRef.current.push(newReading);

            if (readingsQueueRef.current.length > MAX_READINGS) {
              readingsQueueRef.current.shift();
            }

            const sum = readingsQueueRef.current.reduce(
              (acc, reading) => ({
                latitude: acc.latitude + reading.latitude,
                longitude: acc.longitude + reading.longitude,
                accuracy: acc.accuracy + reading.accuracy,
              }),
              { latitude: 0, longitude: 0, accuracy: 0 }
            );
            const count = readingsQueueRef.current.length;
            const averageLocation = {
              latitude: sum.latitude / count,
              longitude: sum.longitude / count,
              accuracy: sum.accuracy / count,
            };

            updateLocation(averageLocation.latitude, averageLocation.longitude);
          } else {
            console.error("Invalid coordinates:", latitude, longitude);
          }
        },
        (error) => {
          console.error("Error retrieving location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [onMapClick]);

  return (
    <MapContainer
      center={[busStops[0].lat, busStops[0].long]}
      zoom={14}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <HandleMapClick setCoordinates={onMapClick} />
      <Marker position={[geolocation.lat, geolocation.long]} icon={busIcon} />
      <Polyline pathOptions={{ color: "blue" }} positions={lineData205} />
      {busStops.map((stop, index) => (
        <Marker
          key={index}
          position={[stop.lat, stop.long]}
          icon={
            new L.Icon({
              iconUrl: markerIconPng,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })
          }
        />
      ))}
    </MapContainer>
  );
};

export default CustomMapContainer;
