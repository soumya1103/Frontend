import React, { useState } from "react";
import Modal from "../../Coponents/Modal/Modal";
import Input from "../../Coponents/Input/Input";
import Button from "../../Coponents/Button/Button";
import { addCategory, updateCategory } from "../../Api/Service/CategoryService";

function CategoryModal({
  isEdit,
  categoryData,
  categoryToEdit,
  onClose,
  reloadCategories,
}) {
  const [formData, setFormData] = useState(categoryData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (isEdit) {
      await updateCategory(formData, categoryToEdit);
    } else {
      await addCategory(formData);
    }
    reloadCategories();
    onClose();
  };

  return (
    <Modal show={true} onClose={onClose} height="230px" width="400px">
      <p className="form-title">{isEdit ? "Edit Category" : "Add Category"}</p>
      <div className="form-content">
        <Input
          label="Category Name"
          name="categoryName"
          type="text"
          value={formData.categoryName}
          onChange={handleChange}
        />
        <Input
          label="Category Icon"
          name="categoryIcon"
          type="text"
          value={formData.categoryIcon}
          onChange={handleChange}
        />
      </div>
      <div className="form-submit-btn">
        <Button onClick={handleSubmit}>{isEdit ? "Update" : "Add"}</Button>
      </div>
    </Modal>
  );
}

export default CategoryModal;
