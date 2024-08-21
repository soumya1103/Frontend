import React from "react";
import "./Sidebar.css";
import dashboard from "../Images/dashboard-image.svg";
import categories from "../Images/categories-image.svg";
import books from "../Images/book-image.svg";
import users from "../Images/users-image.svg";
import issuances from "../Images/issuances-image.svg";
import logout from "../Images/logout-image.svg";

function Sidebar() {
  return (
    <div className="sidebar-container">
      <div className="sidebar-inner-container">
        <div className="sidebar-icon">
          <img src={dashboard} alt="dashboard" width="12%" />
          <h3>Dashboard</h3>
        </div>
        <div className="sidebar-icon">
          <img src={categories} alt="categories" width="12%" />
          <h3>Categories</h3>
        </div>
        <div className="sidebar-icon">
          <img src={books} alt="books" width="12%" />
          <h3>Books</h3>
        </div>
        <div className="sidebar-icon">
          <img src={users} alt="users" width="12%" />
          <h3>Users</h3>
        </div>
        <div className="sidebar-icon">
          <img src={issuances} alt="issuances" width="12%" />
          <h3>Issuances</h3>
        </div>
      </div>
      <div className="sidebar-logout-btn">
        <img src={logout} alt="logout" width="12%" />
        <h3>Logout</h3>
      </div>
    </div>
  );
}

export default Sidebar;
