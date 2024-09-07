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
import Error from "../../Coponents/Error/Error";
import { validationPatterns, validTLDs } from "../../Validations/Constant";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState("admin");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);

  const [userCredential, setUserCredential] = useState("");
  const [password, setPassword] = useState("");

  const [credentialError, setCredentialError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  const validateCredential = () => {
    if (selectedRole === "admin") {
      if (!validationPatterns.email.test(userCredential)) {
        setCredentialError("Please enter a valid email.");
        return false;
      }
      const emailTLD = userCredential.substring(userCredential.lastIndexOf("."));
      if (!validTLDs.includes(emailTLD)) {
        setCredentialError(`Email must end with a valid domain`);
        return false;
      }
    } else {
      if (!validationPatterns.mobile.test(userCredential)) {
        setCredentialError("Please enter a valid 10-digit phone number.");
        return false;
      }
    }
    setCredentialError("");
    return true;
  };

  const validatePassword = () => {
    if (password.length < 1) {
      setPasswordError("Password can not be empty.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const isCredentialValid = validateCredential();
    const isPasswordValid = validatePassword();

    if (isCredentialValid && isPasswordValid) {
      try {
        const { data } = await login(userCredential, password);
        dispatch(loginUser(data));
        window.localStorage.setItem("authtoken", data.token);
      } catch (error) {
        console.log("Login failed!", error);
      }
    }
  };

  const handleInputChange = (setter, errorSetter) => (e) => {
    setter(e.target.value);
    errorSetter("");
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
                  <>
                    <input
                      placeholder="Email"
                      value={userCredential}
                      type="text"
                      name="userCredential"
                      onChange={handleInputChange(setUserCredential, setCredentialError)}
                      onBlur={validateCredential}
                    />
                    {credentialError && <Error error={credentialError} />}
                  </>
                )}

                {selectedRole === "user" && (
                  <>
                    <input
                      onChange={handleInputChange(setUserCredential, setCredentialError)}
                      placeholder="Phone Number"
                      value={userCredential}
                      type="tel"
                      name="userCredential"
                      onBlur={validateCredential}
                    />
                    {credentialError && <Error error={credentialError} />}
                  </>
                )}
                <br />
                <input
                  placeholder="Password"
                  value={password}
                  type="password"
                  name="password"
                  onChange={handleInputChange(setPassword, setPasswordError)}
                  onBlur={validatePassword}
                />
                {passwordError && <Error error={passwordError} />}
                <br />
                <div className="login-button">
                  <Button type="submit">Login</Button>
                </div>
              </form>
            </div>
            <img src={loginImg} alt="login-image" style={{ width: "70%" }} className="login-img" />
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
