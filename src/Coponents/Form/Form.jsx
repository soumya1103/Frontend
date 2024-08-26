import React, { useState, useMemo } from "react";
import Button from "../Button/Button";
import "./Form.css";

const prepareForm = (formArr) => {
  return formArr.reduce((r, v) => ({ ...r, [v.name]: "" }), {});
};

function Form({ title, formArr, submitBtn, onSubmit, redirect }) {
  const initialForm = useMemo(() => prepareForm(formArr), [formArr]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    formArr.forEach(({ name, required }) => {
      if (required && !form[name]) {
        newErrors[name] = "This field is required";
      }
    });
    return newErrors;
  };

  const onSumbitHandler = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(form, () => setForm(initialForm));
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <form autoComplete="off">
      <span className="form-title">{title}</span>
      {formArr.map(({ label, name, type, required }, index) => (
        <div key={index} className="form-content">
          <label className="form-field-label" htmlFor={name}>
            {label}
          </label>
          <input
            className="form-field-input"
            id={name}
            name={name}
            type={type}
            value={form[name]}
            onChange={onChangeHandler}
          />
          {errors[name] && <span className="form-error">{errors[name]}</span>}
        </div>
      ))}
      <div className="form-submit-btn">
        <Button
          onClick={(e) => {
            e.preventDefault();
            onSumbitHandler();
          }}
        >
          {submitBtn}
        </Button>
      </div>
    </form>
  );
}

export default Form;
