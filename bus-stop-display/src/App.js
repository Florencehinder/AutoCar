import React, { useState } from "react";
import RouteHeader from "./components/RouteHeader"; // Adjust the path as necessary
import CurrentStop from "./components/CurrentStop"; // Adjust the path as necessary
import { MapContainer, TileLayer, Marker } from "react-leaflet"; //Marker, useMapEvents
import TwoOhFive from "./data/routes/205.json";
import BusStops from "./data/custom/205.json";

function App() {
  const line = TwoOhFive.TransXChange.Services.Service.Lines.Line;

  return (
    <div className="App flex flex-col min-h-screen bg-white w-full">
      {/* RouteHeader sits above and is not vertically centered */}
      <RouteHeader
        route={line.LineName}
        origin={line.OutboundDescription.Origin}
        destination={line.OutboundDescription.Destination}
      />
      {/* Fullscreen Carousel */}
      <div className="carousel w-full flex-1">
        {/* Main View - Carousel */}
        <div className="carousel-item w-full h-full">
          {/* Container for CurrentStop, which takes up the remaining space */}
          <div className="flex-1 flex items-center w-full">
            <CurrentStop stopName="Ellic Close" />
          </div>
        </div>
        {/* Map View - Carousel */}
        <div className="carousel-item w-full h-full">
          {/* Container for CurrentStop, which takes up the remaining space */}
          <div className="flex-1 flex items-center w-full">
            <div className="h-full w-full relative">
              <MapContainer
                center={[BusStops.custom[0].lat, BusStops.custom[0].long]}
                zoom={14}
                style={{ height: "100vh", width: "100vw" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {BusStops.custom.map((stop, index) => (
                  <Marker key={index} position={[stop.lat, stop.long]} />
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
