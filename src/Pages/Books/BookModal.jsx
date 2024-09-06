import React, { useState } from "react";
import Modal from "../../Coponents/Modal/Modal";
import Input from "../../Coponents/Input/Input";
import Button from "../../Coponents/Button/Button";
import Error from "../../Coponents/Error/Error";

const BookModal = ({ show, onClose, isEdit, bookData, categories, onCategoryChange, onInputChange, onSubmit }) => {
  const [formData, setFormData] = useState(bookData);
  const [errors, setErrors] = useState({});

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

    if (formData.bookRating < 1 || formData.bookRating > 5) {
      errors.bookRating = "Book rating must be between 1 and 5.";
    }

    if (formData.bookCount < 1) {
      errors.bookCount = "Book count cannot be negative or zero.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
    }
  };

  const modalDimensions =
    errors.categoryId || errors.bookTitle || errors.bookAuthor || errors.bookRating || errors.bookCount
      ? { height: "532px", width: "470px" }
      : { height: "382px", width: "400px" };

  return (
    <Modal show={show} onClose={onClose} height={modalDimensions.height} width={modalDimensions.width}>
      <p className="form-title">{isEdit ? "Edit Book" : "Add Book"}</p>
      <div>
        <div className="form-content">
          <label className="form-field-label">Category Name</label>
          <select className="form-field-input" value={bookData.categoryId} onChange={handleCategoryChange}>
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
        <Input label="Book Title" name="bookTitle" value={bookData.bookTitle} type="text" onChange={handleInputChange} error={errors.bookTitle} />
        <Input label="Book Author" name="bookAuthor" value={bookData.bookAuthor} type="text" onChange={handleInputChange} error={errors.bookAuthor} />
        <Input
          label="Book Rating"
          name="bookRating"
          value={bookData.bookRating}
          type="number"
          min="1"
          max="5"
          onChange={handleInputChange}
          error={errors.bookRating}
        />
        <Input
          label="Book Count"
          name="bookCount"
          value={bookData.bookCount}
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
