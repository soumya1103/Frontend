import React, { useState, useEffect } from "react";
import SearchBar from "../../Component/SearchBar/SearchBar";
import Button from "../../Component/Button/Button";
import Table from "../../Component/Table/Table";
import { getIssuances, issuanceSearch } from "../../Api/Service/IssuanceService";
import Operation from "../../Component/Operation/Operation";
import DashboardHoc from "../../Component/HOC/DashboardHoc";
import AddIssuanceModal from "./AddIssuanceModal";
import EditIssuanceModal from "./EditIssuanceModal";
import Loader from "../../Component/Loader/Loader";
import Toast from "../../Component/Toast/Toast";

function Issuances() {
  const columns = [
    { header: "S.No.", accessor: "sNo" },
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

  const [renderUtil, setRenderUtil] = useState(false);

  const render = () => setRenderUtil((prev) => !prev);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [searchData, setSearchData] = useState([]);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${formattedDate} ${formattedTime}`;
  };

  const getPageSizeBasedOnWidth = () => {
    const width = window.innerWidth;
    if (width > 1024) {
      return 6;
    } else if (width <= 1024) {
      return 9;
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

  const loadIssuances = async () => {
    try {
      const response = await getIssuances(page, size);
      const issuanceList = response.data.content.map((issuance, index) => ({
        ...issuance,
        sNo: index + 1 + page * size,
        issueDate: formatDate(issuance.issueDate),
        returnDate: formatDate(issuance.returnDate),
        operation: (
          <Operation widthE="130%" showExtra={false} isBooksPage={false} isIssuance={true} onClickEdit={() => handleEditIssuanceIcon(issuance)} />
        ),
      }));
      setIssuances(issuanceList);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setToastMessage(error.response.data.message);
      setShowToast(true);
      setToastType("error");
    }
  };

  const handleEditIssuanceIcon = (issuance) => {
    setCurrentIssuance(issuance);
    if (issuance.status === "Returned") {
      setShowEditModal(false);
      setToastMessage("Issuance can't be edited as the book is returned.");
      setShowToast(true);
      setToastType("error");
    } else {
      setShowEditModal(true);
    }
  };

  useEffect(() => {
    loadIssuances();
  }, [page, size]);

  const handleSearch = async () => {
    if (keyword.trim() === "") {
      loadIssuances();
      setSearchData([]);
    } else if (keyword.length >= 3) {
      try {
        const response = await issuanceSearch(keyword);
        const issuanceList = response.data.map((issuance, index) => ({
          ...issuance,
          sNo: index + 1 + page * size,
          issueDate: formatDate(issuance.issueDate),
          returnDate: formatDate(issuance.returnDate),
          operation: (
            <Operation widthE="130%" showExtra={false} isBooksPage={false} isIssuance={true} onClickEdit={() => handleEditIssuanceIcon(issuance)} />
          ),
        }));
        setSearchData(issuanceList);
      } catch (error) {
        console.log(error);
      }
    } else if (keyword.length < 3 && keyword.length > 0) {
      setToastMessage("Atleast 3 characters are required!");
      setShowToast(true);
      setToastType("error");
    }
  };

  const handleOnChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    if (value.trim() === "") {
      loadIssuances();
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
            <SearchBar placeholder="Search Issuance" handleOnChange={handleOnChange} handleSearch={handleSearch} />
            <Button onClick={() => setShowAddModal(true)}>Add Issuance</Button>
          </div>
          <div className="pages-table">
            {searchData.length !== 0 ? (
              <Table currentPage={page} totalPages={totalPages} columns={columns} data={searchData} onPageChange={setPage} />
            ) : (
              <Table show={true} currentPage={page} totalPages={totalPages} columns={columns} data={issuances} onPageChange={setPage} />
            )}
          </div>
          <AddIssuanceModal show={showAddModal} onClose={() => setShowAddModal(false)} reloadIssuances={loadIssuances} renderUtil={renderUtil} />
          {currentIssuance && (
            <EditIssuanceModal
              show={showEditModal}
              onClose={() => setShowEditModal(false)}
              issuance={currentIssuance}
              reloadIssuances={loadIssuances}
              render={render}
            />
          )}
        </div>
      )}
      <Toast message={toastMessage} type={toastType} show={showToast} onClose={() => setShowToast(false)} />
    </>
  );
}

export default DashboardHoc(Issuances);
