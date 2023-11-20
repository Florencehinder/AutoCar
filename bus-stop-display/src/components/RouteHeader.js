// RouteHeader.js
import React from "react";

const RouteHeader = ({ route, destination }) => {
  return (
    <div className="w-full bg-blue-500 text-white p-8 text-10xl">
      {route} to {destination}
    </div>
  );
};

export default RouteHeader;
