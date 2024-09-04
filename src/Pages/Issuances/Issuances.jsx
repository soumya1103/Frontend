import React, { useState, useEffect } from "react";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import Button from "../../Coponents/Button/Button";
import Table from "../../Coponents/Table/Table";
import { getIssuances } from "../../Api/Service/IssuanceService";
import Operation from "../../Coponents/Operation/Operation";
import DashboardHoc from "../../Coponents/HOC/DashboardHoc";
import AddIssuanceModal from "./AddIssuanceModal";
import EditIssuanceModal from "./EditIssuanceModal";
import { useSelector } from "react-redux";

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentIssuance, setCurrentIssuance] = useState(null);

  const auth = useSelector((state) => state.auth);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${formattedDate} ${formattedTime}`;
  };

  const loadIssuances = async () => {
    try {
      const response = await getIssuances(auth?.token);
      const issuanceList = response.data.map((issuance) => ({
        ...issuance,
        issueDate: formatDate(issuance.issueDate),
        returnDate: formatDate(issuance.returnDate),
        operation: (
          <Operation widthE="130%" showExtra={false} isBooksPage={false} isIssuance={true} onClickEdit={() => handleEditIssuanceIcon(issuance)} />
        ),
      }));
      setIssuances(issuanceList);
    } catch (error) {
      console.error("There was an error fetching the issuance data!", error);
    }
  };

  const handleEditIssuanceIcon = (issuance) => {
    setCurrentIssuance(issuance);
    setShowEditModal(true);
  };

  useEffect(() => {
    loadIssuances();
  }, []);

  return (
    <div className="pages-outer-container">
      <div className="pages-inner-container">
        <SearchBar placeholder="Search Issuance" />
        <Button onClick={() => setShowAddModal(true)}>Add Issuance</Button>
      </div>
      <div className="pages-table">
        <Table columns={columns} data={issuances} />
      </div>
      <AddIssuanceModal show={showAddModal} onClose={() => setShowAddModal(false)} reloadIssuances={loadIssuances} auth={auth} />
      {currentIssuance && (
        <EditIssuanceModal
          auth={auth}
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          issuance={currentIssuance}
          reloadIssuances={loadIssuances}
        />
      )}
    </div>
  );
}

export default DashboardHoc(Issuances);
