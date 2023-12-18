import React, { useCallback, useState, useEffect } from "react";
import RouteHeader from "./components/RouteHeader"; // Adjust the path as necessary
import NextStop from "./components/NextStop"; // Adjust the path as nec essary
import MapContainer from "./components/MapContainer";
import FourSixtySix from "./data/routes/466.json";
import { stopPointRefs as BusStops } from "./data/custom/466/stop_point_refs";
import "leaflet/dist/leaflet.css";
import { getHaversineDistance } from "./utils/getHaversineDistance.js";
import { lineCoordinates } from "./data/custom/205/line_coordinates";
// import useAudioAlert from "./hooks/useAudioAlert.ts";

const line = FourSixtySix.TransXChange.Services.Service.StandardService;
const lineName = FourSixtySix.TransXChange.Services.Service.Lines.Line.LineName;

function App() {
  const [showMap, setShowMap] = useState(false);
  const [reverse, setReverse] = useState(false);
  const stops = reverse ? BusStops.outbound : BusStops.inbound;
  const [geolocation, setGeolocation] = useState({
    lat: 51.18153,
    long: 0.38451,
  });
  const currentStop = stops[0];
  const nextStop = stops[2];
  console.log(stops);
  // State to store the calculated distance
  const [distanceToNextStop, setDistanceToNextStop] = useState(0);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    if (nextStop && nextStop.atcoCode) {
      const audioPath = `./audio/${nextStop.atcoCode}.mp3`;

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

  //// Things to add:
  // Button for GPS or  "cick and track" (Jonathan)
  // Calculate the velocity to change the next stop (Jonathan)
  // Play audio once when 150 m's away (Flo)

  return (
    <div className="App flex flex-col min-h-screen bg-white w-full">
      {/* RouteHeader sits above and is not vertically centered */}
      <RouteHeader
        showMap={showMap}
        onReverse={() => setReverse((prevState) => !prevState)}
        onShowMap={() => setShowMap((prevState) => !prevState)}
        route={lineName}
        origin={line.Origin}
        destination={line.Destination}
        reverse={reverse}
      />
      {showMap && (
        <div className="px-10 py-3 flex flex-col gap-1">
          <p>
            Current stop: <b>{currentStop.name}</b>
          </p>
          <p>
            Next stop: <b>{nextStop.name}</b>
          </p>
          <p>
            Distance to next stop: <b>{distanceToNextStop.toFixed(0)} meters</b>
          </p>
        </div>
      )}

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
          <NextStop stopName={currentStop.name} />
        )}
      </div>
    </div>
  );
}

export default App;
