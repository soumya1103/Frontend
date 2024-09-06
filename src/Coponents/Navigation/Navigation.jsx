import React, { useEffect, useState } from "react";
import logo from "../../Images/icon.png";
import ProfileButton from "../ProfileButton/ProfileButton";
import "./Navigation.css";
import { useSelector } from "react-redux";
import { getUsersByCredential } from "../../Api/Service/UserService";

function Navigation() {
  const auth = useSelector((state) => state.auth);

  const [name, setName] = useState();

  const findUserName = async () => {
    try {
      const response = await getUsersByCredential(auth.userCredential);
      setName(response.data.userName);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    findUserName();
  }, []);

  return (
    <div className="navigation-container">
      <div className="navigation-heading-container">
        <img src={logo} alt="logo" width="22%" height="65px" />
        <h2>BiblioSpace</h2>
      </div>
      <h3 className="nav-name">Hello {name},</h3>
      <div style={{ textAlign: "right" }}>
        <ProfileButton name={name} />
      </div>
    </div>
  );
}

export default Navigation;
