import React, { useState } from "react";
import "./ProfileButton.css";

const ProfileButton = ({ firstName, lastName }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getFirstLetter = () => {
    const firstLetter = firstName ? firstName.charAt(0) : "";
    return firstLetter.toUpperCase();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="profile-button-container">
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
