import React, { useState, useEffect, useRef } from "react";
import RouteHeader from "./components/RouteHeader"; // Adjust the path as necessary
import MapContainer from "./components/MapContainer";
import FourSixtySix from "./data/routes/466.json";
import { stopPointRefs as BusStops } from "./data/custom/466/stop_point_refs";
import "leaflet/dist/leaflet.css";
import { getHaversineDistance } from "./utils/getHaversineDistance.js";
import { lineCoordinates } from "./data/custom/205/line_coordinates";
import { useLocation } from "./hooks";
import { shouldMoveToNextStop } from "./utils/calculateNextStop";

const line = FourSixtySix.TransXChange.Services.Service.StandardService;
const lineName = FourSixtySix.TransXChange.Services.Service.Lines.Line.LineName;

function App() {
  const route = 466;
  const [reverse, setReverse] = useState(false);
  const stops = reverse ? BusStops.outbound : BusStops.inbound;
  const { latitude, longitude } = useLocation();
  const [distanceHistory, setDistanceHistory] = useState([]);
  const [currentStopIndex, setCurrentStopIndex] = useState(25); // Assuming start at index 0
  const currentStop = stops[currentStopIndex];
  const nextStop =
    currentStopIndex < stops.length - 1 ? stops[currentStopIndex + 1] : null;
  const [clickOrGps, setClickOrGps] = useState("Use GPS");
  const [clickCoordinates, setClickCoordinates] = useState({
    latitude: currentStop.lat,
    longitude: currentStop.long,
  });
  const geoLocation = {
    latitude: clickOrGps === "Use GPS" ? latitude : clickCoordinates.latitude,
    longitude:
      clickOrGps === "Use GPS" ? longitude : clickCoordinates.longitude,
  };

  // State to store the calculated distance
  const [distanceToNextStop, setDistanceToNextStop] = useState(0);
  const handleResetAudio = () => {
    playedStops.current = new Set();
    setAudio(null); // Reset the audio state if needed
    // Add any other state resets here if necessary
  };
  const [audio, setAudio] = useState(null);
  const playedStops = useRef(new Set());

  useEffect(() => {
    if (nextStop && nextStop.atcoCode) {
      const audioPath = `./audio/${route}/${nextStop.atcoCode}.mp3`;
      console.log(`Loading audio from: ${audioPath}`); // Debugging

      const newAudio = new Audio(audioPath);
      setAudio(newAudio);

      // Cleanup function
      return () => {
        newAudio.pause();
        newAudio.currentTime = 0;
      };
    }
  }, [nextStop]);

  useEffect(() => {
    if (!nextStop) {
      return;
    }
    const distance = getHaversineDistance(
      geoLocation.latitude,
      geoLocation.longitude,
      nextStop.lat,
      nextStop.long
    );
    if (Math.abs(distance - distanceToNextStop) > 1) {
      // Adding a threshold to avoid minor changes
      setDistanceToNextStop(distance);
    }

    setDistanceHistory((prevHistory) => {
      if (prevHistory.includes(distance)) {
        return prevHistory;
      }
      return [...prevHistory, distance];
    });

    if (
      distance <= 150 &&
      audio &&
      !playedStops.current.has(currentStopIndex)
    ) {
      audio.play().catch((e) => {
        console.error("Error playing audio:", e);
      });
      playedStops.current.add(currentStopIndex);
    }
  }, [
    geoLocation.latitude,
    geoLocation.longitude,
    currentStopIndex,
    audio,
    stops,
    nextStop,
    distanceToNextStop,
  ]);

  useEffect(() => {
    // Determine if it's time to move to the next stop
    const shouldMove = shouldMoveToNextStop(
      distanceHistory,
      stops,
      currentStopIndex
    );

    if (shouldMove) {
      setCurrentStopIndex((prevState) => prevState + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distanceHistory]);

  const handleStartRoute = () => {
    // Find the nearest stop
    let shortestDistance = Number.MAX_VALUE;
    const nearestStopIndex = stops.reduce((nearestIndex, stop, index) => {
      const distanceToStop = getHaversineDistance(
        geoLocation.latitude,
        geoLocation.longitude,
        stop.lat,
        stop.long
      );
      if (nearestIndex === null || distanceToStop < shortestDistance) {
        shortestDistance = distanceToStop;
        return index;
      }
      return nearestIndex;
    }, null);

    // Set the nearest stop as the current stop
    if (nearestStopIndex !== null) {
      setCurrentStopIndex(nearestStopIndex);
    }

    if (audio) {
      audio.play().catch((e) => {
        console.error("Error playing audio after user interaction:", e);
      });
    }
  };

  return (
    <div className="App flex flex-col min-h-screen bg-white w-full">
      {/* RouteHeader sits above and is not vertically centered */}
      <RouteHeader
        onReverse={() => setReverse((prevState) => !prevState)}
        route={lineName}
        origin={line.Origin}
        destination={line.Destination}
        reverse={reverse}
        setClickOrGps={setClickOrGps}
        clickOrGps={clickOrGps}
        handleStartRoute={handleStartRoute}
        handleResetAudio={handleResetAudio}
      />

      <div className="px-10 py-3 flex flex-col gap-1">
        <p>
          Current stop: <b>{currentStop.name}</b>
        </p>
        {nextStop && (
          <p>
            Next stop: <b>{nextStop.name}</b>
          </p>
        )}
        <p>
          Distance to next stop: <b>{distanceToNextStop.toFixed(0)} meters</b>
        </p>
        {clickOrGps === "Use GPS" ? <p></p> : null}
      </div>

      <div className="h-full w-full relative none">
        <MapContainer
          geoLocation={geoLocation}
          clickOrGps={clickOrGps}
          onLocationUpdate={(lat, long) =>
            setClickCoordinates({ latitude: lat, longitude: long })
          }
          busStops={stops}
          lineCoordinates={
            reverse ? lineCoordinates.inbound : lineCoordinates.outbound
          }
        />
      </div>
    </div>
  );
}

export default App;
