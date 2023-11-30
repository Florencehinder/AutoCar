// RouteHeader.js
import { Swap } from "phosphor-react";
import React, { useState } from "react";

const RouteHeader = ({ route, origin, destination, onShowMap, showMap }) => {
  const [reverse, setReverse] = useState(false);
  const _destination = reverse ? origin : destination;

  return (
    <div className="flex w-full bg-blue-500 text-white p-10 text-6xl justify-between">
      <p>
        {route} to {_destination}
      </p>
      <div className="flex gap-10 align-center">
        <button
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded text-lg self-center"
          onClick={onShowMap}
        >
          {showMap ? "View Route" : "View Map"}
        </button>
        <button onClick={() => setReverse((prevState) => !prevState)}>
          <Swap />
        </button>
      </div>
    </div>
  );
};

export default RouteHeader;
