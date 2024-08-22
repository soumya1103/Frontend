import React, { useState, useEffect, useRef } from "react";
import "./ProfileButton.css";

const ProfileButton = ({ firstName, lastName }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const getFirstLetter = () => {
    const firstLetter = firstName ? firstName.charAt(0) : "";
    return firstLetter.toUpperCase();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="profile-button-container" ref={dropdownRef}>
      <div className="profile-button" onClick={toggleDropdown}>
        {getFirstLetter()}
      </div>
      {showDropdown && (
        <div className="dropdown-menu">
          <p>
            {firstName} {lastName}
          </p>
          <button className="logout-btn">Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
