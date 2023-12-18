import { useEffect, useRef, useState } from "react";
import { getHaversineDistance } from "../utils/getHaversineDistance";

export function useLocationAndVelocity(currentStopLat, currentStopLong) {
  const [locationData, setLocationData] = useState({
    latitude: 0,
    longitude: 0,
    relativeVelocity: 0,
  });
  const watchIdRef = useRef(null);
  const previousTimestampRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentTime = position.timestamp;

          if (!isNaN(latitude) && !isNaN(longitude)) {
            const distance = getHaversineDistance(
              currentStopLat,
              currentStopLong,
              latitude,
              longitude
            );

            let relativeVelocity = 0;
            const previousTimestamp = previousTimestampRef.current;
            if (previousTimestamp) {
              const timeElapsed = (currentTime - previousTimestamp) / 1000; // Convert to seconds
              relativeVelocity = timeElapsed > 0 ? distance / timeElapsed : 0; // m/s
            }

            setLocationData({ latitude, longitude, relativeVelocity });
            previousTimestampRef.current = currentTime;
          } else {
            console.error("Invalid coordinates:", latitude, longitude);
          }
        },
        (error) => {
          console.error("Error retrieving location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [currentStopLat, currentStopLong]); // Add these as dependencies

  return locationData;
}
