import React, { useState, useEffect, useRef } from "react";
import "./ProfileButton.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../Redux/Authentication/AuthenticationAction";
import { logout } from "../../Api/Service/Login";

const ProfileButton = ({ name }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    dispatch(logoutUser());
    navigate("/login");
  };

  const getFirstLetter = () => {
    const firstLetter = name ? name.charAt(0) : "";
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
          <p>{name}</p>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
