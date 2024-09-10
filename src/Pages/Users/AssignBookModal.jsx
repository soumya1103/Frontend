import React, { useEffect, useState } from "react";
import Modal from "../../Coponents/Modal/Modal";
import Input from "../../Coponents/Input/Input";
import Button from "../../Coponents/Button/Button";
import Error from "../../Coponents/Error/Error";

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
  const [errors, setErrors] = useState({});
  const [type, setType] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [time, setTime] = useState("");
  const [tomorrowDate, setTomorrowDate] = useState("");
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

    if (!bookTitle) {
      newErrors.bookTitle = "Book title is required.";
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

  const handleBookChange = (value) => {
    onBookChange(value);
    setErrors((prevErrors) => ({ ...prevErrors, bookTitle: "" }));
  };

  const handleIssuanceTypeChange = (value) => {
    onIssuanceTypeChange(value);
    setType(value);

    setErrors((prevErrors) => ({ ...prevErrors, issuanceType: "" }));

    if (value === "Inhouse") {
      setCurrentDate(getCurrentDate());
      setTime(getCurrentTimeISTFiveSec());
      onReturnDateChange(`${getCurrentDate()}T${getCurrentTimeIST()}`);
    }
  };

  const handleTimeChange = (value) => {
    setTime(value);
    onReturnDateChange(`${currentDate}T${value}`);

    setErrors((prevErrors) => ({ ...prevErrors, returnDate: "" }));
  };

  const handleDateTimeChange = (value) => {
    onReturnDateChange(value);

    setErrors((prevErrors) => ({ ...prevErrors, returnDate: "" }));
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit();
    }
  };

  const modalDimensions =
    errors.bookTitle || errors.issuanceType || (errors.returnDate && type === "Inhouse")
      ? { height: "555px", width: "490px" }
      : type === "Inhouse"
      ? { height: "500px", width: "410px" }
      : { height: "455px", width: "400px" };

  return (
    <Modal show={show} onClose={onClose} height={modalDimensions.height} width={modalDimensions.width}>
      <p className="form-title">Issue Book</p>
      <div>
        <div className="form-content">
          <label className="form-field-label">Book Title</label>
          <select className="form-field-input" value={bookTitle} onChange={(e) => handleBookChange(e.target.value)}>
            <option value="">Select Book</option>
            {books.map((book) => (
              <option key={book.bookId} value={book?.bookTitle}>
                {book.bookTitle}
              </option>
            ))}
          </select>
          <div></div>
          {errors.bookTitle && <Error error={errors.bookTitle} />}
        </div>
        <Input label="Book Author" name="bookAuthor" value={book?.bookAuthor} type="text" readOnly />

        <Input label="Phone No" name="userCredential" value={userData?.userCredential} type="text" readOnly={true} />
        <Input label="User Name" name="userName" value={userData?.userName} type="text" readOnly={true} />

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

export default AssignBookModal;
