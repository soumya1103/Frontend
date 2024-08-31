import React from "react";
import Modal from "../../Coponents/Modal/Modal";
import Input from "../../Coponents/Input/Input";
import Button from "../../Coponents/Button/Button";

const IssuanceModal = ({
  show,
  onClose,
  isEdit,
  issuanceData,
  onChange,
  onSubmit,
  users,
  onUserChange,
  books,
  onBookChange,
}) => {
  return (
    <Modal show={show} onClose={onClose} height="370px" width="400px">
      <p className="form-title">{isEdit ? "Edit Issuance" : "Add Issuance"}</p>
      <div className="form-content">
        <label className="form-field-label">User Credential</label>
        <select
          className="form-field-input"
          value={issuanceData.userId}
          onChange={(e) => onUserChange(e.target.value)}
        >
          <option value="">Select Mobile No.</option>
          {users.map((user) => (
            <option key={user.userId} value={user.userCredential}>
              {user.userCredential}
            </option>
          ))}
        </select>
        <Input
          label="User Name"
          name="userName"
          value={issuanceData.userName}
          type="text"
          readOnly
        />
        <label className="form-field-label">Book Title</label>
        <select
          className="form-field-input"
          value={issuanceData.bookId}
          onChange={(e) => onBookChange(e.target.value)}
        >
          <option value="">Select Book</option>
          {books.map((book) => (
            <option key={book.bookId} value={book.bookTitle}>
              {book.bookTitle}
            </option>
          ))}
        </select>
        <Input
          label="Book Author"
          name="bookAuthor"
          value={issuanceData.bookAuthor}
          type="text"
          readOnly
        />
        <Input
          label="Return Date"
          name="returnDate"
          value={issuanceData.returnDate}
          type="datetime-local"
          onChange={onChange}
        />
        <label className="form-field-label">Issuance Type</label>
        <select
          name="issuanceType"
          className="form-field-input"
          value={issuanceData.issuanceType}
          onChange={onChange}
        >
          <option value="">Select Type</option>
          <option value="Remote">Remote</option>
          <option value="Inhouse">Inhouse</option>
        </select>
      </div>
      <div className="form-submit-btn">
        <Button onClick={onSubmit}>{isEdit ? "Update" : "Add"}</Button>
      </div>
    </Modal>
  );
};

export default IssuanceModal;
