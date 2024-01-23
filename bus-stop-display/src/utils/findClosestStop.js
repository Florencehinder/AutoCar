import { getHaversineDistance } from "./getHaversineDistance.js";

export const findClosestStop = (geoLocation, stops) => {
  let minDistance = Infinity;
  let closestStopIndex = -1;

  stops.forEach((stop, index) => {
    const distance = getHaversineDistance(
      geoLocation.latitude,
      geoLocation.longitude,
      stop.lat,
      stop.long
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestStopIndex = index;
    }
  });

  return closestStopIndex;
};
