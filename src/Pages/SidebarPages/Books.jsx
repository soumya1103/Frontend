import React, { useEffect, useState } from "react";
import DashboardHoc from "../../Coponents/HOC/DashboardHoc";
import Button from "../../Coponents/Button/Button";
import Table from "../../Coponents/Table/Table";
import "./Pages.css";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import Operation from "../../Coponents/Operation/Operation";
import {
  addBook,
  deleteBook,
  getAllBooks,
  getBookByTitle,
  updateBook,
} from "../../Api/Service/BookService";
import Modal from "../../Coponents/Modal/Modal";
import Input from "../../Coponents/Input/Input";
import { getAllCategories } from "../../Api/Service/CategoryService";
import {
  getUserByRole,
  getUsersByCredential,
} from "../../Api/Service/UserService";
import { addIssuance } from "../../Api/Service/IssuanceService";

function Books() {
  const [books, setBooks] = useState([]);
  const [issuance, setIssuance] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [bookToEdit, setBookToEdit] = useState();
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
  const [userCredential, setUserCredential] = useState("");
  const [issuanceType, setIssuanceType] = useState("");
  const [bookId, setBookId] = useState("");
  const [returnDate, setReturnDate] = useState();
  const [showBookModal, setShowBookModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const [bookData, setBookData] = useState({
    categoryId: "",
    categoryName: "",
    bookTitle: "",
    bookAuthor: "",
    bookRating: "",
    bookCount: "",
    bookId: "",
  });

  const handleChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setBookData({ ...bookData, categoryId: e.target.value });
  };

  const columns = [
    { header: "Category", accessor: "categoryName" },
    { header: "Title", accessor: "bookTitle" },
    { header: "Author", accessor: "bookAuthor" },
    { header: "Rating", accessor: "bookRating" },
    { header: "Count", accessor: "bookCount" },
    { header: "Action", accessor: "operation" },
  ];

  const loadBooks = async () => {
    try {
      const response = await getAllBooks();
      const booksData = response.data.map((book) => ({
        ...book,
        operation: (
          <Operation
            widthE="100%"
            widthD="80%"
            showExtra={true}
            onClickAssignUser={() => handleAssignUser(book)}
            isBooksPage={true}
            onClickEdit={() => handleEditIcon(book)}
            onClickDelete={() => handleDeleteIcon(book.bookId)}
          />
        ),
      }));

      setBooks(booksData);
    } catch (error) {
      console.error("There was an error fetching the books data!", error);
    }
  };

  const handleDeleteIcon = async (bookId) => {
    try {
      const response = await deleteBook(bookId);
      console.log("Book deleted successfully:", response.data);
      await loadBooks();
    } catch (error) {
      console.error("There was an error deleting the book!", error);
    }
  };

  const handleClick = () => {
    setBookData({
      categoryId: "",
      categoryName: "",
      bookTitle: "",
      bookAuthor: "",
      bookRating: "",
      bookCount: "",
    });
    setIsEdit(false);
    setShowBookModal(true);
  };

  const handleCloseBookModal = () => {
    setShowBookModal(false);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
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
    setShowBookModal(true);
    setBookToEdit(book.bookId);
  };

  const handleAssignUser = async (book) => {
    try {
      setBookData({
        bookTitle: book.bookTitle,
      });
      setShowAssignModal(true);
      const response = await getBookByTitle(book.bookTitle);
      setBookId(response.data.bookId);
    } catch (error) {
      console.log(error);
    }
  };

  const updateBooks = async (bookData, bookId) => {
    try {
      const response = await updateBook(bookData, bookId);
      console.log("Book edited successfully:", response.data);
      setBooks([...books, response.data]);
      handleCloseBookModal();
      await loadBooks();
    } catch (error) {
      console.log("There was an error updating the book", error);
    }
  };

  const addBooks = async (bookData) => {
    try {
      console.log(bookData);
      const response = await addBook(bookData);
      console.log("Book added successfully:", response.data);
      setBooks([...books, response.data]);
      handleCloseBookModal();
      await loadBooks();
    } catch (error) {
      console.log("There was an error adding the book!", error);
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

  useEffect(() => {
    loadBooks();
    fetchCategories();
    fetchUsers();
  }, []);

  const handleSearch = (query) => {
    console.log("Searching for:", query);
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
      returnDate: returnDate + "T00:00:00",
      issuanceType: issuanceType,
    };
    await addIssuances(obj);
  };

  const fetchCategories = async () => {
    const response = await getAllCategories();
    setCategories(response.data);
  };

  const fetchUsers = async () => {
    const response = await getUserByRole();
    setUsers(response.data);
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

  return (
    <div className="pages-outer-container">
      <div className="pages-inner-container">
        <SearchBar placeholder="Search Books" onSearch={handleSearch} />
        <Button onClick={handleClick}>Add Books</Button>
      </div>
      <div className="pages-table">
        <Table columns={columns} data={books} />
      </div>
      <Modal
        show={showBookModal}
        onClose={handleCloseBookModal}
        height="330px"
        width="400px"
      >
        {isEdit ? (
          <p className="form-title">Edit Book</p>
        ) : (
          <p className="form-title">Add Book</p>
        )}

        <div className="form-content">
          <label className="form-field-label">Category Name</label>
          <select
            className="form-field-input"
            value={bookData.categoryId}
            onChange={(e) => handleCategoryChange(e)}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
          <Input
            label="Book Title"
            name="bookTitle"
            value={bookData.bookTitle}
            type="text"
            required={isEdit ? false : true}
            onChange={(e) => handleChange(e)}
          />
          <Input
            label="Book Author"
            name="bookAuthor"
            value={bookData.bookAuthor}
            type="text"
            required={isEdit ? false : true}
            onChange={(e) => handleChange(e)}
          />
          <Input
            label="Book Rating"
            name="bookRating"
            value={bookData.bookRating}
            type="number"
            min="1"
            max="5"
            required={isEdit ? false : true}
            onChange={(e) => handleChange(e)}
          />
          <Input
            label="Book Count"
            name="bookCount"
            value={bookData.bookCount}
            type="number"
            min={isEdit ? "0" : "1"}
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
        height="330px"
        width="400px"
      >
        <p className="form-title">Issue Book</p>
        <div className="form-content">
          <label className="form-field-label">User Credential</label>
          <select
            className="form-field-input"
            value={userCredential}
            onChange={(e) => {
              handleCredentialChange(e.target.value);
            }}
          >
            <option value="">Select Mobile No.</option>
            {users.map((user) => (
              <option key={user.userId} value={user?.userCredential}>
                {user.userCredential}
              </option>
            ))}
          </select>
          <Input
            label="User Name"
            name="userName"
            value={user?.userName}
            type="text"
            readOnly={true}
          />
          <Input
            label="Book Title"
            name="bookTitle"
            value={bookData?.bookTitle}
            type="text"
            readOnly={true}
          />
          <Input
            label="Return Date"
            name="returnDate"
            value={returnDate}
            type="date"
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
            <option value="remote">Remote</option>
            <option value="inhouse">Inhouse</option>
          </select>
        </div>
        <div className="form-submit-btn">
          <Button onClick={() => onSubmitAddIssuanceHandler()}>Issue</Button>
        </div>
      </Modal>
    </div>
  );
}

export default DashboardHoc(Books);
