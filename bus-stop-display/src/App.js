import React, { useState, useEffect } from "react";
import RouteHeader from "./components/RouteHeader"; // Adjust the path as necessary
import MapContainer from "./components/MapContainer";
import FourSixtySix from "./data/routes/466.json";
import { stopPointRefs as BusStops } from "./data/custom/466/stop_point_refs";
import "leaflet/dist/leaflet.css";
import { getHaversineDistance } from "./utils/getHaversineDistance.js";
import { lineCoordinates } from "./data/custom/205/line_coordinates";
import { useLocationAndVelocity } from "./hooks";
// import useAudioAlert from "./hooks/useAudioAlert.ts";

const line = FourSixtySix.TransXChange.Services.Service.StandardService;
const lineName = FourSixtySix.TransXChange.Services.Service.Lines.Line.LineName;

function App() {
  const [reverse, setReverse] = useState(false);
  const stops = reverse ? BusStops.outbound : BusStops.inbound;
  const { latitude, longitude, velocity } = useLocationAndVelocity();
  const currentStop = stops[34];
  const nextStop = stops[36];
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
  console.log(latitude);
  console.log({ geoLocation });

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
      geoLocation.latitude,
      geoLocation.longitude,
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
  }, [geoLocation.latitude, geoLocation.longitude, nextStop, audio]);

  // Button for GPS or  "cick and track" (Jonathan)
  // Calculate the velocity to change the next stop (Jonathan)
  // Play audio once when 150 m's away (Flo)

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
      />

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
        {clickOrGps === "Use GPS" ? (
          <p>
            Current velocity: <b>{velocity.toFixed(0)} m/s</b>
          </p>
        ) : null}
      </div>

      <div className="h-full w-full relative none">
        <MapContainer
          clickOrGps={clickOrGps}
          onLocationUpdate={(lat, long) =>
            setClickCoordinates({ latitude: lat, longitude: long })
          }
          busStops={stops}
          lineCoordinates={
            reverse ? lineCoordinates.inbound : lineCoordinates.outbound
          }
          geolocation={geoLocation}
        />
      </div>
    </div>
  );
}

export default App;
