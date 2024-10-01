import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import "./ProfileButton.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../Redux/Authentication/AuthenticationAction";
import { logout } from "../../Api/Service/Login";
import ConfirmationModal from "../Modal/ConfirmationModal";
import Modal from "../Modal/Modal";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { getUsersByCredential, updateUser } from "../../Api/Service/UserService";
import Toast from "../Toast/Toast";

const ProfileButton = ({ name }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [userData, setUserData] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");

  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);

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

  const handlePasswordChange = () => {
    setShowModal(true);
  };

  const handleSetUser = async () => {
    try {
      const response = await getUsersByCredential(auth.userCredential);
      setUserData(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    handleSetUser();
  }, []);

  const handleSubmit = async () => {
    try {
      const encryptedPassword = btoa(password);
      console.log({ encryptedPassword, password });

      const { data } = await getUsersByCredential(auth.userCredential);

      const userDataObj = {
        ...userData,
        password: encryptedPassword,
      };

      const response = await updateUser(userDataObj, data.userId);
      if (response.status === 200) {
        setToastMessage(response.data.message);
        setShowToast(true);
        setToastType("success");
      }
    } catch (error) {
      setToastMessage(error.response.data.message);
      setShowToast(true);
      setToastType("error");
    } finally {
      setShowModal(false);
    }
  };

  const handleInputChange = (e) => {
    setPassword(e.target.value);
  };

  const resetForm = () => {
    setPassword("");
    setErrors("");
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

  const modalDimensions =
    errors.categoryId || errors.bookTitle || errors.bookAuthor || errors.bookRating || errors.bookCount
      ? { height: "532px", width: "470px" }
      : { height: "80px", width: "360px" };
  return (
    <div className="profile-button-container" ref={dropdownRef}>
      <div className="profile-button" onClick={toggleDropdown}>
        {getFirstLetter()}
      </div>
      {showDropdown && (
        <div className="dropdown-menu">
          {auth.role === "ROLE_USER" ? "" : <p>{name}</p>}
          {auth.role === "ROLE_USER" ? (
            <button onClick={handlePasswordChange} className="dropdown-btn">
              Change Password
            </button>
          ) : (
            ""
          )}
          <button onClick={handleLogoutBtn} className="dropdown-btn">
            Logout
          </button>
        </div>
      )}
      {showConfirmationModal && (
        <ConfirmationModal show={showConfirmationModal} onClose={() => setShowConfirmationModal(false)} onConfirm={handleLogout} isLogout={true} />
      )}
      {showModal && (
        <Modal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
          height={modalDimensions.height}
          width={modalDimensions.width}
        >
          <Input
            label="Change Password"
            name="changePassword"
            type="text"
            onChange={(e) => handleInputChange(e)}
            error={errors.bookTitle}
            readOnly={false}
          />
          <div className="form-submit-btn">
            <Button onClick={handleSubmit}>Change</Button>
          </div>
        </Modal>
      )}
      <Toast message={toastMessage} type={toastType} show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default ProfileButton;
