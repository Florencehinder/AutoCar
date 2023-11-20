import React from "react";
import RouteHeader from "./components/RouteHeader"; // Adjust the path as necessary
import CurrentStop from "./components/CurrentStop"; // Adjust the path as necessary

function App() {
  return (
    <div className="App flex flex-col min-h-screen bg-white w-full">
      {/* RouteHeader sits above and is not vertically centered */}
      <RouteHeader route="205" destination="Tonbridge" />

      {/* Container for CurrentStop, which takes up the remaining space */}
      <div className="flex-1 flex items-center w-full">
        <CurrentStop stopName="Ellic Close" />
      </div>
    </div>
  );
}

export default App;
