import React, { useState, useEffect } from "react";
import Modal from "../../Coponents/Modal/Modal";
import Input from "../../Coponents/Input/Input";
import Button from "../../Coponents/Button/Button";
import { addIssuance } from "../../Api/Service/IssuanceService";
import { getUserByRole, getUsersByCredential } from "../../Api/Service/UserService";
import { getAllBooks, getBookByTitle } from "../../Api/Service/BookService";

function AddIssuanceModal({ show, onClose, reloadIssuances }) {
  const [issuanceData, setIssuanceData] = useState({
    userId: "",
    bookId: "",
    returnDate: "",
    status: "",
    issuanceType: "",
  });
  const [userName, setUserName] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const usersResponse = await getUserByRole();
      setUsers(usersResponse.data);

      const booksResponse = await getAllBooks();
      setBooks(booksResponse.data);
    };

    fetchData();
  }, []);

  const handleCredentialChange = async (e) => {
    try {
      const response = await getUsersByCredential(e.target.value);
      setIssuanceData({ ...issuanceData, userId: response.data.userId });
      setUserName(response.data.userName);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookChange = async (e) => {
    try {
      const response = await getBookByTitle(e.target.value);
      setIssuanceData({ ...issuanceData, bookId: response.data.bookId });
      setBookAuthor(response.data.bookAuthor);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setIssuanceData({ ...issuanceData, [e.target.name]: e.target.value });
  };

  const handleAddIssuance = async () => {
    try {
      await addIssuance(issuanceData);
      onClose();
      reloadIssuances();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal show={show} onClose={onClose} height="380px" width="400px">
      <p className="form-title">Add Issuance</p>
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
        <Input label="User Name" value={userName} name="userName" type="text" readOnly={true} />
        <label className="form-field-label">Book Title</label>
        <select className="form-field-input" name="bookTitle" onChange={handleBookChange}>
          <option value="">Select Book</option>
          {books.map((book) => (
            <option key={book.bookId} value={book.bookTitle}>
              {book.bookTitle}
            </option>
          ))}
        </select>
        <Input label="Book Author" value={bookAuthor} name="bookAuthor" type="text" readOnly={true} />
        <Input label="Return Date" name="returnDate" type="datetime-local" onChange={handleChange} value={issuanceData.returnDate || ""} />
        <label className="form-field-label">Issuance Type</label>
        <select className="form-field-input" name="issuanceType" onChange={handleChange} value={issuanceData.issuanceType || ""}>
          <option value="">Select Type</option>
          <option value="Remote">Remote</option>
          <option value="Inhouse">Inhouse</option>
        </select>
      </div>
      <div className="form-submit-btn">
        <Button onClick={handleAddIssuance}>Add</Button>
      </div>
    </Modal>
  );
}

export default AddIssuanceModal;
