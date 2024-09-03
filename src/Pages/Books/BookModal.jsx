import React from "react";
import Modal from "../../Coponents/Modal/Modal";
import Input from "../../Coponents/Input/Input";
import Button from "../../Coponents/Button/Button";

const BookModal = ({ show, onClose, isEdit, bookData, categories, onCategoryChange, onInputChange, onSubmit }) => {
  return (
    <Modal show={show} onClose={onClose} height="330px" width="400px">
      <p className="form-title">{isEdit ? "Edit Book" : "Add Book"}</p>
      <div className="form-content">
        <label className="form-field-label">Category Name</label>
        <select className="form-field-input" value={bookData.categoryId} onChange={onCategoryChange}>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </option>
          ))}
        </select>
        <Input label="Book Title" name="bookTitle" value={bookData.bookTitle} type="text" onChange={onInputChange} />
        <Input label="Book Author" name="bookAuthor" value={bookData.bookAuthor} type="text" onChange={onInputChange} />
        <Input label="Book Rating" name="bookRating" value={bookData.bookRating} type="number" min="1" max="5" onChange={onInputChange} />
        <Input label="Book Count" name="bookCount" value={bookData.bookCount} type="number" min={isEdit ? "0" : "1"} onChange={onInputChange} />
      </div>
      <div className="form-submit-btn">
        <Button onClick={onSubmit}>{isEdit ? "Update" : "Add"}</Button>
      </div>
    </Modal>
  );
};

export default BookModal;
