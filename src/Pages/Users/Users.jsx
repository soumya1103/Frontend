import React, { useState, useEffect } from "react";
import DashboardHoc from "../../Coponents/HOC/DashboardHoc";
import Button from "../../Coponents/Button/Button";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import UserTable from "./UserTable";
import UserModal from "./UserModal";
import AssignBookModal from "./AssignBookModal";
import ConfirmationModal from "../../Coponents/Modal/ConfirmationModal";
import {
  addUser,
  deleteUser,
  getUserByRole,
  updateUser,
} from "../../Api/Service/UserService";
import { getAllBooks, getBookByTitle } from "../../Api/Service/BookService";
import { addIssuance } from "../../Api/Service/IssuanceService";
import Operation from "../../Coponents/Operation/Operation";

function Users() {
  const [users, setUsers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userData, setUserData] = useState({
    userCredential: "",
    userName: "",
    password: "",
  });
  const [userToEdit, setUserToEdit] = useState();
  const [userId, setUserId] = useState("");
  const [book, setBook] = useState();
  const [bookTitle, setBookTitle] = useState("");
  const [books, setBooks] = useState([]);
  const [returnDate, setReturnDate] = useState();
  const [issuanceType, setIssuanceType] = useState();
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadUsers();
    fetchBooks();
  }, []);

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
      console.error("Error fetching users:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await getAllBooks();
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const addUsers = async () => {
    try {
      const response = await addUser(userData);
      console.log("User added successfully:", response.data);
      setUsers([...users, response.data]);
      handleCloseUserModal();
      await loadUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const updateUsers = async () => {
    try {
      const response = await updateUser(userData, userToEdit);
      console.log("User updated successfully:", response.data);
      setUsers(
        users.map((user) => (user.userId === userToEdit ? response.data : user))
      );
      handleCloseUserModal();
      await loadUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const addIssuances = async () => {
    try {
      const response = await addIssuance({
        userId,
        bookId: book.bookId,
        returnDate,
        issuanceType,
      });
      console.log("Issuance added successfully:", response.data);
      handleCloseAssignModal();
      window.location.reload();
    } catch (error) {
      console.error("Error adding issuance:", error);
    }
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

  const handleDeleteIcon = (userId) => {
    setUserToDelete(userId);
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (userToDelete) {
        await deleteUser(userToDelete);
        console.log("User deleted successfully");
        await loadUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setShowConfirmationModal(false);
      setUserToDelete(null);
    }
  };

  const handleAssignBook = async (user) => {
    try {
      setUserData({
        userCredential: user.userCredential,
        userName: user.userName,
      });
      setUserId(user.userId);
      setShowAssignModal(true);
    } catch (error) {
      console.error("Error assigning book:", error);
    }
  };

  const handleBookChange = async (title) => {
    try {
      setBookTitle(title);
      const response = await getBookByTitle(title);
      setBook(response.data);
    } catch (error) {
      console.error("Error fetching book:", error);
    }
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

  const handleCloseUserModal = () => setShowUserModal(false);
  const handleCloseAssignModal = () => setShowAssignModal(false);
  const handleCloseConfirmationModal = () => setShowConfirmationModal(false);

  return (
    <div className="pages-outer-container">
      <div className="pages-inner-container">
        <SearchBar placeholder="Search User" onSearch={handleSearch} />
        <Button onClick={handleClick}>Add User</Button>
      </div>
      <div className="pages-table">
        <UserTable
          users={users}
          onEdit={handleEditIcon}
          onDelete={handleDeleteIcon}
          onAssign={handleAssignBook}
        />
      </div>
      <UserModal
        show={showUserModal}
        onClose={handleCloseUserModal}
        isEdit={isEdit}
        userData={userData}
        onChange={handleChange}
        onSubmit={isEdit ? updateUsers : addUsers}
      />
      <AssignBookModal
        show={showAssignModal}
        onClose={handleCloseAssignModal}
        bookTitle={bookTitle}
        books={books}
        book={book}
        userData={userData}
        returnDate={returnDate}
        issuanceType={issuanceType}
        onBookChange={handleBookChange}
        onReturnDateChange={setReturnDate}
        onIssuanceTypeChange={setIssuanceType}
        onSubmit={addIssuances}
      />
      {showConfirmationModal && (
        <ConfirmationModal
          show={showConfirmationModal}
          onClose={handleCloseConfirmationModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

export default DashboardHoc(Users);
