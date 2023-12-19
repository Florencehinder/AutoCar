// utils/calculateNextStop.js

// This function determines if it's time to update to the next stop.
// It requires a history of distances to the next stop and the stops array.
function calculateNextStop(distanceHistory, stops, currentStopIndex) {
  if (distanceHistory.length < 2) {
    // Need at least two readings to determine a trend
    return currentStopIndex;
  }

  const latestDistance = distanceHistory[distanceHistory.length - 1];
  const previousDistance = distanceHistory[distanceHistory.length - 2];

  // Check if the bus has started moving away from the stop (distance increasing)
  // and the latest distance is less than 100 meters
  if (latestDistance > previousDistance && latestDistance < 100) {
    // Move to the next stop if there is one
    return currentStopIndex < stops.length - 1
      ? currentStopIndex + 1
      : currentStopIndex;
  }

  // No change in stop
  return currentStopIndex;
}

export default calculateNextStop;
