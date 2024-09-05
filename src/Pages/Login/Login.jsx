import React, { useEffect } from "react";
import icon from "../../Images/icon.png";
import loginImg from "../../Images/login-image.png";
import "./Login.css";
import Button from "../../Coponents/Button/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../Api/Service/Login";
import { loginUser } from "../../Redux/Authentication/AuthenticationAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Coponents/Loader/Loader";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState("admin");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);

  const [userCredential, setUserCredential] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (auth && auth.token) {
      if (auth.role === "ROLE_ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/userHistory");
      }
    }
  }, [auth, navigate]);

  const handleAdminClick = () => {
    setSelectedRole("admin");
  };

  const handleUserClick = () => {
    setSelectedRole("user");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(userCredential, password);
      dispatch(loginUser(data));
      window.localStorage.setItem("authtoken", data.token);
    } catch (error) {
      console.log("Login failed!", error);
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="login-container-outer">
          <div className="login-container-inner">
            <div className="login-left-container">
              <div className="login-heading-container">
                <img src={icon} alt="logo" width="12%" />
                <h1 className="login-heading">BiblioSpace</h1>
              </div>
              <div className="login-btn">
                <button onClick={handleAdminClick} className={selectedRole === "admin" ? "selected-button" : ""}>
                  Admin
                </button>
                <button onClick={handleUserClick} className={selectedRole === "user" ? "selected-button" : ""}>
                  User
                </button>
              </div>
              <form className="login-form" onSubmit={handleLogin}>
                {selectedRole === "admin" && (
                  <input
                    placeholder="Email"
                    value={userCredential}
                    type="email"
                    name="userCredential"
                    onChange={(e) => setUserCredential(e.target.value)}
                    required
                  />
                )}

                {selectedRole === "user" && (
                  <input
                    onChange={(e) => setUserCredential(e.target.value)}
                    placeholder="Phone Number"
                    value={userCredential}
                    required
                    type="tel"
                    name="userCredential"
                  />
                )}
                <br />
                <input
                  required
                  placeholder="Password"
                  value={password}
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <div className="login-button">
                  <Button type="submit">Login</Button>
                </div>
              </form>
            </div>
            <img src={loginImg} alt="login-image" style={{ width: "70%" }} />
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
