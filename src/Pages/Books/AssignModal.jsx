import React, { useEffect, useState } from "react";
import Modal from "../../Component/Modal/Modal";
import Input from "../../Component/Input/Input";
import Button from "../../Component/Button/Button";
import Error from "../../Component/Error/Error";

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
  const [tomorrowDate, setTomorrowDate] = useState("");
  const [time, setTime] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  };

  const getCurrentDatePlusOne = () => {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    return now.toISOString().split("T")[0];
  };

  const getCurrentTimeIST = () => {
    const now = new Date();
    const istOffset = 5 * 60 + 30;
    const istTime = new Date(now.getTime() + istOffset * 60 * 1000);
    return istTime.toISOString().slice(11, 16);
  };

  const getCurrentTimeISTFiveSec = () => {
    const now = new Date();
    const istOffset = 5 * 60 + 30;
    const istTime = new Date(now.getTime() + istOffset * 60 * 1000 + 5 * 1000);
    return istTime.toISOString().slice(11, 16);
  };

  useEffect(() => {
    setCurrentDate(getCurrentDate());
    setCurrentTime(getCurrentTimeIST());
    setTomorrowDate(getCurrentDatePlusOne());
  }, []);

  useEffect(() => {
    if (issuanceType === "Inhouse") {
      setTime(getCurrentTimeISTFiveSec());
      onReturnDateChange(`${getCurrentDate()}T${getCurrentTimeIST()}`);
    }
  }, [issuanceType]);

  const validate = () => {
    const newErrors = {};

    if (!userCredential) {
      newErrors.userCredential = "User credential is required.";
    }

    if (!issuanceType) {
      newErrors.issuanceType = "Issuance type is required.";
    }

    if (issuanceType === "Inhouse") {
      if (!time || time < currentTime) {
        newErrors.returnDate = "Return time cannot be before the current time.";
      }
    } else if (issuanceType === "Remote") {
      if (!returnDate) {
        newErrors.returnDate = "Return date is required.";
      }
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
      setTime(getCurrentTimeISTFiveSec());
      onReturnDateChange(`${getCurrentDate()}T${getCurrentTimeIST()}`);
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
        <Input label="User Name" name="userName" value={user?.userName} type="text" readOnly={true} disabled={true} />
        <Input label="Book Title" name="bookTitle" value={bookData?.bookTitle} type="text" readOnly={true} disabled={true} />

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
            <Input label="Return Date" name="returnDate" value={currentDate} type="date" readOnly={true} disabled={true} />
            <Input
              label="Return Time"
              name="returnTime"
              value={time}
              type="time"
              min={currentTime}
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
            min={`${tomorrowDate}T${getCurrentTimeIST()}`}
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
