import React from "react";
import icon from "../Images/icon.png";
import loginImg from "../Images/login-image.png";
import "./Login.css";
import Button from "../Coponents/Button";
import { useState } from "react";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState("admin");

  const handleAdminClick = () => {
    setSelectedRole("admin");
  };

  const handleUserClick = () => {
    setSelectedRole("user");
  };

  return (
    <div class="login-container-outer">
      <div className="login-container-inner">
        <div class="login-left-container">
          <div class="login-heading-container">
            <img src={icon} alt="logo" width="12%" />
            <h1 class="login-heading">BiblioSpace</h1>
          </div>
          <div className="login-btn">
            <button
              onClick={handleAdminClick}
              className={selectedRole === "admin" ? "selected-button" : ""}
            >
              Admin
            </button>
            <button
              onClick={handleUserClick}
              className={selectedRole === "user" ? "selected-button" : ""}
            >
              User
            </button>
          </div>
          <form className="login-form">
            {selectedRole === "admin" && (
              <input placeholder="Email" required type="email" />
            )}

            {selectedRole === "user" && (
              <input placeholder="Phone Number" required type="tel" />
            )}
            <br />
            <input placeholder="Password" required type="password" />
            <br />
            <div className="login-button">
              <Button>Login</Button>
            </div>
          </form>
        </div>
        <img src={loginImg} alt="login-image" style={{ width: "70%" }} />
      </div>
    </div>
  );
};

export default Login;
