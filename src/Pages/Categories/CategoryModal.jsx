import React, { useState } from "react";
import Modal from "../../Coponents/Modal/Modal";
import Input from "../../Coponents/Input/Input";
import Button from "../../Coponents/Button/Button";
import { addCategory, updateCategory } from "../../Api/Service/CategoryService";
import Toast from "../../Coponents/Toast/Toast";

function CategoryModal({ isEdit, categoryData, categoryToEdit, onClose, reloadCategories, auth }) {
  const [formData, setFormData] = useState(categoryData);
  const [errors, setErrors] = useState({});

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  let response;

  const validate = () => {
    const newErrors = {};

    if (!formData.categoryName || formData.categoryName.trim().length === 0) {
      newErrors.categoryName = "Category name is required.";
    }

    if (!formData.categoryIcon || formData.categoryIcon.trim().length === 0) {
      newErrors.categoryIcon = "Category icon is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async () => {
    if (validate()) {
      if (isEdit) {
        response = await updateCategory(formData, categoryToEdit, auth?.token);
      } else {
        response = await addCategory(formData, auth?.token);
      }
      if (response?.status === 200 || response?.status === 201) {
        setToastMessage(isEdit ? "Category updated successfully!" : "Category added successfully!");
        setShowToast(true);
        setToastType("success");
      } else {
        setToastMessage("There was an error processing the request!");
        setShowToast(true);
        setToastType("error");
      }
      reloadCategories();
      onClose();
    }
  };

  const modalDimensions = errors.categoryName || errors.categoryIcon ? { height: "270px", width: "400px" } : { height: "230px", width: "400px" };

  return (
    <>
      <Modal show={true} onClose={onClose} height={modalDimensions.height} width={modalDimensions.width}>
        <p className="form-title">{isEdit ? "Edit Category" : "Add Category"}</p>
        <div>
          <Input
            label="Category Name"
            name="categoryName"
            type="text"
            value={formData.categoryName}
            onChange={handleChange}
            error={errors.categoryName}
          />
          <Input
            label="Category Icon"
            name="categoryIcon"
            type="text"
            value={formData.categoryIcon}
            onChange={handleChange}
            error={errors.categoryIcon}
          />
        </div>
        <div className="form-submit-btn">
          <Button onClick={handleSubmit}>{isEdit ? "Update" : "Add"}</Button>
        </div>
        <Toast message={toastMessage} type={toastType} show={showToast} onClose={() => setShowToast(false)} />
      </Modal>
    </>
  );
}

export default CategoryModal;
