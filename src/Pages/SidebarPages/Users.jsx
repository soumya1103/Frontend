import React, { useEffect, useState } from "react";
import DashboardHoc from "../../Coponents/HOC/DashboardHoc";
import Button from "../../Coponents/Button/Button";
import Table from "../../Coponents/Table/Table";
import "./Pages.css";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import Operation from "../../Coponents/Operation/Operation";
import {
  addUser,
  deleteUser,
  getUserByRole,
  getUsersByCredential,
  updateUser,
} from "../../Api/Service/UserService";
import Modal from "../../Coponents/Modal/Modal";
import Input from "../../Coponents/Input/Input";
import { getAllBooks, getBookByTitle } from "../../Api/Service/BookService";
import { addIssuance } from "../../Api/Service/IssuanceService";

function Users() {
  const columns = [
    { header: "Phone Number", accessor: "userCredential" },
    { header: "Name", accessor: "userName" },
    { header: "Operation", accessor: "operation" },
  ];

  // array of all user objects
  const [users, setUsers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState();
  const [userId, setUserId] = useState("");

  // book object
  const [book, setBook] = useState();
  const [bookTitle, setBookTitle] = useState("");
  //array of all books
  const [books, setBooks] = useState([]);

  const [returnDate, setReturnDate] = useState();
  const [issuanceType, setIssuanceType] = useState();
  const [issuance, setIssuance] = useState([]);

  // object of one user
  const [userData, setUserData] = useState({
    userCredential: "",
    userName: "",
    password: "",
  });

  const loadUsers = async () => {
    try {
      const response = await getUserByRole();
      const usersData = response.data.map((user) => ({
        ...user,
        operation: (
          <Operation
            widthE="50%"
            widthD="45%"
            showExtra={true}
            isBooksPage={false}
            onClickAssignBook={() => handleAssignBook(user)}
            onClickEdit={() => handleEditIcon(user)}
            onClickDelete={() => handleDeleteIcon(user.userId)}
          />
        ),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("There was an error fetching the users data!", error);
    }
  };

  useEffect(() => {
    loadUsers();
    fetchBooks();
  }, []);

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const updateUsers = async (userData, userId) => {
    try {
      const response = await updateUser(userData, userId);
      console.log("User edited successfully:", response.data);
      setUsers([...users, response.data]);
      handleCloseUserModal();
      await loadUsers();
    } catch (error) {
      console.log("There was an error updating the user", error);
    }
  };

  const addUsers = async (userData) => {
    try {
      const response = await addUser(userData);
      console.log("User added successfully:", response.data);
      setUsers([...users, response.data]);
      handleCloseUserModal();
      await loadUsers();
    } catch (error) {
      console.log("There was an error adding the user!", error);
    }
  };

  const addIssuances = async (issuanceData) => {
    try {
      console.log(issuanceData);
      const response = await addIssuance(issuanceData);
      console.log("Issuance added successfully:", response.data);
      setIssuance([...issuance, response.data]);
      handleCloseAssignModal();
      window.location.reload();
    } catch (error) {
      console.log("There was an error adding the issuance!", error);
    }
  };

  const onSumbitEditHandler = async () => {
    await updateUsers(userData, userToEdit);
  };

  const onSumbitAddHandler = async () => {
    await addUsers(userData);
  };

  const onSubmitAddIssuanceHandler = async () => {
    const obj = {
      userId: userId,
      bookId: book.bookId,
      returnDate: returnDate,
      issuanceType: issuanceType,
    };
    await addIssuances(obj);
  };

  const handleClick = () => {
    setUserData({
      userCredential: "",
      userName: "",
      password: "",
    });
    setIsEdit(false);
    setShowUserModal(true);
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
  };

  const handleEditIcon = (user) => {
    setUserData({
      userCredential: user.userCredential,
      userName: user.userName,
      password: user.password,
    });
    setIsEdit(true);
    setShowUserModal(true);
    setUserToEdit(user.userId);
  };

  const handleDeleteIcon = async (userId) => {
    try {
      const response = await deleteUser(userId);
      console.log("User deleted successfully:", response.data);
      await loadUsers();
    } catch (error) {
      console.error("There was an error deleting the user!", error);
    }
  };

  const handleAssignBook = async (user) => {
    try {
      setUserData({
        userCredential: user.userCredential,
        userName: user.userName,
      });
      setShowAssignModal(true);
      const response = await getUsersByCredential(user.userCredential);
      setUserId(response.data.userId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookChange = async (title) => {
    try {
      setBookTitle(title);
      const response = await getBookByTitle(title);
      setBook(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBooks = async () => {
    const response = await getAllBooks();
    setBooks(response.data);
  };

  return (
    <div className="pages-outer-container">
      <div className="pages-inner-container">
        <SearchBar placeholder="Search User" onSearch={handleSearch} />
        <Button onClick={handleClick}>Add User</Button>
      </div>
      <div className="pages-table">
        <Table columns={columns} data={users} />
      </div>
      <Modal
        show={showUserModal}
        onClose={handleCloseUserModal}
        height="250px"
        width="400px"
      >
        {isEdit ? (
          <p className="form-title">Edit User</p>
        ) : (
          <p className="form-title">Add User</p>
        )}

        <div className="form-content">
          <Input
            label="Phone Number"
            name="userCredential"
            value={userData.userCredential}
            type="number"
            className="no-spinner"
            required={isEdit ? false : true}
            onChange={(e) => {
              if (e.target.value.length < 11) {
                handleChange(e);
              }
            }}
            maxLength={10}
          />
          <Input
            label="User Name"
            name="userName"
            value={userData.userName}
            type="text"
            required={isEdit ? false : true}
            onChange={(e) => handleChange(e)}
          />
          <Input
            label="Password"
            name="password"
            value={userData.password}
            type="text"
            required={isEdit ? false : true}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="form-submit-btn">
          {isEdit ? (
            <Button onClick={onSumbitEditHandler}>Update</Button>
          ) : (
            <Button onClick={onSumbitAddHandler}>Add</Button>
          )}
        </div>
      </Modal>

      <Modal
        show={showAssignModal}
        onClose={handleCloseAssignModal}
        height="370px"
        width="400px"
      >
        <p className="form-title">Issue Book</p>
        <div className="form-content">
          <label className="form-field-label">Book Title</label>
          <select
            className="form-field-input"
            value={bookTitle}
            onChange={(e) => {
              handleBookChange(e.target.value);
            }}
          >
            <option value="">Select Book</option>
            {books.map((book) => (
              <option key={book.bookId} value={book?.bookTitle}>
                {book.bookTitle}
              </option>
            ))}
          </select>
          <Input
            label="Book Author"
            name="bookAuthor"
            value={book?.bookAuthor}
            type="text"
            readOnly={true}
          />
          <Input
            label="Phone No"
            name="userCredential"
            value={userData?.userCredential}
            type="text"
            readOnly={true}
          />
          <Input
            label="User Name"
            name="userName"
            value={userData?.userName}
            type="text"
            readOnly={true}
          />
          <Input
            label="Return Date"
            name="returnDate"
            value={returnDate}
            type="datetime-local"
            required={true}
            onChange={(e) => setReturnDate(e.target.value)}
          />
          <label className="form-field-label">Issuance Type</label>
          <select
            className="form-field-input"
            value={issuanceType}
            onChange={(e) => setIssuanceType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="Remote">Remote</option>
            <option value="Inhouse">Inhouse</option>
          </select>
        </div>
        <div className="form-submit-btn">
          <Button onClick={() => onSubmitAddIssuanceHandler()}>Issue</Button>
        </div>
      </Modal>
    </div>
  );
}

export default DashboardHoc(Users);
