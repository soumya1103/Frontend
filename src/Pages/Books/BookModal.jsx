import React, { useState, useEffect } from "react";
import Modal from "../../Component/Modal/Modal";
import Input from "../../Component/Input/Input";
import Button from "../../Component/Button/Button";
import Error from "../../Component/Error/Error";
import { validationPatterns } from "../../Validations/Constant";
import { getCategoryByCategoryName } from "../../Api/Service/CategoryService";

const BookModal = ({ show, onClose, isEdit, bookData, categories, onCategoryChange, onInputChange, onSubmit }) => {
  const [formData, setFormData] = useState(bookData);
  const [errors, setErrors] = useState({});

  const handleCategoryIdSet = async (categoryName) => {
    try {
      const response = await getCategoryByCategoryName(categoryName);
      setFormData({ ...bookData, categoryId: Number(response.data.categoryId) });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (show && isEdit) {
      handleCategoryIdSet(bookData.categoryName);
      setFormData(formData);
      setErrors({});
    }
  }, [show]);

  const validate = () => {
    const errors = {};

    if (!formData.categoryId) {
      errors.categoryId = "Category is required.";
    }

    if (!formData.bookTitle || formData.bookTitle.trim().length === 0) {
      errors.bookTitle = "Book title is required.";
    }

    if (!formData.bookAuthor || formData.bookAuthor.trim().length === 0) {
      errors.bookAuthor = "Book author is required.";
    }

    if (!validationPatterns.alphabet.test(formData.bookAuthor)) {
      errors.bookAuthor = "Only alphabets allowed.";
    }

    if (formData.bookRating < 1 || formData.bookRating > 5) {
      errors.bookRating = "Book rating must be between 1 and 5.";
    }

    if (!Number.isInteger(Number(formData.bookRating))) {
      errors.bookRating = "Book rating cannot be in decimal form.";
    }

    if (formData.bookCount < 1) {
      errors.bookCount = "Book count cannot be negative or zero.";
    }

    if (!Number.isInteger(Number(formData.bookCount))) {
      errors.bookCount = "Book count cannot be in decimal form.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const newValue = name === "bookRating" || name === "bookCount" ? (isNaN(parseInt(value, 10)) ? "" : parseInt(value, 10)) : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    onInputChange(e);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setFormData((prevData) => ({
      ...prevData,
      categoryId: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      categoryId: "",
    }));

    onCategoryChange(e);
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit();
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: "",
      bookTitle: "",
      bookAuthor: "",
      bookRating: "",
      bookCount: "",
    });
    setErrors({});
  };

  const modalDimensions =
    errors.categoryId || errors.bookTitle || errors.bookAuthor || errors.bookRating || errors.bookCount
      ? { height: "532px", width: "470px" }
      : { height: "382px", width: "400px" };

  return (
    <Modal
      show={show}
      onClose={() => {
        onClose();
        resetForm();
      }}
      height={modalDimensions.height}
      width={modalDimensions.width}
    >
      <p className="form-title">{isEdit ? "Edit Book" : "Add Book"}</p>
      <div>
        <div className="form-content">
          <label className="form-field-label">Category Name</label>
          <select className="form-field-input" value={formData.categoryId} onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
          <div></div>
          {errors.categoryId && <Error error={errors.categoryId} />}
        </div>
        <Input label="Book Title" name="bookTitle" value={formData.bookTitle} type="text" onChange={handleInputChange} error={errors.bookTitle} />
        <Input label="Book Author" name="bookAuthor" value={formData.bookAuthor} type="text" onChange={handleInputChange} error={errors.bookAuthor} />
        <Input
          label="Book Rating"
          name="bookRating"
          value={formData.bookRating}
          type="number"
          min="1"
          max="5"
          onChange={handleInputChange}
          error={errors.bookRating}
        />
        <Input
          label="Book Count"
          name="bookCount"
          value={formData.bookCount}
          type="number"
          min={isEdit ? "0" : "1"}
          onChange={handleInputChange}
          error={errors.bookCount}
        />
      </div>
      <div className="form-submit-btn">
        <Button onClick={handleSubmit}>{isEdit ? "Update" : "Add"}</Button>
      </div>
    </Modal>
  );
};

export default BookModal;
