import React, { useState, useEffect } from "react";
import Modal from "../../Component/Modal/Modal";
import Input from "../../Component/Input/Input";
import Button from "../../Component/Button/Button";
import { addIssuance } from "../../Api/Service/IssuanceService";
import { getUserByRoleNp, getUsersByCredential } from "../../Api/Service/UserService";
import { getAllBooksNp, getBookByTitle, updateBook } from "../../Api/Service/BookService";
import Error from "../../Component/Error/Error";
import Toast from "../../Component/Toast/Toast";

function AddIssuanceModal({ show, onClose, reloadIssuances, renderUtil }) {
  const initialIssuanceData = {
    userId: "",
    bookId: "",
    returnDate: "",
    status: "",
    issuanceType: "",
  };

  const [issuanceData, setIssuanceData] = useState(initialIssuanceData);
  const [userName, setUserName] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [errors, setErrors] = useState({});
  const [currentDate, setCurrentDate] = useState("");
  const [time, setTime] = useState("");
  const [issuanceType, setIssuanceType] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");

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
    if (issuanceData.issuanceType === "Inhouse") {
      setTime(getCurrentTimeISTFiveSec());
    }
  }, [issuanceData.issuanceType]);

  const resetForm = () => {
    setIssuanceData(initialIssuanceData);
    setUserName("");
    setBookAuthor("");
    setIssuanceType("");
    setTime("");
    setErrors({});
  };

  useEffect(() => {
    if (show) {
      resetForm();
    }
  }, [show]);

  const fetchData = async () => {
    const usersResponse = await getUserByRoleNp();
    setUsers(usersResponse.data);

    const booksResponse = await getAllBooksNp();
    setBooks(booksResponse.data);
  };

  useEffect(() => {
    fetchData();
  }, [renderUtil]);

  const validate = () => {
    const newErrors = {};
    if (!issuanceData.userId) newErrors.userId = "User is required.";
    if (!issuanceData.bookId) newErrors.bookId = "Book is required.";
    if (!issuanceData.issuanceType) newErrors.issuanceType = "Issuance type is required.";

    if (issuanceData.issuanceType === "Inhouse") {
      if (!time || time?.length < 1) {
        newErrors.returnDate = "Return time is required!";
      } else if (time < currentTime) {
        newErrors.returnDate = "Return time cannot be before the current time.";
      }
    } else if (issuanceData.issuanceType === "Remote") {
      if (!issuanceData.returnDate) {
        newErrors.returnDate = "Return date is required.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCredentialChange = async (e) => {
    try {
      const response = await getUsersByCredential(e.target.value);
      setIssuanceData({ ...issuanceData, userId: response.data.userId });
      setUserName(response.data.userName);
      setErrors((prev) => ({ ...prev, userId: "" }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookChange = async (e) => {
    try {
      const response = await getBookByTitle(e.target.value);
      setIssuanceData({ ...issuanceData, bookId: response.data.bookId });
      setBookAuthor(response.data.bookAuthor);
      setErrors((prev) => ({ ...prev, bookId: "" }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleIssuanceTypeChange = (e) => {
    const { value } = e.target;
    setIssuanceType(value);
    setIssuanceData((prev) => ({
      ...prev,
      issuanceType: value,
      returnDate: value === "Inhouse" ? `${currentDate}T${time}` : "",
    }));
    setErrors((prev) => ({ ...prev, issuanceType: "" }));
  };

  const handleReturnDateChange = (e) => {
    setIssuanceData({ ...issuanceData, returnDate: e.target.value });
    setErrors((prev) => ({ ...prev, returnDate: "" }));
  };

  const handleTimeChange = (value) => {
    setTime(value);
    setIssuanceData({
      ...issuanceData,
      returnDate: `${currentDate}T${value}`,
    });
  };

  const handleAddIssuance = async () => {
    if (validate()) {
      try {
        const response = await addIssuance(issuanceData);
        if (response?.status === 200 || response?.status === 201) {
          setToastMessage("Issuance added successfully!");
          setShowToast(true);
          setToastType("success");
        }

        const issuedBook = books.find((book) => book.bookId === issuanceData.bookId);
        if (issuedBook) {
          const updatedBookData = {
            ...issuedBook,
            bookCount: issuedBook.bookCount - 1,
          };
          await updateBook(updatedBookData, issuanceData.bookId);
        }
        onClose();
        reloadIssuances();
        resetForm();
      } catch (error) {
        setToastMessage("Return time and issued time can't be same.");
        setShowToast(true);
        setToastType("error");
      }
    }
  };

  const modalDimensions =
    errors.userId || errors.bookId || errors.issuanceType || errors.returnDate
      ? { height: "550px", width: "430px" }
      : { height: "470px", width: "400px" };

  return (
    <>
      <Modal
        show={show}
        onClose={() => {
          resetForm();
          onClose();
        }}
        height={modalDimensions.height}
        width={modalDimensions.width}
      >
        <p className="form-title">Add Issuance</p>
        <div>
          <div className="form-content">
            <label className="form-field-label">Phone No.</label>
            <select className="form-field-input" name="userCredential" onChange={handleCredentialChange}>
              <option value="">Select Phone No.</option>
              {users.map((user) => (
                <option key={user.userId} value={user.userCredential}>
                  {user.userCredential}
                </option>
              ))}
            </select>
            <div></div>
            {errors.userId && <Error error={errors.userId} />}
          </div>

          <Input label="User Name" value={userName} name="userName" type="text" readOnly={true} />

          <div className="form-content">
            <label className="form-field-label">Book Title</label>
            <select className="form-field-input" name="bookTitle" onChange={handleBookChange}>
              <option value="">Select Book</option>
              {books.map((book) => (
                <option key={book.bookId} value={book.bookTitle} disabled={book.bookCount === 0}>
                  {book.bookTitle}
                </option>
              ))}
            </select>
            <div></div>
            {errors.bookId && <Error error={errors.bookId} />}
          </div>

          <Input label="Book Author" value={bookAuthor} name="bookAuthor" type="text" readOnly={true} />

          <div className="form-content">
            <label className="form-field-label">Issuance Type</label>
            <select className="form-field-input" name="issuanceType" onChange={handleIssuanceTypeChange} value={issuanceType}>
              <option value="">Select Type</option>
              <option value="Remote">Remote</option>
              <option value="Inhouse">Inhouse</option>
            </select>
            <div></div>
            {errors.issuanceType && <Error error={errors.issuanceType} />}
          </div>
          {issuanceType === "Inhouse" ? (
            <>
              <Input label="Return Date" value={currentDate} readOnly={true} />
              <Input
                label="Return Time"
                name="returnTime"
                type="time"
                value={time}
                min={currentTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                error={errors.returnDate}
              />
            </>
          ) : (
            <Input
              label="Return Date"
              type="datetime-local"
              value={issuanceData.returnDate}
              min={`${tomorrowDate}T${getCurrentTimeIST()}`}
              onChange={handleReturnDateChange}
              error={errors.returnDate}
            />
          )}
        </div>
        <div className="form-submit-btn">
          <Button onClick={handleAddIssuance}>Add</Button>
        </div>
      </Modal>
      <Toast message={toastMessage} type={toastType} show={showToast} onClose={() => setShowToast(false)} />
    </>
  );
}

export default AddIssuanceModal;
