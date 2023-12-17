// NextStop.js
import React from "react";
import { Bus } from "phosphor-react";

const NextStop = ({ stopName }) => {
  return (
    <div className="flex items-center align-middle justify-left text-blue-500 px-8 text-10xl gap-8">
      <Bus size={160} />
      {stopName}
    </div>
  );
};

export default NextStop;