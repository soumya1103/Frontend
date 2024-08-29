import React from "react";
import "./Form.css";

function Input({
  label,
  name,
  min,
  max,
  type,
  required,
  value,
  onChange,
  readOnly,
  className,
  maxLength,
}) {
  return (
    <>
      <label className="form-field-label">{label}</label>
      <input
        className={`form-field-input ${className}`}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e)}
        autoComplete="off"
        min={min}
        max={max}
        readOnly={readOnly}
        placeholder={label}
        maxLength={maxLength}
      />
    </>
  );
}

export default Input;
