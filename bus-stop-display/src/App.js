import React, { useCallback, useState, useEffect } from "react";
import RouteHeader from "./components/RouteHeader"; // Adjust the path as necessary
import CurrentStop from "./components/CurrentStop"; // Adjust the path as necessary
import MapContainer from "./components/MapContainer";
import TwoOhFive from "./data/routes/205.json";
import BusStops from "./data/custom/205.json";
import "leaflet/dist/leaflet.css";
import { getHaversineDistance } from "./utils/getHaversineDistance.ts";

function App() {
  const line = TwoOhFive.TransXChange.Services.Service.Lines.Line;
  const [showMap, setShowMap] = useState(false);
  const [reverse, setReverse] = useState(false);
  const stops = reverse ? BusStops.inbound : BusStops.outbound;
  const [geolocation, setGeolocation] = useState({
    lat: 51.18153,
    long: 0.38451,
  });
  const nextStop = { lat: 51.174772, long: 0.377919 };

  // State to store the calculated distance
  const [distanceToNextStop, setDistanceToNextStop] = useState(0);

  useEffect(() => {
    // Calculate the distance
    const distance = getHaversineDistance(
      geolocation.lat,
      geolocation.long,
      nextStop.lat,
      nextStop.long
    );

    // Update the distance state
    setDistanceToNextStop(distance);
  }, [geolocation]); // Recalculate if the geolocation changes

  const handleGeolocation = useCallback(
    (lat, long) => setGeolocation({ lat, long }),
    []
  );
  console.log(geolocation);
  //// Things to still add:
  // - Route Line Displayed
  // - Play Audio when within 150 ms

  return (
    <div className="App flex flex-col min-h-screen bg-white w-full">
      {/* RouteHeader sits above and is not vertically centered */}
      <RouteHeader
        showMap={showMap}
        onReverse={() => setReverse((prevState) => !prevState)}
        onShowMap={() => setShowMap((prevState) => !prevState)}
        route={line.LineName}
        origin={line.OutboundDescription.Origin}
        destination={line.OutboundDescription.Destination}
        reverse={reverse}
      />
      <div>
        <p>Distance to next stop: {distanceToNextStop.toFixed(2)} meters</p>
      </div>

      <div className="h-full w-full relative">
        {showMap ? (
          <MapContainer
            busStops={stops}
            geolocation={geolocation}
            onMapClick={handleGeolocation}
          />
        ) : (
          <CurrentStop stopName={stops[0].name} />
        )}
      </div>
    </div>
  );
}

export default App;
