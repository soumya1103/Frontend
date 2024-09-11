import React from "react";
import danger from "../../Images/danger.svg";
import "./Error.css";

function Error({ error }) {
  return (
    <div className="error-container">
      <img src={danger} alt="danger" width="5%" />
      <p className="error-text">{error}</p>
    </div>
  );
}

export default Error;
