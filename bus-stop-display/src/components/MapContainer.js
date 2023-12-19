import React, { useEffect, useState } from "react";
import { Bus } from "phosphor-react";
import L from "leaflet";
import "leaflet.offline";
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

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const CustomMapContainer = ({
  busStops,
  geolocation,
  onLocationUpdate,
  clickOrGps,
  geoLocation,
}) => {
  const [map, setMap] = useState();

  useEffect(() => {
    if (map) {
      const tileLayerOffline = L.tileLayer.offline(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          minZoom: 13,
        }
      );

      tileLayerOffline.addTo(map);

      const controlSaveTiles = L.control.savetiles(tileLayerOffline, {
        zoomlevels: [13, 14, 15, 16], // optional zoomlevels to save, default current zoomlevel
      });

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
      zoom={12}
      style={{ height: "100vh", width: "100vw" }}
      whenCreated={setMap}
    >
      <ChangeView center={center} zoom={12} />
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
