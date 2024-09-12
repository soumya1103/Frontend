import React, { useState } from "react";
import Modal from "../../Component/Modal/Modal";
import Input from "../../Component/Input/Input";
import Button from "../../Component/Button/Button";
import { validationPatterns } from "../../Validations/Constant";

function CategoryModal({ isEdit, categoryData, onInputChange, onSubmit, onClose }) {
  const [formData, setFormData] = useState(categoryData);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.categoryName || formData.categoryName.trim().length === 0) {
      newErrors.categoryName = "Category name is required.";
    }

    if (!formData.categoryIcon || formData.categoryIcon.trim().length === 0) {
      newErrors.categoryIcon = "Category icon is required.";
    }

    if (!validationPatterns.alphabet.test(formData.categoryName)) {
      newErrors.categoryName = "Only alphabets are allowed.";
    }

    if (validationPatterns.specialChar.test(formData.categoryName)) {
      newErrors.categoryName = "No special characters are allowed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormData((prevData) => ({
      ...prevData,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    onInputChange(e);
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit();
    }
  };

  const modalDimensions = errors.categoryName || errors.categoryIcon ? { height: "270px", width: "400px" } : { height: "230px", width: "400px" };

  return (
    <>
      <Modal role="dialog" show={true} onClose={() => onClose()} height={modalDimensions.height} width={modalDimensions.width}>
        <p className="form-title">{isEdit ? "Edit Category" : "Add Category"}</p>
        <div>
          <Input
            label="Category Name"
            name="categoryName"
            type="text"
            value={formData.categoryName}
            onChange={handleInputChange}
            error={errors.categoryName}
          />
          <Input
            label="Category Icon"
            name="categoryIcon"
            type="text"
            value={formData.categoryIcon}
            onChange={handleInputChange}
            error={errors.categoryIcon}
          />
        </div>
        <div className="form-submit-btn">
          <Button onClick={handleSubmit}>{isEdit ? "Update" : "Add"}</Button>
        </div>
      </Modal>
    </>
  );
}

export default CategoryModal;
