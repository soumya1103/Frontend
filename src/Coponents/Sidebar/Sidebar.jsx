import React from "react";
import "./Sidebar.css";
import dashboard from "../../Images/dashboard-image.svg";
import categories from "../../Images/categories-image.svg";
import books from "../../Images/book-image.svg";
import users from "../../Images/users-image.svg";
import issuances from "../../Images/issuances-image.svg";
import logoutImg from "../../Images/logout-image.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../Api/Service/Login";
import { logoutUser } from "../../Redux/Authentication/AuthenticationAction";

function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-inner-container">
        <Link to="/dashboard" className={`sidebar-icon ${location.pathname === "/dashboard" ? "active" : ""}`}>
          <img src={dashboard} alt="dashboard" width="12%" />
          <h3>Dashboard</h3>
        </Link>
        <Link to="/categories" className={`sidebar-icon ${location.pathname === "/categories" ? "active" : ""}`}>
          <img src={categories} alt="categories" width="12%" />
          <h3>Categories</h3>
        </Link>
        <Link to="/books" className={`sidebar-icon ${location.pathname === "/books" ? "active" : ""}`}>
          <img src={books} alt="books" width="12%" />
          <h3>Books</h3>
        </Link>
        <Link to="/users" className={`sidebar-icon ${location.pathname === "/users" ? "active" : ""}`}>
          <img src={users} alt="users" width="12%" />
          <h3>Users</h3>
        </Link>
        <Link to="/issuances" className={`sidebar-icon ${location.pathname === "/issuances" ? "active" : ""}`}>
          <img src={issuances} alt="issuances" width="12%" />
          <h3>Issuances</h3>
        </Link>
      </div>
      <button className="sidebar-logout-btn" onClick={handleLogout}>
        <img src={logoutImg} alt="logout" width="12%" />
        <h3>Logout</h3>
      </button>
    </div>
  );
}

export default Sidebar;
