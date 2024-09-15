import React, { useEffect, useState } from "react";
import DashboardHoc from "../../Component/HOC/DashboardHoc";
import Button from "../../Component/Button/Button";
import SearchBar from "../../Component/SearchBar/SearchBar";
import BookModal from "./BookModal";
import AssignModal from "./AssignModal";
import ConfirmationModal from "../../Component/Modal/ConfirmationModal";
import { addBook, bookSearch, deleteBook, getAllBooks, getBookByTitle, updateBook } from "../../Api/Service/BookService";
import { getAllCategoriesNp } from "../../Api/Service/CategoryService";
import { getUserByRoleNp, getUsersByCredential } from "../../Api/Service/UserService";
import { addIssuance, getIssuancesByBookId } from "../../Api/Service/IssuanceService";
import BookIssuanceHistory from "./BookIssuanceHistory";
import Operation from "../../Component/Operation/Operation";
import Table from "../../Component/Table/Table";
import Loader from "../../Component/Loader/Loader";
import Toast from "../../Component/Toast/Toast";

function Books() {
  const [books, setBooks] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [bookData, setBookData] = useState({
    categoryId: "",
    categoryName: "",
    bookTitle: "",
    bookAuthor: "",
    bookRating: "",
    bookCount: "",
  });
  const [bookToEdit, setBookToEdit] = useState();
  const [bookId, setBookId] = useState("");
  const [user, setUser] = useState();
  const [userCredential, setUserCredential] = useState("");
  const [users, setUsers] = useState([]);
  const [returnDate, setReturnDate] = useState();
  const [issuanceType, setIssuanceType] = useState("");
  const [bookToDelete, setBookToDelete] = useState(null);
  const [showIssuanceModal, setShowIssuanceModal] = useState(false);

  const [issuances, setIssuances] = useState([]);
  const [categories, setCategories] = useState([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");

  const getPageSizeBasedOnWidth = () => {
    const width = window.innerWidth;
    if (width > 1024) {
      return 7;
    } else if (width <= 1024) {
      return 10;
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
    loadBooks();
    fetchCategories();
    fetchUsers();
  }, [page, size]);

  const loadBooks = async () => {
    try {
      const response = await getAllBooks(page, size);

      const booksData = response.data.content.map((book, index) => ({
        ...book,
        sNo: index + 1 + page * size,
        operation: (
          <Operation
            widthE="100%"
            widthD="80%"
            showExtra={true}
            isBooksPage={true}
            onClickAssignUser={() => handleAssignUser(book)}
            onClickEdit={() => handleEditIcon(book)}
            onClickDelete={() => handleDeleteIcon(book.bookId)}
            onClickBookHistory={() => handleShowIssuance(book.bookId)}
          />
        ),
      }));
      setBooks(booksData);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategoriesNp();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUserByRoleNp();
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
    setBookData({ bookTitle: book.bookTitle, bookCount: book.bookCount });
    if (book.bookCount === 0) {
      setShowAssignModal(false);
      setToastMessage("Book count is 0 can't assign book.");
      setShowToast(true);
      setToastType("error");
    } else {
      setShowAssignModal(true);
    }
    try {
      const response = await getBookByTitle(book.bookTitle);
      setBookId(response.data.bookId);
    } catch (error) {
      console.log(error);
    }
  };

  const updateBooks = async (bookData, bookId) => {
    try {
      const trimmedBookData = {
        ...bookData,
        bookTitle: bookData.bookTitle.trim(),
        bookAuthor: bookData.bookAuthor.trim(),
      };

      const response = await updateBook(trimmedBookData, bookId);
      if (response?.status === 200 || response?.status === 201) {
        setToastMessage("Book updated successfully!");
        setShowToast(true);
        setToastType("success");
      }
      await loadBooks();
      setBookData({
        categoryId: "",
        categoryName: "",
        bookTitle: "",
        bookAuthor: "",
        bookRating: "",
        bookCount: "",
      });
    } catch (error) {
      setToastMessage(error.response.data.message);
      setShowToast(true);
      setToastType("error");
    } finally {
      handleCloseBookModal();
    }
  };

  const addBooks = async (bookData) => {
    try {
      const trimmedBookData = {
        ...bookData,
        bookTitle: bookData.bookTitle.trim(),
        bookAuthor: bookData.bookAuthor.trim(),
      };
      const response = await addBook(trimmedBookData);
      if (response?.status === 200 || response?.status === 201) {
        setToastMessage("Book added successfully!");
        setShowToast(true);
        setToastType("success");
      }
      await loadBooks();
      setBookData({
        categoryId: "",
        categoryName: "",
        bookTitle: "",
        bookAuthor: "",
        bookRating: "",
        bookCount: "",
      });
    } catch (error) {
      setToastMessage(error.response.data.message);
      setShowToast(true);
      setToastType("error");
    } finally {
      handleCloseBookModal();
    }
  };

  const addIssuances = async (issuanceData) => {
    try {
      const response = await addIssuance(issuanceData);
      if (response?.status === 200 || response?.status === 201) {
        setToastMessage("Book issued successfully!");
        setShowToast(true);
        setToastType("success");
      }
    } catch (error) {
      setToastMessage(error.response.data.message);
      setShowToast(true);
      setToastType("error");
    } finally {
      handleCloseAssignModal();
    }
  };

  const handleCloseBookModal = () => setShowBookModal(false);

  const handleCloseIssuanceModal = () => setShowIssuanceModal(false);

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
    try {
      await addIssuances(obj);

      const updatedBookData = {
        ...bookData,
        bookCount: bookData.bookCount - 1,
      };

      await updateBook(updatedBookData, bookId);
      await loadBooks();
    } catch (error) {
      setToastMessage(error.response.data.message);
      setShowToast(true);
      setToastType("error");
    }
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
        const response = await deleteBook(bookToDelete);
        setToastMessage(response.data.message);
        setShowToast(true);
        setToastType("success");
        await loadBooks();
      } catch (error) {
        setToastMessage(error.response.data.message);
        setShowToast(true);
        setToastType("error");
      } finally {
        setShowConfirmationModal(false);
        setBookToDelete(null);
      }
    }
  };

  const handleShowIssuance = async (bookId) => {
    setIssuances([]);
    setShowIssuanceModal(true);
    try {
      const response = await getIssuancesByBookId(bookId);
      setIssuances(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { header: "S.No.", accessor: "sNo" },
    { header: "Category", accessor: "categoryName" },
    { header: "Title", accessor: "bookTitle" },
    { header: "Author", accessor: "bookAuthor" },
    { header: "Rating", accessor: "bookRating" },
    { header: "Count", accessor: "bookCount" },
    { header: "Action", accessor: "operation" },
  ];

  const [keyword, setKeyword] = useState("");
  const [searchData, setSearchData] = useState([]);

  const handleSearch = async () => {
    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword === "") {
      loadBooks();
      setSearchData([]);
    } else if (trimmedKeyword.length >= 3) {
      try {
        const response = await bookSearch(trimmedKeyword);

        if (response.data.length === 0) {
          setToastMessage("No data found!");
          setShowToast(true);
          setToastType("error");
        } else {
          const booksData = response.data.map((book, index) => ({
            ...book,
            sNo: index + 1 + page * size,
            operation: (
              <Operation
                widthE="100%"
                widthD="80%"
                showExtra={true}
                isBooksPage={true}
                onClickAssignUser={() => handleAssignUser(book)}
                onClickEdit={() => handleEditIcon(book)}
                onClickDelete={() => handleDeleteIcon(book.bookId)}
                onClickBookHistory={() => handleShowIssuance(book.bookId)}
              />
            ),
          }));
          setSearchData(booksData);
        }
      } catch (error) {
        setToastMessage("Error finding items!");
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
      loadBooks();
      setSearchData([]);
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="pages-outer-container">
          <div className="pages-inner-container">
            <SearchBar placeholder="Search Books" handleOnChange={handleOnChange} handleSearch={handleSearch} />
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
            {searchData.length !== 0 ? (
              <Table currentPage={page} totalPages={totalPages} columns={columns} data={searchData} onPageChange={setPage} />
            ) : (
              <Table show={true} currentPage={page} totalPages={totalPages} columns={columns} data={books} onPageChange={setPage} />
            )}
          </div>
          <BookIssuanceHistory show={showIssuanceModal} onClose={handleCloseIssuanceModal} data={issuances} />
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
          <ConfirmationModal show={showConfirmationModal} onClose={handleCloseConfirmationModal} onConfirm={handleConfirmDelete} />
        </div>
      )}
      <Toast message={toastMessage} type={toastType} show={showToast} onClose={() => setShowToast(false)} />
    </>
  );
}

export default DashboardHoc(Books);
