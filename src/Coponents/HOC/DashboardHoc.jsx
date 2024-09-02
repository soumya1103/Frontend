import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navigation from "../Navigation/Navigation";
import "./DashboardHoc.css";

const DashboardHoc = (Component) =>
  function HOC() {
    return (
      <>
        <Navigation />
        <div className="dashboard-hoc-container">
          <Sidebar />
          <div className="dashboard-hoc-right-container">
            <Component />
          </div>
        </div>
      </>
    );
  };

export default DashboardHoc;
