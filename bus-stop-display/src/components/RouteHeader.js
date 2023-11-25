// RouteHeader.js
import { Swap } from "phosphor-react";
import React, { useState } from "react";

const RouteHeader = ({ route, origin, destination }) => {
  const [reverse, setReverse] = useState(false);
  const _destination = reverse ? origin : destination;

  return (
    <div className="flex w-full bg-blue-500 text-white p-10 text-6xl justify-between">
      <p>
        {route} to {_destination}
      </p>
      <button onClick={() => setReverse((prevState) => !prevState)}>
        <Swap />
      </button>
    </div>
  );
};

export default RouteHeader;
