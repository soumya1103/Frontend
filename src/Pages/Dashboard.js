import React from "react";
import DashboardHoc from "../Coponents/HOC/DashboardHoc";
import "./Dashboard.css";
import bookDashboard from "../Images/book-dashboard.png";
import categoryDashboard from "../Images/categories-dashboard.png";
import userDashboard from "../Images/users-dashboard.png";
import inhouseUserDashboard from "../Images/inhouse-users-dashboard.png";
import Table from "../Coponents/Table";

function Dashboard() {
  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-card">
          <img src={bookDashboard} alt="book" width="20%" />
          <h4>500</h4>
          <h4>Total Books</h4>
        </div>
        <div className="dashboard-card">
          <img src={categoryDashboard} alt="category" width="20%" />
          <h4>15</h4>
          <h4>Total Categories</h4>
        </div>
        <div className="dashboard-card">
          <img src={userDashboard} alt="user" width="20%" />
          <h4>50</h4>
          <h4>Total Users</h4>
        </div>
        <div className="dashboard-card">
          <img src={inhouseUserDashboard} alt="inhouse-user" width="20%" />
          <h4>20</h4>
          <h4>Total Inhouse Users</h4>
        </div>
      </div>
      <div>
        <Table />
      </div>
    </>
  );
}

export default DashboardHoc(Dashboard);
