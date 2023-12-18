import React from "react";

export const SelectMenu = ({ value, onChange, options }) => {
  return (
    <div className="w-full max-w-xs mx-auto">
      <select
        id="simple-select"
        value={value}
        onChange={onChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                   sm:text-sm rounded-md"
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
