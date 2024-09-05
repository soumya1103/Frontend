import React from "react";
import Modal from "../../Coponents/Modal/Modal";
import Input from "../../Coponents/Input/Input";
import Button from "../../Coponents/Button/Button";

const AssignBookModal = ({
  show,
  onClose,
  bookTitle,
  books,
  book,
  userData,
  returnDate,
  issuanceType,
  onBookChange,
  onReturnDateChange,
  onIssuanceTypeChange,
  onSubmit,
}) => {
  return (
    <Modal show={show} onClose={onClose} height="370px" width="400px">
      <p className="form-title">Issue Book</p>
      <div className="form-content">
        <label className="form-field-label">Book Title</label>
        <select className="form-field-input" value={bookTitle} onChange={(e) => onBookChange(e.target.value)}>
          <option value="">Select Book</option>
          {books.map((book) => (
            <option key={book.bookId} value={book.bookTitle} disabled={book.bookCount === 0}>
              {book.bookTitle}
            </option>
          ))}
        </select>
        <Input label="Book Author" name="bookAuthor" value={book?.bookAuthor} type="text" readOnly />
        <Input label="Phone No" name="userCredential" value={userData?.userCredential} type="text" readOnly />
        <Input label="User Name" name="userName" value={userData?.userName} type="text" readOnly />
        <label className="form-field-label">Issuance Type</label>
        <select className="form-field-input" value={issuanceType} onChange={(e) => onIssuanceTypeChange(e.target.value)}>
          <option value="">Select Type</option>
          <option value="Remote">Remote</option>
          <option value="Inhouse">Inhouse</option>
        </select>
        <Input label="Return Date" name="returnDate" value={returnDate} type="datetime-local" onChange={(e) => onReturnDateChange(e.target.value)} />
      </div>
      <div className="form-submit-btn">
        <Button onClick={onSubmit}>Issue</Button>
      </div>
    </Modal>
  );
};

export default AssignBookModal;
