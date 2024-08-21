import React from "react";
import Sidebar from "../Sidebar";
import Navigation from "../Navigation";
import "./DashboardHoc.css";

const DashboardHoc = (Component) =>
  function HOC() {
    return (
      <>
        <Navigation firstName="Soumya" lastName="Agrawal" />
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
