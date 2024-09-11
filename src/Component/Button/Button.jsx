import React from "react";
import "./Button.css";

function Button({ children, onClick, className = "" }) {
  return (
    <button className={`btn button ${className}`} onClick={onClick}>
      <h4>{children}</h4>
    </button>
  );
}

export default Button;
