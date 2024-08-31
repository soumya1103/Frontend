import React from "react";
import Modal from "../../Coponents/Modal/Modal";
import Input from "../../Coponents/Input/Input";
import Button from "../../Coponents/Button/Button";

const AssignModal = ({
  show,
  onClose,
  userCredential,
  user,
  users,
  bookData,
  returnDate,
  issuanceType,
  onCredentialChange,
  onReturnDateChange,
  onIssuanceTypeChange,
  onSubmit,
}) => {
  return (
    <Modal show={show} onClose={onClose} height="330px" width="400px">
      <p className="form-title">Issue Book</p>
      <div className="form-content">
        <label className="form-field-label">User Credential</label>
        <select
          className="form-field-input"
          value={userCredential}
          onChange={(e) => onCredentialChange(e.target.value)}
        >
          <option value="">Select Mobile No.</option>
          {users.map((user) => (
            <option key={user.userId} value={user?.userCredential}>
              {user.userCredential}
            </option>
          ))}
        </select>
        <Input
          label="User Name"
          name="userName"
          value={user?.userName}
          type="text"
          readOnly={true}
        />
        <Input
          label="Book Title"
          name="bookTitle"
          value={bookData?.bookTitle}
          type="text"
          readOnly={true}
        />
        <Input
          label="Return Date"
          name="returnDate"
          value={returnDate}
          type="datetime-local"
          onChange={(e) => onReturnDateChange(e.target.value)}
        />
        <label className="form-field-label">Issuance Type</label>
        <select
          className="form-field-input"
          value={issuanceType}
          onChange={(e) => onIssuanceTypeChange(e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="Remote">Remote</option>
          <option value="Inhouse">Inhouse</option>
        </select>
      </div>
      <div className="form-submit-btn">
        <Button onClick={onSubmit}>Issue</Button>
      </div>
    </Modal>
  );
};

export default AssignModal;
