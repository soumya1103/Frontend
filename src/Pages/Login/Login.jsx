import React, { useEffect } from "react";
import icon from "../../Images/icon.png";
import loginImg from "../../Images/login-image.png";
import "./Login.css";
import Button from "../../Component/Button/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../Api/Service/Login";
import { loginUser } from "../../Redux/Authentication/AuthenticationAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Component/Loader/Loader";
import Error from "../../Component/Error/Error";
import { validationPatterns, validTLDs } from "../../Validations/Constant";
import Toast from "../../Component/Toast/Toast";
import danger from "../../Images/danger.svg";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState("admin");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);

  const [userCredential, setUserCredential] = useState("");
  const [password, setPassword] = useState("");

  const [credentialEmailError, setCredentialEmailError] = useState("");
  const [credentialPhoneError, setCredentialPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");

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
    setUserCredential("");
    setCredentialEmailError("");
    setPassword("");
    setPasswordError("");
  };

  const handleUserClick = () => {
    setSelectedRole("user");
    setPasswordError("");
    setUserCredential("");
    setCredentialPhoneError("");
    setPassword("");
  };

  const validateCredentialEmail = () => {
    if (selectedRole === "admin") {
      if (!validationPatterns.email.test(userCredential)) {
        setCredentialEmailError("Please enter a valid email.");
        return false;
      }
      const emailTLD = userCredential.substring(userCredential.lastIndexOf("."));
      if (!validTLDs.includes(emailTLD)) {
        setCredentialEmailError(`Email must end with a valid domain`);
        return false;
      }
    }
    setCredentialEmailError("");
    return true;
  };

  const validateCredentialPhone = () => {
    if (selectedRole === "user") {
      if (!validationPatterns.mobile.test(userCredential)) {
        setCredentialPhoneError("Please enter a valid 10-digit phone number.");
        return false;
      }
    }
    setCredentialPhoneError("");
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
    const isCredentialEmailValid = validateCredentialEmail();
    const isCredentialPhoneValid = validateCredentialPhone();
    const isPasswordValid = validatePassword();

    if (selectedRole === "admin" ? isCredentialEmailValid && isPasswordValid : isCredentialPhoneValid && isPasswordValid) {
      try {
        const encodedPassword = btoa(password);
        const response = await login(userCredential, encodedPassword);
        if (response?.status === 200 || response?.status === 201) {
          setToastMessage("Logged in successfully!");
          setShowToast(true);
          setToastType("success");
        }
        dispatch(loginUser(response.data));
        window.localStorage.setItem("authtoken", response.data.token);
      } catch (error) {
        console.log(error.response.data.message);

        setToastMessage(error.response.data.message);
        setShowToast(true);
        setToastType("error");
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
                      onChange={handleInputChange(setUserCredential, setCredentialEmailError)}
                      onBlur={validateCredentialEmail}
                    />
                    {credentialEmailError && (
                      <div className="login-error-container">
                        <img src={danger} alt="danger" width="3%" />
                        <p className="login-error-text">{credentialEmailError}</p>
                      </div>
                    )}
                  </>
                )}

                {selectedRole === "user" && (
                  <>
                    <input
                      onChange={handleInputChange(setUserCredential, setCredentialPhoneError)}
                      placeholder="Phone Number"
                      value={userCredential}
                      type="tel"
                      name="userCredential"
                      onBlur={validateCredentialPhone}
                    />
                    {credentialPhoneError && (
                      <div className="login-error-container">
                        <img src={danger} alt="danger" width="3%" />
                        <p className="login-error-text">{credentialPhoneError}</p>
                      </div>
                    )}
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
                {passwordError && (
                  <div className="login-error-container">
                    <img src={danger} alt="danger" width="3%" />
                    <p className="login-error-text">{passwordError}</p>
                  </div>
                )}
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
      <Toast message={toastMessage} type={toastType} show={showToast} onClose={() => setShowToast(false)} />
    </>
  );
};

export default Login;
