import React, { useState } from "react";
import "./ProfileButton.css";
import Button from "./Button";

const ProfileButton = ({ firstName, lastName }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getInitials = (name) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("");
    return initials.toUpperCase();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="profile-button-container">
      <div className="profile-button" onClick={toggleDropdown}>
        {getInitials(firstName)}
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
