import React from "react";
import logo from "../Images/icon.png";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ firstName, lastName }) {
  return (
    <div className="navigation-container">
      <div className="login-heading-container">
        <img src={logo} alt="logo" width="18%" />
        <h2>BiblioSpace</h2>
      </div>
      <h3 className="nav-name">Hello {firstName},</h3>
      <div style={{ textAlign: "right" }}>
        <ProfileButton firstName={firstName} lastName={lastName} />
      </div>
    </div>
  );
}

export default Navigation;
