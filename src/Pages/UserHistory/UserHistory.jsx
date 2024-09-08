import React, { useEffect, useState } from "react";
import Navigation from "../../Coponents/Navigation/Navigation";
import Table from "../../Coponents/Table/Table";
import { useSelector } from "react-redux";
import { getIssuancesByUserCredential } from "../../Api/Service/IssuanceService";
import "./UserHistory.css";
import Loader from "../../Coponents/Loader/Loader";

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
        <>
          <Navigation />
          <div className="pages-outer-container">
            <div className="user-history-inner-container">
              {/* <iframe src="https://giphy.com/embed/nOBbIHGKD2HQs" title="book-gif" width="100%" className="giphy-embed"></iframe> */}
              <h3 className="issuance-history">Issuance History</h3>
            </div>
            <div className="user-history-table">
              <Table columns={columns} data={issuances} />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default UserHistory;
// const [name, setName] = useState();

//   const findUserName = async () => {
//     try {
//       const response = await getUsersByCredential(auth.userCredential, auth?.token);
//       setName(response.data.userName);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   if (historyName !== null) {
//     setName(historyName);
//   } else {
//     findUserName();
//   }
