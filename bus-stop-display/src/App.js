//// app.js file

// Import the required dependencies
import React, { useState } from "react";
import RouteHeader from "./components/RouteHeader"; // Adjust the path as necessary
import CurrentStop from "./components/CurrentStop"; // Adjust the path as necessary
import MapContainer from "./components/MapContainer";
import TwoOhFive from "./data/routes/205.json";
import BusStops from "./data/custom/205.json";
import "leaflet/dist/leaflet.css";

function App() {
  const line = TwoOhFive.TransXChange.Services.Service.Lines.Line;
  const [showMap, setShowMap] = useState(false);

  const geolocation = { lat: 51.18153, long: 0.38451 };

  //// Things to still add:
  // - Current GPS coordinates
  // - Route Line Displayed
  // - Play Audio when within 150 ms

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
          <MapContainer BusStops={BusStops} geolocation={geolocation} />
        ) : (
          <CurrentStop stopName="Ellic Close" />
        )}
      </div>
    </div>
  );
}

export default App;
