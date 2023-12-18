import { Swap } from "phosphor-react";
import React from "react";
import { SelectMenu } from "./SelectMenu";

const RouteHeader = ({
  route,
  origin,
  destination,
  reverse,
  onReverse,
  clickOrGps,
  setClickOrGps,
}) => {
  const _destination = reverse ? origin : destination;
  const _origin = reverse ? destination : origin;

  return (
    <div className="flex w-full bg-blue-500 text-white px-10 py-4 text-4xl justify-between flex-wrap gap-4">
      <div className="flex gap-10 align-center">
        <p>
          {route} from {_origin} to {_destination}
        </p>
        <button onClick={onReverse}>
          <Swap />
        </button>
      </div>

      <div>
        <SelectMenu
          options={["Use GPS", "Use Map Click"]}
          value={clickOrGps}
          onChange={(e) => setClickOrGps(e.target.value)}
        />
      </div>
    </div>
  );
};

export default RouteHeader;
