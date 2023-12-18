import React from "react";
import { Bus } from "phosphor-react";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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

const CustomMapContainer = ({
  busStops,
  geolocation,
  onLocationUpdate,
  clickOrGps,
}) => {
  return (
    <MapContainer
      center={[busStops[0].lat, busStops[0].long]}
      zoom={14}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {clickOrGps === "Use Map Click" ? (
        <HandleMapClick setCoordinates={onLocationUpdate} />
      ) : null}
      <Marker
        position={[geolocation.latitude, geolocation.longitude]}
        icon={busIcon}
      />
      {/* <Polyline pathOptions={{ color: "blue" }} positions={lineCoordinates} /> */}
      {busStops.map((stop, index) => (
        <Marker
          key={index}
          position={[stop.lat, stop.long]}
          icon={
            new L.Icon({
              iconUrl: markerIconPng,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              className: "white",
            })
          }
        />
      ))}
    </MapContainer>
  );
};

export default CustomMapContainer;
