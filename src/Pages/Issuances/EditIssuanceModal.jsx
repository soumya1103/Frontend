import React, { useState, useEffect } from "react";
import Modal from "../../Coponents/Modal/Modal";
import Input from "../../Coponents/Input/Input";
import Button from "../../Coponents/Button/Button";
import { updateIssuance } from "../../Api/Service/IssuanceService";
import { getUserByRole, getUsersByCredential } from "../../Api/Service/UserService";
import { getAllBooks, getBookByTitle } from "../../Api/Service/BookService";

function EditIssuanceModal({ show, onClose, issuance, reloadIssuances }) {
  const [issuanceId, setIssuanceId] = useState();
  const [issuanceData, setIssuanceData] = useState({});
  const [userName, setUserName] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIssuanceData(issuance);

        const booksResponse = await getBookByTitle(issuance.bookTitle);
        setBooks(booksResponse.data.bookId);

        const usersResponse = await getUsersByCredential(issuance.userCredential);
        setUsers(usersResponse.data.userId);

        setUserName(issuance.userName || "");

        setIssuanceId(issuance.issuanceId);
      } catch (error) {
        console.error("Failed to fetch users or books", error);
      }
    };

    fetchData();
  }, [issuance]);

  const handleChange = (e) => {
    setIssuanceData({ ...issuanceData, [e.target.name]: e.target.value, userId: users, bookId: books });
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

      await updateIssuance(updatePayload, issuanceId);
      onClose();
      reloadIssuances();
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
