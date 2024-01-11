import { useEffect, useRef, useState } from "react";
import { getHaversineDistance } from "../utils/getHaversineDistance";

export function useLocationAndVelocity() {
  const [locationData, setLocationData] = useState({
    latitude: 0,
    longitude: 0,
    velocity: 0,
  });
  const watchIdRef = useRef(null);
  const previousLocationRef = useRef(null);

  useEffect(() => {
    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      const currentTime = position.timestamp;

      let velocity = 0;
      const previousLocation = previousLocationRef.current;

      if (previousLocation) {
        const timeElapsed = (currentTime - previousLocation.timestamp) / 1000; // Convert to seconds

        // Log the time elapsed between this and the previous reading
        console.log(`Time elapsed since last reading: ${timeElapsed} seconds`);

        const distance = getHaversineDistance(
          previousLocation.latitude,
          previousLocation.longitude,
          latitude,
          longitude
        );
        velocity = timeElapsed > 0 ? distance / timeElapsed : 0; // m/s
      }

      // Log the new GPS point
      console.log(
        `New GPS Point: Latitude: ${latitude}, Longitude: ${longitude}`
      );

      setLocationData({ latitude, longitude, velocity });
      previousLocationRef.current = {
        latitude,
        longitude,
        timestamp: currentTime,
      };
    };

    const handleError = (error) => {
      console.error("Error retrieving location:", error);
    };

    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0,
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
