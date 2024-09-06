import React, { useEffect, useState } from "react";
import Modal from "../../Coponents/Modal/Modal";
import Input from "../../Coponents/Input/Input";
import Button from "../../Coponents/Button/Button";
import Error from "../../Coponents/Error/Error";

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
  const [errors, setErrors] = useState({});
  const [type, setType] = useState();
  const [currentDate, setCurrentDate] = useState("");
  const [time, setTime] = useState("");

  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toISOString().slice(11, 16); // Get 'HH:MM' for time input
  };

  useEffect(() => {
    setCurrentDate(getCurrentDate());
    setTime(getCurrentTime());
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!userCredential) {
      newErrors.userCredential = "User credential is required.";
    }

    if (!issuanceType) {
      newErrors.issuanceType = "Issuance type is required.";
    }

    if (!returnDate) {
      newErrors.returnDate = "Return date is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCredentialChange = (value) => {
    onCredentialChange(value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      userCredential: "",
    }));
  };

  const handleIssuanceTypeChange = (value) => {
    onIssuanceTypeChange(value);
    setType(value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      issuanceType: "",
    }));

    if (value === "Inhouse") {
      setCurrentDate(getCurrentDate());
      setTime(getCurrentTime());
      onReturnDateChange(`${getCurrentDate()}T${getCurrentTime()}`);
    }
  };

  const handleTimeChange = (value) => {
    setTime(value);
    onReturnDateChange(`${currentDate}T${value}`);

    setErrors((prevErrors) => ({
      ...prevErrors,
      returnDate: "",
    }));
  };

  const handleDateTimeChange = (value) => {
    onReturnDateChange(value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      returnDate: "",
    }));
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit();
    }
  };

  const modalDimensions =
    errors.userCredential || errors.issuanceType || (errors.returnDate && type === "Inhouse")
      ? { height: "535px", width: "490px" }
      : type === "Inhouse"
      ? { height: "441px", width: "400px" }
      : { height: "384px", width: "400px" };

  return (
    <Modal show={show} onClose={onClose} height={modalDimensions.height} width={modalDimensions.width}>
      <p className="form-title">Issue Book</p>
      <div>
        <div className="form-content">
          <label className="form-field-label">User Credential</label>
          <select className="form-field-input" value={userCredential} onChange={(e) => handleCredentialChange(e.target.value)}>
            <option value="">Select Mobile No.</option>
            {users.map((user) => (
              <option key={user.userId} value={user?.userCredential}>
                {user.userCredential}
              </option>
            ))}
          </select>
          <div></div>
          {errors.userCredential && <Error error={errors.userCredential} />}
        </div>
        <Input label="User Name" name="userName" value={user?.userName} type="text" readOnly={true} />
        <Input label="Book Title" name="bookTitle" value={bookData?.bookTitle} type="text" readOnly={true} />

        <div className="form-content">
          <label className="form-field-label">Issuance Type</label>
          <select className="form-field-input" value={issuanceType} onChange={(e) => handleIssuanceTypeChange(e.target.value)}>
            <option value="">Select Type</option>
            <option value="Remote">Remote</option>
            <option value="Inhouse">Inhouse</option>
          </select>
          <div></div>
          {errors.issuanceType && <Error error={errors.issuanceType} />}
        </div>
        {type === "Inhouse" ? (
          <>
            <Input label="Return Date" name="returnDate" value={currentDate} type="date" readOnly={true} />
            <Input
              label="Return Time"
              name="returnTime"
              value={time}
              type="time"
              onChange={(e) => handleTimeChange(e.target.value)}
              error={errors.returnDate}
            />
          </>
        ) : (
          <Input
            label="Return Date"
            name="returnDate"
            value={returnDate}
            type="datetime-local"
            min={`${currentDate}T${getCurrentTime()}`}
            onChange={(e) => handleDateTimeChange(e.target.value)}
            error={errors.returnDate}
          />
        )}
      </div>
      <div className="form-submit-btn">
        <Button onClick={handleSubmit}>Issue</Button>
      </div>
    </Modal>
  );
};

export default AssignModal;
