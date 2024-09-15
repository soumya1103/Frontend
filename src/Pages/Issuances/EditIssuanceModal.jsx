import React, { useState, useEffect } from "react";
import Modal from "../../Component/Modal/Modal";
import Input from "../../Component/Input/Input";
import Button from "../../Component/Button/Button";
import { updateIssuance } from "../../Api/Service/IssuanceService";
import { getUsersByCredential } from "../../Api/Service/UserService";
import { getBookByTitle, updateBook } from "../../Api/Service/BookService";
import Error from "../../Component/Error/Error";
import Toast from "../../Component/Toast/Toast";

function EditIssuanceModal({ show, onClose, issuance, reloadIssuances, render }) {
  const [issuanceData, setIssuanceData] = useState({});
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [originalStatus, setOriginalStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [currentDate, setCurrentDate] = useState("");
  const [time, setTime] = useState("");
  const [issuanceType, setIssuanceType] = useState("");
  const [minReturnDate, setMinReturnDate] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIssuanceData(issuance);
        setOriginalStatus(issuance.status);

        const booksResponse = await getBookByTitle(issuance.bookTitle);
        setBooks(booksResponse.data);

        const usersResponse = await getUsersByCredential(issuance.userCredential);
        setUsers(usersResponse.data);

        setUserName(issuance.userName || "");
        setIssuanceType(issuance.issuanceType || "");

        const now = new Date();
        const dateString = now.toISOString().split("T")[0];
        const timeString = now.toTimeString().slice(0, 5);
        setCurrentDate(dateString);
        setTime(timeString);
        setMinReturnDate(`${dateString}T${timeString}`);
      } catch (error) {
        console.error("Failed to fetch users or books", error);
      }
    };
    fetchData();
  }, [issuance]);

  const validate = () => {
    const newErrors = {};
    if (!issuanceData.returnDate) newErrors.returnDate = "Return date is required.";
    if (!issuanceData.status) newErrors.status = "Status is required.";
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

  const handleChange = (e) => {
    setIssuanceData({ ...issuanceData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleReturnDateChange = (e) => {
    setIssuanceData({ ...issuanceData, returnDate: e.target.value });
    setErrors((prev) => ({ ...prev, returnDate: "" }));
  };

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    if (selectedTime < issueTime) {
      setToastMessage("Time selected is prior to return time.");
      setShowToast(true);
      setToastType("error");
    } else {
      setTime(selectedTime);
      setIssuanceData({
        ...issuanceData,
        returnDate: `${currentDate}T${selectedTime}`,
      });
      setErrors((prev) => ({ ...prev, returnDate: "" }));
    }
  };

  const updateBookCount = async (newStatus) => {
    try {
      const updatedBook = { ...books };

      if (newStatus === "Issued" && originalStatus !== "Issued") {
        updatedBook.bookCount = books.bookCount - 1;
      }

      if (newStatus === "Returned" && originalStatus === "Issued") {
        updatedBook.bookCount = books.bookCount + 1;
      }

      if (updatedBook.bookCount !== books.bookCount) {
        await updateBook(updatedBook, books.bookId);
      }
    } catch (error) {
      console.error("Failed to update book count", error);
    }
  };

  const handleUpdateIssuance = async () => {
    if (validate()) {
      try {
        const updatePayload = {
          userId: issuanceData.userId,
          bookId: issuanceData.bookId,
          returnDate: issuanceData.returnDate,
          status: issuanceData.status,
          issuanceType: issuanceData.issuanceType,
        };

        await updateBookCount(issuanceData.status);
        const response = await updateIssuance(updatePayload, issuance.issuanceId);
        if (response?.status === 200 || response?.status === 201) {
          setToastMessage("Issuance updated successfully!");
          setShowToast(true);
          setToastType("success");
        }

        onClose();
        reloadIssuances();
        render();
      } catch (error) {
        setToastMessage("There was an error processing the request!");
        setShowToast(true);
        setToastType("error");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString();
    return formattedDate;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    return formattedTime;
  };

  const issueTime = formatTime(issuanceData.issueDate);
  const issDate = formatDate(issuanceData.returnDate);
  const returnTime = formatTime(issuanceData.returnDate);

  const modalDimensions =
    errors.returnDate || errors.status
      ? { height: "520px", width: "430px" }
      : issuanceType === "Inhouse"
      ? { height: "520px", width: "400px" }
      : { height: "440px", width: "400px" };

  return (
    <>
      <Modal show={show} onClose={onClose} height={modalDimensions.height} width={modalDimensions.width}>
        <p className="form-title">Edit Issuance</p>
        <div>
          <Input label="Phone No." value={issuanceData.userCredential} name="userCredential" type="text" readOnly={true} />
          <Input label="User Name" value={userName} name="userName" type="text" readOnly={true} />
          <Input label="Book Title" value={issuanceData.bookTitle} name="bookTitle" type="text" readOnly={true} />
          <Input label="Issuance Type" value={issuanceData.issuanceType} name="issuanceType" type="text" readOnly={true} />

          {issuanceType === "Inhouse" ? (
            <>
              <Input label="Return Date" value={issDate || ""} readOnly={true} />
              <Input label="Return Time" name="returnTime" type="time" value={returnTime} onChange={handleTimeChange} />
            </>
          ) : (
            <Input
              label="Return Date"
              name="returnDate"
              type="datetime-local"
              min={minReturnDate}
              value={issuanceData.returnDate || ""}
              onChange={handleReturnDateChange}
              error={errors.returnDate}
            />
          )}

          <div className="form-content">
            <label className="form-field-label">Status</label>
            <select className="form-field-input" name="status" onChange={handleChange} value={issuanceData.status || ""}>
              <option value="">Select Status</option>
              <option value="Issued">Issued</option>
              <option value="Returned">Returned</option>
            </select>
            <div></div>
            {errors.status && <Error error={errors.status} />}
          </div>
        </div>
        <div className="form-submit-btn">
          <Button onClick={handleUpdateIssuance}>Update</Button>
        </div>
      </Modal>
      <Toast message={toastMessage} type={toastType} show={showToast} onClose={() => setShowToast(false)} />
    </>
  );
}

export default EditIssuanceModal;
