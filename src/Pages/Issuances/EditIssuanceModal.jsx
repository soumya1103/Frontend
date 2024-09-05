import React, { useState, useEffect } from "react";
import Modal from "../../Coponents/Modal/Modal";
import Input from "../../Coponents/Input/Input";
import Button from "../../Coponents/Button/Button";
import { updateIssuance } from "../../Api/Service/IssuanceService";
import { getUsersByCredential } from "../../Api/Service/UserService";
import { getBookByTitle, updateBook } from "../../Api/Service/BookService";

function EditIssuanceModal({ show, onClose, issuance, reloadIssuances, auth, render }) {
  const [issuanceId, setIssuanceId] = useState();
  const [issuanceData, setIssuanceData] = useState({});
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [originalStatus, setOriginalStatus] = useState("");

  const fetchData = async () => {
    try {
      setIssuanceData(issuance);
      setOriginalStatus(issuance.status);

      const booksResponse = await getBookByTitle(issuance.bookTitle, auth?.token);
      // setBooks(booksResponse.data.bookId);
      setBooks(booksResponse.data);

      const usersResponse = await getUsersByCredential(issuance.userCredential, auth?.token);
      // setUsers(usersResponse.data.userId);
      setUsers(usersResponse.data);

      setUserName(issuance.userName || "");

      setIssuanceId(issuance.issuanceId);
    } catch (error) {
      console.error("Failed to fetch users or books", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [issuance]);

  const handleChange = (e) => {
    // setIssuanceData({ ...issuanceData, [e.target.name]: e.target.value, userId: users.user, bookId: books });
    setIssuanceData({ ...issuanceData, [e.target.name]: e.target.value, userId: users.userId, bookId: books.bookId });
  };

  const updateBookCount = async (newStatus) => {
    try {
      const updatedBook = { ...books };

      // If status changes to "Issued" from "Returned" or new issuance
      if (newStatus === "Issued" && originalStatus !== "Issued") {
        updatedBook.bookCount = books.bookCount - 1;
      }

      // If status changes to "Returned" from "Issued"
      if (newStatus === "Returned" && originalStatus === "Issued") {
        updatedBook.bookCount = books.bookCount + 1;
      }

      // Update book only if the count is changed
      if (updatedBook.bookCount !== books.bookCount) {
        await updateBook(updatedBook, books.bookId, auth?.token);
      }
    } catch (error) {
      console.error("Failed to update book count", error);
    }
  };

  const handleUpdateIssuance = async () => {
    try {
      const updatePayload = {
        userId: issuanceData.userId,
        bookId: issuanceData.bookId,
        returnDate: issuanceData.returnDate,
        status: issuanceData.status,
        issuanceType: issuanceData.issuanceType,
      };

      await updateBookCount(issuanceData.status);

      await updateIssuance(updatePayload, issuanceId, auth?.token);

      onClose();
      reloadIssuances();
      render();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal show={show} onClose={onClose} height="380px" width="400px">
      <p className="form-title">Edit Issuance</p>
      <div className="form-content">
        <Input label="Phone No." value={issuanceData.userCredential} name="userCredential" type="text" readOnly={true} />
        <Input label="User Name" value={userName} name="userName" type="text" readOnly={true} />
        <Input label="Book Title" value={issuanceData.bookTitle} name="bookTitle" type="text" readOnly={true} />
        <Input label="Return Date" name="returnDate" type="datetime-local" onChange={handleChange} value={issuanceData.returnDate || ""} />
        <label className="form-field-label">Status</label>
        <select className="form-field-input" name="status" onChange={handleChange} value={issuanceData.status || ""}>
          <option value="">Select Status</option>
          <option value="Issued">Issued</option>
          <option value="Returned">Returned</option>
        </select>
        <Input label="Issuance Type" value={issuanceData.issuanceType} name="issuanceType" type="text" readOnly={true} />
      </div>
      <div className="form-submit-btn">
        <Button onClick={handleUpdateIssuance}>Update</Button>
      </div>
    </Modal>
  );
}

export default EditIssuanceModal;
