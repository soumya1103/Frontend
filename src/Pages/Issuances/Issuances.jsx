import React, { useEffect, useState } from "react";
import DashboardHoc from "../../Coponents/HOC/DashboardHoc";
import Button from "../../Coponents/Button/Button";
import Table from "../../Coponents/Table/Table";
import Modal from "../../Coponents/Modal/Modal";
import "../Pages.css";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import Operation from "../../Coponents/Operation/Operation";
import {
  addIssuance,
  getIssuances,
  updateIssuance,
} from "../../Api/Service/IssuanceService";
import Input from "../../Coponents/Input/Input";
import {
  getUserByRole,
  getUsersByCredential,
} from "../../Api/Service/UserService";
import { getAllBooks, getBookByTitle } from "../../Api/Service/BookService";

function Issuances() {
  const columns = [
    { header: "Phone No.", accessor: "userCredential" },
    { header: "User Name", accessor: "userName" },
    { header: "Book Title", accessor: "bookTitle" },
    { header: "Issue Date", accessor: "issueDate" },
    { header: "Return Date", accessor: "returnDate" },
    { header: "Status", accessor: "status" },
    { header: "Issuance Type", accessor: "issuanceType" },
    { header: "Action", accessor: "operation" },
  ];

  //list of all issuances
  const [issuances, setIssuances] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [issuanceToEdit, setIssuanceToEdit] = useState();

  //list of all users
  const [users, setUsers] = useState([]);
  //user object
  const [user, setUser] = useState();
  const [userId, setUserId] = useState();

  //list of all books
  const [books, setBooks] = useState([]);
  // book object
  const [book, setBook] = useState();
  const [bookId, setBookId] = useState();

  const [showModal, setShowModal] = useState(false);

  const [userCredential, setUserCredential] = useState();
  const [bookTitle, setBookTitle] = useState();

  const [issuanceData, setIssuanceData] = useState({
    userId: "",
    bookId: "",
    returnDate: "",
    status: "",
    issuanceType: "",
  });

  const loadIssuances = async () => {
    try {
      const response = await getIssuances();
      const issuancesData = response.data.map((issuance) => ({
        ...issuance,
        operation: (
          <Operation
            widthE="130%"
            showExtra={false}
            isBooksPage={false}
            isIssuance={true}
            onClickEdit={() => handleEditIcon(issuance)}
          />
        ),
      }));
      setIssuances(issuancesData);
    } catch (error) {
      console.error("There was an error fetching the issuance data!", error);
    }
  };

  useEffect(() => {
    loadIssuances();
    fetchBooks();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setIssuanceData({
      ...issuanceData,
      [e.target.name]: e.target.value,
      userId: userId,
      bookId: bookId,
      status: "issued",
    });
  };

  const updateIssuances = async (issuanceData, issuanceId) => {
    try {
      console.log(issuanceData);
      const response = await updateIssuance(issuanceData, issuanceId);
      console.log("Updated successfully:");
      setIssuances([...issuances, response.data]);
      handleCloseModal();
      await loadIssuances();
    } catch (error) {
      console.log(error);
    }
  };

  const addIssuances = async (issuanceData) => {
    try {
      console.log(issuanceData);
      const response = await addIssuance(issuanceData);
      console.log("Added Successfully");
      setIssuances([...issuances, response.data]);
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const onSumbitEditIssuanceHandler = async () => {
    await updateIssuances(issuanceData, issuanceToEdit);
  };

  const onSumbitAddIssuanceHandler = async () => {
    await addIssuances(issuanceData);
  };

  const handleClick = () => {
    setIsEdit(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEditIcon = async (issuance) => {
    setIssuanceData({
      userId: issuance.userId,
      bookId: issuance.bookId,
      returnDate: issuance.returnDate,
      status: issuance.status,
      issuanceType: issuance.issuanceType,
    });
    setIsEdit(true);
    setShowModal(true);
    setIssuanceToEdit(issuance.issuanceId);
  };

  const handleCredentialChange = async (credential) => {
    try {
      setUserCredential(credential);
      const response = await getUsersByCredential(credential);
      setUser(response.data);
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
      setBookId(response.data.bookId);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    const response = await getUserByRole();
    setUsers(response.data);
  };

  const fetchBooks = async () => {
    const response = await getAllBooks();
    setBooks(response.data);
  };

  return (
    <div className="pages-outer-container">
      <div className="pages-inner-container">
        <SearchBar placeholder="Search Issuance" />
        <Button onClick={handleClick}>Add Issuance</Button>
      </div>
      <div className="pages-table">
        <Table columns={columns} data={issuances} />
      </div>
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        height="370px"
        width="400px"
      >
        {isEdit ? (
          <p className="form-title">Edit Issuance</p>
        ) : (
          <p className="form-title">Add Issuance</p>
        )}

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
            label="Return Date"
            name="returnDate"
            value={issuanceData.returnDate}
            type="datetime-local"
            onChange={(e) => handleChange(e)}
          />
          <label className="form-field-label">Issuance Type</label>
          <select
            name="issuanceType"
            className="form-field-input"
            value={issuanceData.issuanceType}
            onChange={(e) => handleChange(e)}
          >
            <option value="">Select Type</option>
            <option value="Remote">Remote</option>
            <option value="Inhouse">Inhouse</option>
          </select>
        </div>
        <div className="form-submit-btn">
          {isEdit ? (
            <Button onClick={onSumbitEditIssuanceHandler}>Update</Button>
          ) : (
            <Button onClick={onSumbitAddIssuanceHandler}>Add</Button>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default DashboardHoc(Issuances);
