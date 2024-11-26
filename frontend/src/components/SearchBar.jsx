import React from "react";

const SearchBar = ({ value, onChange, onClear }) => {
  return (
    <div>
      <label>Search Transaction: </label>
      <input
        type="text"
        placeholder="Search by title, description, or price"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button onClick={onClear}>Clear</button>
    </div>
  );
};

export default SearchBar;
