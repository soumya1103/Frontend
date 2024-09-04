import React from "react";
import Table from "../../Coponents/Table/Table";
import Modal from "../../Coponents/Modal/Modal";

const BookIssuanceHistory = ({ data, show, onClose }) => {
  const columns = [
    { header: "Phone No.", accessor: "userCredential" },
    { header: "User Name", accessor: "userName" },
    { header: "Issue Date", accessor: "issueDate" },
    { header: "Return Date", accessor: "returnDate" },
    { header: "Status", accessor: "status" },
    { header: "Issuance Type", accessor: "issuanceType" },
  ];

  return (
    <Modal show={show} onClose={onClose} height="500px" width="1000px">
      {data.length === 0 ? (
        <h3 className="form-title">No Issuance History</h3>
      ) : (
        <>
          <h3 className="form-title">Issuance History of {data[0].bookTitle}</h3>
          <Table columns={columns} data={data} />
        </>
      )}
    </Modal>
  );
};

export default BookIssuanceHistory;
