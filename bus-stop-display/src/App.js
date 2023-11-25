import React from "react";
import RouteHeader from "./components/RouteHeader"; // Adjust the path as necessary
import CurrentStop from "./components/CurrentStop"; // Adjust the path as necessary
import TwoOhFive from "./data/205.json";

function App() {
  const line = TwoOhFive.TransXChange.Services.Service.Lines.Line;
  return (
    <div className="App flex flex-col min-h-screen bg-white w-full">
      {/* RouteHeader sits above and is not vertically centered */}
      <RouteHeader
        route={line.LineName}
        origin={line.OutboundDescription.Origin}
        destination={line.OutboundDescription.Destination}
      />

      {/* Container for CurrentStop, which takes up the remaining space */}
      <div className="flex-1 flex items-center w-full">
        <CurrentStop stopName="Ellic Close" />
      </div>
    </div>
  );
}

export default App;
