import React from "react";

const Dropdown = ({ options, value, onChange }) => {
  return (
    <div>
      <label>Select Month: </label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
