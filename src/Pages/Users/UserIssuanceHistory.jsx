import React from "react";
import Table from "../../Component/Table/Table";
import Modal from "../../Component/Modal/Modal";

const UserIssuanceHistory = ({ data, show, onClose }) => {
  const columns = [
    { header: "Book Title", accessor: "bookTitle" },
    { header: "Issue Date", accessor: "issueDate" },
    { header: "Return Date", accessor: "returnDate" },
    { header: "Status", accessor: "status" },
    { header: "Issuance Type", accessor: "issuanceType" },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${formattedDate} ${formattedTime}`;
  };

  const issuanceList = data.map((issuance) => ({
    ...issuance,
    issueDate: formatDate(issuance.issueDate),
    returnDate: formatDate(issuance.returnDate),
  }));

  return (
    <Modal show={show} onClose={onClose} height="500px" width="1000px">
      {data.length === 0 ? (
        <h3 className="form-title">No Issuance History</h3>
      ) : (
        <>
          <h3 className="form-title">Issuance History of {data[0].userName}</h3>
          <Table columns={columns} data={issuanceList} />
        </>
      )}
    </Modal>
  );
};

export default UserIssuanceHistory;
