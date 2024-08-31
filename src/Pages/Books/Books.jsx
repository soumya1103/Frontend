import React, { useEffect, useState } from "react";
import DashboardHoc from "../../Coponents/HOC/DashboardHoc";
import Button from "../../Coponents/Button/Button";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import BookTable from "./BookTable";
import BookModal from "./BookModal";
import AssignModal from "./AssignModal";
import ConfirmationModal from "../../Coponents/Modal/ConfirmationModal";
import {
  addBook,
  deleteBook,
  getAllBooks,
  getBookByTitle,
  updateBook,
} from "../../Api/Service/BookService";
import { getAllCategories } from "../../Api/Service/CategoryService";
import {
  getUserByRole,
  getUsersByCredential,
} from "../../Api/Service/UserService";
import { addIssuance } from "../../Api/Service/IssuanceService";

function Books() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
  const [userCredential, setUserCredential] = useState("");
  const [issuanceType, setIssuanceType] = useState("");
  const [bookId, setBookId] = useState("");
  const [returnDate, setReturnDate] = useState();
  const [bookData, setBookData] = useState({
    categoryId: "",
    categoryName: "",
    bookTitle: "",
    bookAuthor: "",
    bookRating: "",
    bookCount: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [bookToEdit, setBookToEdit] = useState();
  const [showBookModal, setShowBookModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    loadBooks();
    fetchCategories();
    fetchUsers();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await getAllBooks();
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUserByRole();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setBookData({ ...bookData, categoryId: e.target.value });
  };

  const handleDeleteIcon = (bookId) => {
    setBookToDelete(bookId);
    setShowConfirmationModal(true);
  };

  const handleEditIcon = (book) => {
    setBookData({
      categoryId: book.categoryId,
      categoryName: book.categoryName,
      bookTitle: book.bookTitle,
      bookAuthor: book.bookAuthor,
      bookRating: book.bookRating,
      bookCount: book.bookCount,
    });
    setIsEdit(true);
    setBookToEdit(book.bookId);
    setShowBookModal(true);
  };

  const handleAssignUser = async (book) => {
    setBookData({ bookTitle: book.bookTitle });
    setShowAssignModal(true);
    try {
      const response = await getBookByTitle(book.bookTitle);
      setBookId(response.data.bookId);
    } catch (error) {
      console.log(error);
    }
  };

  const updateBooks = async (bookData, bookId) => {
    try {
      await updateBook(bookData, bookId);
      await loadBooks();
      handleCloseBookModal();
    } catch (error) {
      console.error("Error updating book", error);
    }
  };

  const addBooks = async (bookData) => {
    try {
      await addBook(bookData);
      await loadBooks();
      handleCloseBookModal();
    } catch (error) {
      console.error("Error adding book", error);
    }
  };

  const addIssuances = async (issuanceData) => {
    try {
      await addIssuance(issuanceData);
      handleCloseAssignModal();
      window.location.reload();
    } catch (error) {
      console.error("Error adding issuance", error);
    }
  };

  const handleCloseBookModal = () => setShowBookModal(false);

  const handleCloseAssignModal = () => setShowAssignModal(false);

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setBookToDelete(null);
  };

  const onSumbitAddHandler = async () => {
    await addBooks(bookData);
  };

  const onSumbitEditHandler = async () => {
    await updateBooks(bookData, bookToEdit);
  };

  const onSubmitAddIssuanceHandler = async () => {
    const obj = {
      userId: user.userId,
      bookId: bookId,
      returnDate: returnDate,
      issuanceType: issuanceType,
    };
    await addIssuances(obj);
  };

  const handleCredentialChange = async (credential) => {
    try {
      setUserCredential(credential);
      const response = await getUsersByCredential(credential);
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (bookToDelete) {
      try {
        await deleteBook(bookToDelete);
        await loadBooks();
      } catch (error) {
        console.error("Error deleting book", error);
      } finally {
        handleCloseConfirmationModal();
      }
    }
  };

  return (
    <div className="pages-outer-container">
      <div className="pages-inner-container">
        <SearchBar
          placeholder="Search Books"
          onSearch={(query) => console.log("Searching for:", query)}
        />
        <Button
          onClick={() => {
            setShowBookModal(true);
            setIsEdit(false);
          }}
        >
          Add Books
        </Button>
      </div>
      <div className="pages-table">
        <BookTable
          books={books}
          onEdit={handleEditIcon}
          onDelete={handleDeleteIcon}
          onAssign={handleAssignUser}
        />
      </div>
      <BookModal
        show={showBookModal}
        onClose={handleCloseBookModal}
        isEdit={isEdit}
        bookData={bookData}
        categories={categories}
        onCategoryChange={handleCategoryChange}
        onInputChange={handleChange}
        onSubmit={isEdit ? onSumbitEditHandler : onSumbitAddHandler}
      />
      <AssignModal
        show={showAssignModal}
        onClose={handleCloseAssignModal}
        userCredential={userCredential}
        user={user}
        bookData={bookData}
        returnDate={returnDate}
        issuanceType={issuanceType}
        users={users}
        onCredentialChange={handleCredentialChange}
        onReturnDateChange={setReturnDate}
        onIssuanceTypeChange={setIssuanceType}
        onSubmit={onSubmitAddIssuanceHandler}
      />
      <ConfirmationModal
        show={showConfirmationModal}
        onClose={handleCloseConfirmationModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default DashboardHoc(Books);
