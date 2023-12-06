import { Swap } from "phosphor-react";
import React from "react";

const RouteHeader = ({
  route,
  origin,
  destination,
  onShowMap,
  showMap,
  reverse,
  onReverse,
}) => {
  const _destination = reverse ? origin : destination;
  const _origin = reverse ? destination : origin;

  return (
    <div className="flex w-full bg-blue-500 text-white p-10 text-6xl justify-between flex-wrap gap-10">
      <p>
        {route} from {_origin} to {_destination}
      </p>
      <div className="flex gap-10 align-center">
        <button
          className="whitespace-nowrap bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded text-lg self-center"
          onClick={onShowMap}
        >
          {showMap ? "View Route" : "View Map"}
        </button>
        <button onClick={onReverse}>
          <Swap />
        </button>
      </div>
    </div>
  );
};

export default RouteHeader;
