import React, { useState, useEffect } from "react";
import Modal from "../../Coponents/Modal/Modal";
import Input from "../../Coponents/Input/Input";
import Button from "../../Coponents/Button/Button";
import { addIssuance } from "../../Api/Service/IssuanceService";
import { getUserByRoleNp, getUsersByCredential } from "../../Api/Service/UserService";
import { getAllBooksNp, getBookByTitle, updateBook } from "../../Api/Service/BookService";
import Error from "../../Coponents/Error/Error";
import Toast from "../../Coponents/Toast/Toast";

function AddIssuanceModal({ show, onClose, reloadIssuances, auth, renderUtil }) {
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
    const usersResponse = await getUserByRoleNp(auth?.token);
    setUsers(usersResponse.data);

    const booksResponse = await getAllBooksNp(auth?.token);
    setBooks(booksResponse.data);
  };

  useEffect(() => {
    fetchData();
  }, [renderUtil]);

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toISOString().split("T")[0]);
    setTime(now.toTimeString().slice(0, 5));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!issuanceData.userId) newErrors.userId = "User is required.";
    if (!issuanceData.bookId) newErrors.bookId = "Book is required.";
    if (!issuanceData.issuanceType) newErrors.issuanceType = "Issuance type is required.";
    if (!issuanceData.returnDate) newErrors.returnDate = "Return date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCredentialChange = async (e) => {
    try {
      const response = await getUsersByCredential(e.target.value, auth?.token);
      setIssuanceData({ ...issuanceData, userId: response.data.userId });
      setUserName(response.data.userName);
      setErrors((prev) => ({ ...prev, userId: "" }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookChange = async (e) => {
    try {
      const response = await getBookByTitle(e.target.value, auth?.token);
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

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    setTime(selectedTime);
    setIssuanceData({
      ...issuanceData,
      returnDate: `${currentDate}T${selectedTime}`,
    });
    setErrors((prev) => ({ ...prev, returnDate: "" }));
  };

  const handleAddIssuance = async () => {
    if (validate()) {
      try {
        const response = await addIssuance(issuanceData, auth?.token);
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
          await updateBook(updatedBookData, issuanceData.bookId, auth?.token);
        }
        onClose();
        reloadIssuances();
        resetForm();
      } catch (error) {
        setToastMessage("There was an error processing the request!");
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
            {errors.issuanceType && <Error error={errors.issuanceType} />}
          </div>
          {issuanceType === "Inhouse" ? (
            <>
              <Input label="Return Date" value={currentDate} readOnly={true} />
              <Input label="Return Time" type="time" value={time} onChange={handleTimeChange} />
            </>
          ) : (
            <Input
              label="Return Date"
              type="datetime-local"
              value={issuanceData.returnDate}
              min={`${currentDate}T${time}`}
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
