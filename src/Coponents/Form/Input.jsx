import React from "react";
import "./Form.css";

function Input({ label, name, type, required, value, onChange }) {
  return (
    <div className="form-content">
      <label className="form-field-label">{label}</label>
      <input
        className="form-field-input"
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e)}
        autoComplete="off"
      />
    </div>
  );
}

export default Input;
