import React, { useState } from "react";
import RouteHeader from "./components/RouteHeader"; // Adjust the path as necessary
import CurrentStop from "./components/CurrentStop"; // Adjust the path as necessary
import { MapContainer, TileLayer, Marker } from "react-leaflet"; //Marker, useMapEvents
import TwoOhFive from "./data/routes/205.json";
import BusStops from "./data/custom/205.json";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from "leaflet";

function App() {
  const line = TwoOhFive.TransXChange.Services.Service.Lines.Line;
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="App flex flex-col min-h-screen bg-white w-full">
      {/* RouteHeader sits above and is not vertically centered */}
      <RouteHeader
        showMap={showMap}
        onShowMap={() => setShowMap((prevState) => !prevState)}
        route={line.LineName}
        origin={line.OutboundDescription.Origin}
        destination={line.OutboundDescription.Destination}
      />

      <div className="h-full w-full relative">
        {showMap ? (
          <MapContainer
            center={[BusStops.custom[0].lat, BusStops.custom[0].long]}
            zoom={14}
            style={{ height: "100vh", width: "100vw" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {BusStops.custom.map((stop, index) => (
              <Marker
                key={index}
                position={[stop.lat, stop.long]}
                icon={
                  new Icon({
                    iconUrl: markerIconPng,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                  })
                }
              />
            ))}
          </MapContainer>
        ) : (
          <CurrentStop stopName="Ellic Close" />
        )}
      </div>
    </div>
  );
}

export default App;
