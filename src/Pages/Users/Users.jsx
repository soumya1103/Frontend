import React, { useState, useEffect } from "react";
import DashboardHoc from "../../Component/HOC/DashboardHoc";
import Button from "../../Component/Button/Button";
import SearchBar from "../../Component/SearchBar/SearchBar";
import UserModal from "./UserModal";
import AssignBookModal from "./AssignBookModal";
import ConfirmationModal from "../../Component/Modal/ConfirmationModal";
import { addUser, deleteUser, getUserByRole, updateUser, userSearch } from "../../Api/Service/UserService";
import { getAllBooks, getAllBooksNp, getBookById, getBookByTitle, updateBook } from "../../Api/Service/BookService";
import { addIssuance, getIssuancesByUserId } from "../../Api/Service/IssuanceService";
import Operation from "../../Component/Operation/Operation";
import { useSelector } from "react-redux";
import UserIssuanceHistory from "./UserIssuanceHistory";
import Table from "../../Component/Table/Table";
import Loader from "../../Component/Loader/Loader";
import Toast from "../../Component/Toast/Toast";

function Users() {
  const [users, setUsers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userData, setUserData] = useState({
    userCredential: "",
    userName: "",
  });
  const [userToEdit, setUserToEdit] = useState();
  const [userId, setUserId] = useState("");
  const [book, setBook] = useState();
  const [bookTitle, setBookTitle] = useState("");
  const [books, setBooks] = useState([]);
  const [returnDate, setReturnDate] = useState();
  const [issuanceType, setIssuanceType] = useState();
  const [userToDelete, setUserToDelete] = useState(null);
  const [showIssuanceModal, setShowIssuanceModal] = useState(false);
  const [issuances, setIssuances] = useState([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const auth = useSelector((state) => state.auth);

  const [keyword, setKeyword] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");

  const getPageSizeBasedOnWidth = () => {
    const width = window.innerWidth;
    if (width > 1024) {
      return 9;
    } else if (width <= 1024) {
      return 14;
    }
  };

  const [size, setSize] = useState(getPageSizeBasedOnWidth());

  const handleResize = () => {
    const newSize = getPageSizeBasedOnWidth();
    setSize(newSize);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [page, size]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await getUserByRole(page, size, auth?.token);

      const usersData = response.data.content.map((user, index) => ({
        ...user,
        sNo: index + 1 + page * size,
        operation: (
          <Operation
            widthE="50%"
            widthD="45%"
            showExtra={true}
            isBooksPage={false}
            isHistory={true}
            onClickAssignBook={() => handleAssignBook(user)}
            onClickEdit={() => handleEditIcon(user)}
            onClickDelete={() => handleDeleteIcon(user.userId)}
            onClickUserHistory={() => handleShowIssuance(user.userId)}
          />
        ),
      }));
      setUsers(usersData);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearch = async () => {
    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword === "") {
      loadUsers();
      setSearchData([]);
    } else if (trimmedKeyword.length >= 3) {
      try {
        const response = await userSearch(trimmedKeyword);
        console.log(response.data);

        const usersData = response.data.map((user, index) => ({
          ...user,
          sNo: index + 1 + page * size,
          operation: (
            <Operation
              widthE="50%"
              widthD="45%"
              showExtra={true}
              isBooksPage={false}
              isHistory={true}
              onClickAssignBook={() => handleAssignBook(user)}
              onClickEdit={() => handleEditIcon(user)}
              onClickDelete={() => handleDeleteIcon(user.userId)}
              onClickUserHistory={() => handleShowIssuance(user.userId)}
            />
          ),
        }));
        setSearchData(usersData);
      } catch (error) {
        setToastMessage(error.response.data.message);
        setShowToast(true);
        setToastType("error");
      }
    } else if (trimmedKeyword.length < 3 && trimmedKeyword.length > 0) {
      setToastMessage("Atleast 3 characters are required!");
      setShowToast(true);
      setToastType("error");
    }
  };

  const handleOnChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    if (value.trim() === "") {
      loadUsers();
      setSearchData([]);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await getAllBooksNp(auth?.token);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const addUsers = async () => {
    try {
      const trimmedUserData = {
        ...userData,
        userCredential: userData.userCredential.trim(),
        userName: userData.userName.trim(),
      };
      const response = await addUser(trimmedUserData);
      if (response?.status === 200 || response?.status === 201) {
        setToastMessage("User added successfully!");
        setShowToast(true);
        setToastType("success");
      }
      setUsers([...users, response.data]);
      setUserData({
        userCredential: "",
        userName: "",
      });
      await loadUsers();
    } catch (error) {
      setToastMessage(error.response.data.message);
      setShowToast(true);
      setToastType("error");
    } finally {
      handleCloseUserModal();
    }
  };

  const updateUsers = async () => {
    try {
      const trimmedUserData = {
        ...userData,
        userCredential: userData.userCredential.trim(),
        userName: userData.userName.trim(),
      };
      const response = await updateUser(trimmedUserData, userToEdit);
      if (response?.status === 200 || response?.status === 201) {
        setToastMessage("User updated successfully!");
        setShowToast(true);
        setToastType("success");
      }
      setUsers(users.map((user) => (user.userId === userToEdit ? response.data : user)));
      setUserData({
        userCredential: "",
        userName: "",
      });
      await loadUsers();
    } catch (error) {
      setToastMessage(error.response.data.message);
      setShowToast(true);
      setToastType("error");
    } finally {
      handleCloseUserModal();
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

      if (response?.status === 200 || response?.status === 201) {
        setToastMessage("Book issued to user successfully!");
        setShowToast(true);
        setToastType("success");

        const { data } = await getBookById(book.bookId);
        console.log(data);

        const updatedBooks = { ...data, bookCount: data.bookCount - 1 };

        await updateBook(updatedBooks, updatedBooks.bookId, auth?.token);
      }
    } catch (error) {
      setToastMessage(error.response.data.message);
      setShowToast(true);
      setToastType("error");
    } finally {
      handleCloseAssignModal();
    }
  };

  const handleEditIcon = (user) => {
    setUserData({
      userCredential: user.userCredential,
      userName: user.userName,
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
      console.log(userToDelete);
      if (userToDelete) {
        const response = await deleteUser(userToDelete, auth?.token);
        if (response?.status === 200 || response?.status === 201) {
          setToastMessage("User deleted successfully!");
          setShowToast(true);
          setToastType("success");
        }
        await loadUsers();
      }
    } catch (error) {
      setToastMessage("User can't be deleted as a book is issued!");
      setShowToast(true);
      setToastType("error");
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
      const response = await getBookByTitle(title, auth?.token);
      setBook(response.data);
    } catch (error) {
      console.error("Error fetching book:", error);
    }
  };

  const handleClick = () => {
    setUserData({
      userCredential: "",
      userName: "",
    });
    setIsEdit(false);
    setShowUserModal(true);
  };

  const handleShowIssuance = async (userId) => {
    setShowIssuanceModal(true);
    try {
      const response = await getIssuancesByUserId(userId, auth?.token);
      setIssuances(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseUserModal = () => setShowUserModal(false);
  const handleCloseAssignModal = () => setShowAssignModal(false);
  const handleCloseConfirmationModal = () => setShowConfirmationModal(false);
  const handleCloseIssuanceModal = () => setShowIssuanceModal(false);

  const columns = [
    { header: "S.No.", accessor: "sNo" },
    { header: "Phone Number", accessor: "userCredential" },
    { header: "Name", accessor: "userName" },
    { header: "Operation", accessor: "operation" },
  ];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="pages-outer-container">
          <div className="pages-inner-container">
            <SearchBar placeholder="Search User" handleOnChange={handleOnChange} handleSearch={handleSearch} />
            <Button onClick={handleClick}>Add User</Button>
          </div>
          <div className="pages-table">
            {searchData.length !== 0 ? (
              <Table currentPage={page} totalPages={totalPages} columns={columns} data={searchData} onPageChange={setPage} />
            ) : (
              <Table show={true} currentPage={page} totalPages={totalPages} columns={columns} data={users} onPageChange={setPage} />
            )}
          </div>
          <UserIssuanceHistory show={showIssuanceModal} onClose={handleCloseIssuanceModal} data={issuances} />
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
            <ConfirmationModal show={showConfirmationModal} onClose={handleCloseConfirmationModal} onConfirm={handleConfirmDelete} />
          )}
        </div>
      )}
      <Toast message={toastMessage} type={toastType} show={showToast} onClose={() => setShowToast(false)} />
    </>
  );
}

export default DashboardHoc(Users);
