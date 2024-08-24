import React from "react";
import "./Sidebar.css";
import dashboard from "../../Images/dashboard-image.svg";
import categories from "../../Images/categories-image.svg";
import books from "../../Images/book-image.svg";
import users from "../../Images/users-image.svg";
import issuances from "../../Images/issuances-image.svg";
import logout from "../../Images/logout-image.svg";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar-container">
      <div className="sidebar-inner-container">
        <Link
          to="/dashboard"
          className={`sidebar-icon ${
            location.pathname === "/dashboard" ? "active" : ""
          }`}
        >
          <img src={dashboard} alt="dashboard" width="12%" />
          <h3>Dashboard</h3>
        </Link>
        <Link
          to="/categories"
          className={`sidebar-icon ${
            location.pathname === "/categories" ? "active" : ""
          }`}
        >
          <img src={categories} alt="categories" width="12%" />
          <h3>Categories</h3>
        </Link>
        <Link
          to="/books"
          className={`sidebar-icon ${
            location.pathname === "/books" ? "active" : ""
          }`}
        >
          <img src={books} alt="books" width="12%" />
          <h3>Books</h3>
        </Link>
        <Link
          to="/users"
          className={`sidebar-icon ${
            location.pathname === "/users" ? "active" : ""
          }`}
        >
          <img src={users} alt="users" width="12%" />
          <h3>Users</h3>
        </Link>
        <Link
          to="/issuances"
          className={`sidebar-icon ${
            location.pathname === "/issuances" ? "active" : ""
          }`}
        >
          <img src={issuances} alt="issuances" width="12%" />
          <h3>Issuances</h3>
        </Link>
      </div>
      <div className="sidebar-logout-btn">
        <img src={logout} alt="logout" width="12%" />
        <h3>Logout</h3>
      </div>
    </div>
  );
}

export default Sidebar;
