import React, { useCallback, useState, useEffect } from "react";
import RouteHeader from "./components/RouteHeader"; // Adjust the path as necessary
import CurrentStop from "./components/CurrentStop"; // Adjust the path as necessary
import MapContainer from "./components/MapContainer";
import TwoOhFive from "./data/routes/205.json";
import BusStops from "./data/custom/205_stop_point_refs.json";
import "leaflet/dist/leaflet.css";
import { getHaversineDistance } from "./utils/getHaversineDistance.ts";
import { lineCoordinates } from "./data/custom/205_line_coordinates";
// import useAudioAlert from "./hooks/useAudioAlert.ts";

function App() {
  const line = TwoOhFive.TransXChange.Services.Service.Lines.Line;
  const [showMap, setShowMap] = useState(false);
  const [reverse, setReverse] = useState(false);
  const stops = reverse ? BusStops.inbound : BusStops.outbound;
  const [geolocation, setGeolocation] = useState({
    lat: 51.18153,
    long: 0.38451,
  });
  const currentStop = stops[0];
  const nextStop = stops[2];
  console.log(nextStop);
  console.log(nextStop.atcoCode);
  // State to store the calculated distance
  const [distanceToNextStop, setDistanceToNextStop] = useState(0);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    console.log("useEffect for setting audio is running");
    console.log("nextStop:", nextStop);

    if (nextStop && nextStop.atcoCode) {
      const audioPath = `./audio/${nextStop.atcoCode}.mp3`;
      console.log("audioPath:", audioPath);

      const newAudio = new Audio(audioPath);
      setAudio(newAudio);

      return () => {
        if (newAudio) {
          newAudio.pause();
          newAudio.currentTime = 0;
        }
      };
    }
  }, [nextStop]);

  useEffect(() => {
    const distance = getHaversineDistance(
      geolocation.lat,
      geolocation.long,
      nextStop.lat,
      nextStop.long
    );
    setDistanceToNextStop(distance);

    if (distance <= 150 && audio) {
      audio.play().catch((e) => {
        console.error("Error playing audio:", e);
        // Optionally, show an error message to the user
      });
    }
  }, [geolocation, nextStop, audio]);

  const handleGeolocation = useCallback(
    (lat, long) => setGeolocation({ lat, long }),
    []
  );

  //// Things to still add:
  // Set "current stop" on the list == stop[0]
  // Calculate the "next stop" as "current stop" +1
  // Calculate the distance between geolocation and "nextStop" once it changes from closer to further away, "nextStop" becomes "currentStop"
  // Calculate how far you are from the current stop and if you pass the current stop (geolocation)
  // Turn off GPS location and on "cick and track"
  
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
            lineCoordinates={
              reverse ? lineCoordinates.inbound : lineCoordinates.outbound
            }
          />
        ) : (
          <CurrentStop stopName={currentStop.name} />
        )}
      </div>
    </div>
  );
}

export default App;
