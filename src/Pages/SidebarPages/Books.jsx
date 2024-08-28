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
  updateBook,
} from "../../Api/Service/BookService";
import Modal from "../../Coponents/Modal/Modal";
import Form from "../../Coponents/Form/Form";

function Books() {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);

  const columns = [
    { header: "Category", accessor: "categoryName" },
    { header: "Title", accessor: "bookTitle" },
    { header: "Author", accessor: "bookAuthor" },
    { header: "Rating", accessor: "bookRating" },
    { header: "Count", accessor: "bookCount" },
    { header: "Operation", accessor: "operation" },
  ];

  const addBooks = async (formData, resetForm) => {
    try {
      const response = await addBook(formData);
      console.log("Book added successfully:", response.data);
      setBooks([...books, response.data]);
      resetForm();
      handleClose();
      await loadBooks();
    } catch (error) {
      console.error("There was an error adding the category!", error);
    }
  };

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
            onClickAssignUser={() => handleAssignUser(book.bookTitle)}
            isBooksPage={true}
            onClickEdit={() => handleEditIcon(book.bookId)}
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
    setIsEdit(false);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setBookToEdit(null);
  };

  const handleEditIcon = (bookId) => {
    setIsEdit(true);
    setBookToEdit(bookId);
    setShowModal(true);
  };

  const updateBooks = async (formData, resetForm, bookToEdit) => {
    try {
      const response = await updateBook(formData, bookToEdit);
      console.log("Book edited successfully:", response.data);
      setBooks(
        books.map((book) => (book.bookId === bookToEdit ? response.data : book))
      );
      resetForm();
      handleClose();
      await loadBooks();
    } catch (error) {
      console.log("There was an error updating the book", error);
    }
  };

  const handleFormSubmit = (formData, resetForm) => {
    if (isEdit && bookToEdit) {
      updateBooks(formData, resetForm, bookToEdit);
    } else {
      addBooks(formData, resetForm);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleAssignUser = () => {};

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const formArr = [
    {
      label: "Category Name : ",
      name: "categoryId",
      type: "select",
      required: isEdit ? false : true,
    },
    {
      label: "Book Title : ",
      name: "bookTitle",
      type: "text",
      required: isEdit ? false : true,
    },
    {
      label: "Book Author : ",
      name: "bookAuthor",
      type: "text",
      required: isEdit ? false : true,
    },
    {
      label: "Book Rating : ",
      name: "bookRating",
      type: "number",
      min: 1,
      max: 5,
      oninput: "validateNonNegative(this)",
      required: isEdit ? false : true,
    },
    {
      label: "Book Count : ",
      name: "bookCount",
      type: "number",
      min: 1,
      max: 5,
      oninput: "validateNonNegative(this)",
      required: isEdit ? false : true,
    },
  ];

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
        show={showModal}
        onClose={handleClose}
        height="350px"
        width="400px"
      >
        <Form
          title={isEdit ? "Edit Book" : "Add Book"}
          formArr={formArr}
          submitBtn={isEdit ? "Update" : "Add"}
          initialValues={isEdit ? bookToEdit : {}}
          onSubmit={handleFormSubmit}
          showCategoryDropdown={true}
        />
      </Modal>
    </div>
  );
}

export default DashboardHoc(Books);
