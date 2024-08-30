import React, { useEffect, useState } from "react";
import DashboardHoc from "../../Coponents/HOC/DashboardHoc";
import Button from "../../Coponents/Button/Button";
import Table from "../../Coponents/Table/Table";
import Modal from "../../Coponents/Modal/Modal";
import "./Pages.css";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import Operation from "../../Coponents/Operation/Operation";
import {
  getIssuances,
  updateIssuance,
} from "../../Api/Service/IssuanceService";
import Input from "../../Coponents/Input/Input";

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

  const [issuances, setIssuances] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [issuanceToEdit, setIssuanceToEdit] = useState();

  const [issuanceData, setIssuanceData] = useState({
    userCredential: "",
    userName: "",
    bookTitle: "",
    issueDate: "",
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
            widthE="100%"
            widthD="90%"
            showExtra={false}
            isBooksPage={false}
            onClickEdit={() => handleEditIcon(issuance)}
            // onClickDelete={() => handleDeleteIcon(book.bookId)}
          />
        ),
      }));

      setIssuances(issuancesData);
    } catch (error) {
      console.error("There was an error fetching the issuance data!", error);
    }
  };

  const handleClick = () => {
    setIssuanceData({
      userCredential: "",
      userName: "",
      bookTitle: "",
      issueDate: "",
      returnDate: "",
      status: "",
      issuanceType: "",
    });
    setIsEdit(false);
    setShowAddModal(true);
    setShowEditModal(false);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleEditIcon = async (issuance) => {
    setIssuanceData({
      userCredential: issuance.userCredential,
      userName: issuance.userName,
      bookTitle: issuance.bookTitle,
      issueDate: issuance.issuanceData,
      returnDate: issuance.returnDate,
      status: issuance.status,
      issuanceType: issuance.issuanceType,
    });
    setIsEdit(true);
    setShowEditModal(true);
    setIssuanceToEdit(issuance?.issuanceId);
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const handleChange = (e) => {
    setIssuanceData({ ...issuanceData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (e) => {
    setIssuanceData({ ...issuanceData, status: e.target.value });
  };

  const handleIssuanceTypeChange = (e) => {
    setIssuanceData({ ...issuanceData, issuanceType: e.target.value });
  };

  useEffect(() => {
    loadIssuances();
  }, []);

  const updateIssuances = async (issuanceData, issuanceId) => {
    try {
      const response = await updateIssuance(issuanceData, issuanceId);
      console.log("Issuance edited successfully:", response.data);
      setIssuances([...issuances, response.data]);
      handleCloseEditModal();
      await loadIssuances();
    } catch (error) {
      console.log("There was an error updating the issuance", error);
    }
  };

  const onSumbitEditIssuanceHandler = async () => {
    await updateIssuances(issuanceData, issuanceToEdit);
  };

  return (
    <div className="pages-outer-container">
      <div className="pages-inner-container">
        <SearchBar placeholder="Search Issuance" onSearch={handleSearch} />
        <Button onClick={handleClick}>Add Issuance</Button>
      </div>
      <div className="pages-table">
        <Table columns={columns} data={issuances} />
      </div>
      <Modal
        show={showEditModal}
        onClose={handleCloseEditModal}
        height="370px"
        width="400px"
      >
        <p className="form-title">Edit Issuance</p>
        <div className="form-content">
          <Input
            label="Phone No."
            name="userCredential"
            value={issuanceData.userCredential}
            type="text"
            required={isEdit ? false : true}
            onChange={(e) => handleChange(e)}
            readOnly={true}
          />
          <Input
            label="User Name"
            name="userName"
            value={issuanceData.userName}
            type="text"
            required={isEdit ? false : true}
            onChange={(e) => handleChange(e)}
            readOnly={true}
          />
          <Input
            label="Book Title"
            name="bookTitle"
            value={issuanceData.bookTitle}
            type="text"
            required={isEdit ? false : true}
            onChange={(e) => handleChange(e)}
            readOnly={true}
          />
          <Input
            label="Return Date"
            name="returnDate"
            value={issuanceData?.returnDate}
            type="datetime-local"
            required={isEdit ? false : true}
            onChange={(e) => handleChange(e)}
          />
          <label className="form-field-label">Status</label>
          <select
            className="form-field-input"
            value={issuanceData.status}
            onChange={(e) => handleStatusChange(e)}
          >
            <option value="">Select Status</option>
            <option value="Remote">Issued</option>
            <option value="Inhouse">Not Issued</option>
          </select>
          <label className="form-field-label">Issuance Type</label>
          <select
            className="form-field-input"
            value={issuanceData.issuanceType}
            onChange={(e) => handleIssuanceTypeChange(e)}
          >
            <option value="">Select Type</option>
            <option value="Remote">Remote</option>
            <option value="Inhouse">Inhouse</option>
          </select>
        </div>
        <div className="form-submit-btn">
          <Button onClick={() => onSumbitEditIssuanceHandler()}>Update</Button>
        </div>
      </Modal>
    </div>
  );
}

export default DashboardHoc(Issuances);
