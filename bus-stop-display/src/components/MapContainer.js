import React, { useEffect, useState } from "react";
import { Bus } from "phosphor-react";
import L from "leaflet";
import "leaflet.offline"; // Import Leaflet.Offline
import { renderToStaticMarkup } from "react-dom/server";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
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

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

const CustomMapContainer = ({
  busStops,
  onLocationUpdate,
  clickOrGps,
  geoLocation,
  lineCoordinates,
}) => {
  const [map, setMap] = useState();
  const [zoomLevel, setZoomLevel] = useState(16); // Initialize zoom level state

  // When the map is created, save the map instance and set up event listeners
  const handleMapCreated = (mapInstance) => {
    setMap(mapInstance);

    mapInstance.on("zoomend", () => {
      setZoomLevel(mapInstance.getZoom()); // Update zoom level on user interaction
    });
  };

  useEffect(() => {
    if (map) {
      // Create a Leaflet.Offline layer and configure it
      const tileLayerOffline = L.tileLayer.offline(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          minZoom: 13,
        }
      );

      // Add the Leaflet.Offline layer to the map
      tileLayerOffline.addTo(map);

      // Create a control to save tiles
      const controlSaveTiles = L.control.savetiles(tileLayerOffline, {
        zoomlevels: [16], // optional zoomlevels to save, default current zoomlevel
      });

      // Add the control to the map
      controlSaveTiles.addTo(map);
    }
  }, [map]);

  const center = [
    geoLocation.latitude || busStops[0].lat,
    geoLocation.longitude || busStops[0].long,
  ];

  return (
    <MapContainer
      center={center}
      zoom={zoomLevel}
      style={{ height: "100vh", width: "100vw" }}
      whenCreated={handleMapCreated}
    >
      <ChangeView center={center} zoom={zoomLevel} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {clickOrGps === "Use Map Click" ? (
        <HandleMapClick setCoordinates={onLocationUpdate} />
      ) : null}
      <Marker
        position={[geoLocation.latitude, geoLocation.longitude]}
        icon={busIcon}
      />
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
