import React from "react";
import "./SearchBar.css";
import search from "../../Images/search-icon.svg";

const SearchBar = ({ placeholder, handleSearch, handleOnChange }) => {
  return (
    <div data-testid="search-container" className="search-bar-container">
      <input
        type="text"
        placeholder={placeholder}
        className="search-input"
        onChange={(e) => handleOnChange(e)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <button className="search-button" onClick={handleSearch}>
        <img src={search} alt="search" width="55%" />
      </button>
    </div>
  );
};

export default SearchBar;
