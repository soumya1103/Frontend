import React, { useState, useEffect, useRef } from "react";
import "./ProfileButton.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../Redux/Authentication/AuthenticationAction";
import { logout } from "../../Api/Service/Login";
import Button from "../Button/Button";
import ConfirmationModal from "../Modal/ConfirmationModal";

const ProfileButton = ({ name }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    dispatch(logoutUser());
    setShowConfirmationModal(false);
    navigate("/login");
  };

  const handleLogoutBtn = () => {
    setShowConfirmationModal(true);
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
          <Button onClick={handleLogoutBtn} className="logout-btn">
            Logout
          </Button>
        </div>
      )}
      {showConfirmationModal && (
        <ConfirmationModal show={showConfirmationModal} onClose={() => setShowConfirmationModal(false)} onConfirm={handleLogout} isLogout={true} />
      )}
    </div>
  );
};

export default ProfileButton;
