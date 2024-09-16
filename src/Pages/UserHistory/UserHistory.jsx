import React, { useEffect, useState } from "react";
import Navigation from "../../Component/Navigation/Navigation";
import Table from "../../Component/Table/Table";
import { useSelector } from "react-redux";
import { getIssuancesByUserCredential } from "../../Api/Service/IssuanceService";
import "./UserHistory.css";
import Loader from "../../Component/Loader/Loader";
import Toast from "../../Component/Toast/Toast";

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

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");

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
      setToastMessage(error.response.data.message);
      setShowToast(true);
      setToastType("error");
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
              <h3 className="issuance-history">Issuance History</h3>
            </div>
            <div className="user-history-table">
              {issuances.length > 0 ? <Table columns={columns} data={issuances} /> : <p className="user-history-text">No Issuance Found</p>}
            </div>
          </div>
        </>
      )}
      <Toast message={toastMessage} type={toastType} show={showToast} onClose={() => setShowToast(false)} />
    </>
  );
}

export default UserHistory;
