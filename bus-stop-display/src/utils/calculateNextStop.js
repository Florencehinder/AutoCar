// utils/calculateNextStop.js

export function shouldMoveToNextStop(distanceHistory, stops, currentStopIndex) {
  if (distanceHistory.length < 2) {
    // Need at least two readings to determine a trend
    return false;
  }

  const latestDistance = distanceHistory[distanceHistory.length - 1];
  const previousDistance = distanceHistory[distanceHistory.length - 2];

  // First, check if the latest distance is less than 150 meters
  if (latestDistance < 150) {
    // Then check if the bus has started moving away from the stop (distance increasing)
    if (latestDistance > previousDistance) {
      // Move to the next stop if there is one
      return true;
    }
  }

  // No change in stop
  return false;
}
