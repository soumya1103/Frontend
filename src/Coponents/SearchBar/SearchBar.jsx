import React, { useState } from "react";
import "./SearchBar.css";
import search from "../../Images/search-icon.svg";

const SearchBar = ({ placeholder, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="search-input"
      />
      <button className="search-button" onClick={() => onSearch(searchTerm)}>
        <img src={search} alt="search" width="55%" />
      </button>
    </div>
  );
};

export default SearchBar;
