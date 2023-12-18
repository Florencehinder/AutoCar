import { useEffect, useRef, useState } from "react";
import { getHaversineDistance } from "../utils/getHaversineDistance";

export function useLocationAndVelocity(currentStopLat, currentStopLong) {
  const [locationData, setLocationData] = useState({
    latitude: 0,
    longitude: 0,
    averageRelativeVelocity: 0,
  });
  const watchIdRef = useRef(null);
  const relativeVelocitiesRef = useRef([]); // Store relative velocities
  const previousLocationRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentTime = position.timestamp;

          if (!isNaN(latitude) && !isNaN(longitude)) {
            const newReading = {
              latitude,
              longitude,
              timestamp: currentTime,
            };
            const previousLocation = previousLocationRef.current;

            if (previousLocation) {
              const timeElapsed =
                (currentTime - previousLocation.timestamp) / 1000; // Convert to seconds
              const distance = getHaversineDistance(
                previousLocation.latitude,
                previousLocation.longitude,
                newReading.latitude,
                newReading.longitude
              );
              const relativeVelocity =
                timeElapsed > 0 ? distance / timeElapsed : 0; // m/s

              // Add to velocities array
              relativeVelocitiesRef.current.push(relativeVelocity);

              if (relativeVelocitiesRef.current.length > 10) {
                // Remove the oldest velocity value
                relativeVelocitiesRef.current.shift();
              }

              // Calculate average relative velocity
              const sumVelocities = relativeVelocitiesRef.current.reduce(
                (acc, vel) => acc + vel,
                0
              );
              const averageRelativeVelocity =
                sumVelocities / relativeVelocitiesRef.current.length;

              setLocationData({ latitude, longitude, averageRelativeVelocity });
            }

            previousLocationRef.current = newReading;
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
  }, []);

  return locationData;
}
