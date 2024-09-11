import React from "react";
import "./SearchBar.css";
import search from "../../Images/search-icon.svg";

const SearchBar = ({ placeholder, handleSearch, handleOnChange }) => {
  return (
    <div className="search-bar-container">
      <input type="text" placeholder={placeholder} className="search-input" onChange={(e) => handleOnChange(e)} />
      <button className="search-button" onClick={handleSearch}>
        <img src={search} alt="search" width="55%" />
      </button>
    </div>
  );
};

export default SearchBar;
