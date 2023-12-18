import { useEffect, useRef, useState } from "react";
import { getHaversineDistance } from "../utils/getHaversineDistance";

export function useLocationAndVelocity() {
  const [locationData, setLocationData] = useState({
    latitude: 0,
    longitude: 0,
    velocity: 0,
  });
  const watchIdRef = useRef(null);
  const readingsQueueRef = useRef([]);
  const previousLocationRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const currentTime = position.timestamp;

          if (!isNaN(latitude) && !isNaN(longitude)) {
            const newReading = {
              latitude,
              longitude,
              accuracy,
              timestamp: currentTime,
            };
            readingsQueueRef.current.push(newReading);

            if (readingsQueueRef.current.length > 100) {
              readingsQueueRef.current.shift();
            }

            const sum = readingsQueueRef.current.reduce(
              (acc, reading) => ({
                latitude: acc.latitude + reading.latitude,
                longitude: acc.longitude + reading.longitude,
              }),
              { latitude: 0, longitude: 0 }
            );
            const count = readingsQueueRef.current.length;
            const averageLocation = {
              latitude: sum.latitude / count,
              longitude: sum.longitude / count,
            };

            let velocity = 0;
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
              velocity = timeElapsed > 0 ? distance / timeElapsed : 0; // m/s
            }
            setLocationData({ ...averageLocation, velocity });
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
