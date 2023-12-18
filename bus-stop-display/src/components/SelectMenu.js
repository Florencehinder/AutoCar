import React from "react";

export const SelectMenu = ({ value, onChange, options }) => {
  return (
    <div className="w-full max-w-xs mx-auto">
      <select
        id="simple-select"
        value={value}
        onChange={onChange}
        className="mt-1 block w-full pl-3 pr-16 py-2 text-base border-gray-300 
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                   sm:text-sm rounded-md appearance-none bg-no-repeat" // Adjusted padding here
        style={{
          backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" fill-rule="evenodd"/></svg>')`,
          backgroundPosition: "right 0.5rem center",
          backgroundSize: "1.5em 1.5em",
        }}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
