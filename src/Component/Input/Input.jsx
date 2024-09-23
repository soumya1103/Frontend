import React from "react";
import "./Form.css";
import Error from "../Error/Error";

function Input({ label, name, min, max, type, value, onChange, className, maxLength, error = "", disabled, readOnly }) {
  return (
    <div className="form-content">
      <label htmlFor={name} className="form-field-label">
        {label}
      </label>
      <input
        className={disabled ? `form-field-input disabled ${className}` : `form-field-input ${className}`}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e)}
        autoComplete="off"
        min={min}
        max={max}
        placeholder={label}
        maxLength={maxLength}
        readOnly={readOnly}
      />
      <span></span>
      {error !== "" ? <Error error={error} /> : ""}
    </div>
  );
}

export default Input;
