import React, { useState, useMemo, useEffect } from "react";
import Button from "../Button/Button";
import "./Form.css";
import { getAllCategories } from "../../Api/Service/CategoryService";

const prepareForm = (formArr) => {
  return formArr.reduce((r, v) => ({ ...r, [v.name]: "" }), {});
};

function Form({
  title,
  formArr,
  submitBtn,
  onSubmit,
  redirect,
  showCategoryDropdown,
}) {
  const initialForm = useMemo(() => prepareForm(formArr), [formArr]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (showCategoryDropdown) {
      fetchCategories();
    }
  }, [showCategoryDropdown]);

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
      {formArr.map(({ label, name, type, min, max, required }, index) => (
        <div key={index} className="form-content">
          <label className="form-field-label" htmlFor={name}>
            {label}
          </label>
          {type === "select" && showCategoryDropdown ? (
            <select
              className="form-field-input"
              id={name}
              name={name}
              value={form[name]}
              onChange={onChangeHandler}
              required={required}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="form-field-input"
              id={name}
              name={name}
              type={type}
              value={form[name]}
              onChange={onChangeHandler}
              min={min}
              max={max}
              onInput={(e) => {
                if (e.target.value < 0) e.target.value = 1;
                if (e.target.value > 5) e.target.value = 5;
              }}
            />
          )}
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
