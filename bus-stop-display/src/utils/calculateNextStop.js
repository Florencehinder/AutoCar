// utils/calculateNextStop.js

function calculateNextStop(velocityReadings, stops) {
  let currentStopIndex = -1;

  for (let i = 1; i < velocityReadings.length; i++) {
    if (velocityReadings[i - 1] > 0 && velocityReadings[i] <= 0) {
      // Found the point where velocity changes from positive to negative
      currentStopIndex = i;
      break;
    }
  }

  if (currentStopIndex === -1 || currentStopIndex >= stops.length - 1) {
    // No change found, or already at the last stop
    return null;
  }

  // Return the next stop after the current index
  return stops[currentStopIndex + 1];
}

export default calculateNextStop;
