import React from "react";
import "./Form.css";
import Error from "../Error/Error";

function Input({ label, name, min, max, type, value, onChange, readOnly, className, maxLength, error = "" }) {
  return (
    <div className="form-content">
      <label htmlFor={name} className="form-field-label">
        {label}
      </label>
      <input
        className={`form-field-input ${className}`}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e)}
        autoComplete="off"
        min={min}
        max={max}
        readOnly={readOnly}
        placeholder={label}
        maxLength={maxLength}
      />
      <span></span>
      {error !== "" ? <Error error={error} /> : ""}
    </div>
  );
}

export default Input;
