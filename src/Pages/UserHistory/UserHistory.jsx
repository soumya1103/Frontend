import React, { useEffect, useState } from "react";
import Navigation from "../../Coponents/Navigation/Navigation";
import Table from "../../Coponents/Table/Table";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import { useSelector } from "react-redux";
import { getIssuancesByUserCredential } from "../../Api/Service/IssuanceService";
import "./UserHistory.css";

function UserHistory() {
  const columns = [
    { header: "Book Title", accessor: "bookTitle" },
    { header: "Issue Date", accessor: "issueDate" },
    { header: "Return Date", accessor: "returnDate" },
    { header: "Status", accessor: "status" },
    { header: "Issuance Type", accessor: "issuanceType" },
  ];

  const [issuances, setIssuances] = useState([]);

  const auth = useSelector((state) => state.auth);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${formattedDate} ${formattedTime}`;
  };

  const loadIssuances = async () => {
    try {
      console.log(auth);

      const response = await getIssuancesByUserCredential(auth.userCredential, auth?.token);
      const issuanceList = response.data.map((issuance) => ({
        ...issuance,
        issueDate: formatDate(issuance.issueDate),
        returnDate: formatDate(issuance.returnDate),
      }));
      setIssuances(issuanceList);
    } catch (error) {
      console.error("There was an error fetching the issuance data!", error);
    }
  };

  useEffect(() => {
    loadIssuances();
  }, []);

  return (
    <>
      <Navigation />
      <div className="pages-outer-container">
        <div className="user-history-inner-container">
          <h3 className="issuance-history">Issuance History</h3>
        </div>
        <div className="user-history-table">
          <Table columns={columns} data={issuances} />
        </div>
      </div>
    </>
  );
}

export default UserHistory;
