import React from "react";

function Input({ label, name, type, required, value, onChange }) {
  return (
    <>
      <label className="form-field-label">{label}</label>
      <input
        className="form-field-input"
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e)}
      />
    </>
  );
}

export default Input;
