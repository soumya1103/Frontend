import React from "react";
import "./Button.css";

function Button({ children, onClick }) {
  return (
    <button className="btn button" onClick={onClick}>
      <h4>{children}</h4>
    </button>
  );
}

export default Button;
