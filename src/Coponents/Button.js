import React from "react";
import "./Button.css";

function Button({ children }) {
  return (
    <button className="btn button">
      <h4>{children}</h4>
    </button>
  );
}

export default Button;
