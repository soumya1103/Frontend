import React, { useState, useEffect } from "react";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import Button from "../../Coponents/Button/Button";
import Table from "../../Coponents/Table/Table";
import { getIssuances, issuanceSearch } from "../../Api/Service/IssuanceService";
import Operation from "../../Coponents/Operation/Operation";
import DashboardHoc from "../../Coponents/HOC/DashboardHoc";
import AddIssuanceModal from "./AddIssuanceModal";
import EditIssuanceModal from "./EditIssuanceModal";
import { useSelector } from "react-redux";
import Loader from "../../Coponents/Loader/Loader";

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
  const size = 6;

  const [keyword, setKeyword] = useState("");
  const [searchData, setSearchData] = useState([]);

  const auth = useSelector((state) => state.auth);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${formattedDate} ${formattedTime}`;
  };

  const loadIssuances = async () => {
    try {
      const response = await getIssuances(page, size, auth?.token);
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
      console.error("There was an error fetching the issuance data!", error);
    }
  };

  const handleEditIssuanceIcon = (issuance) => {
    setCurrentIssuance(issuance);
    setShowEditModal(true);
  };

  useEffect(() => {
    loadIssuances();
  }, [page, size]);

  const handleSearch = async () => {
    if (keyword.trim() === "") {
      loadIssuances();
      setSearchData([]);
    } else {
      try {
        const response = await issuanceSearch(keyword, auth?.token);
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
          <AddIssuanceModal
            show={showAddModal}
            onClose={() => setShowAddModal(false)}
            reloadIssuances={loadIssuances}
            auth={auth}
            renderUtil={renderUtil}
          />
          {currentIssuance && (
            <EditIssuanceModal
              auth={auth}
              show={showEditModal}
              onClose={() => setShowEditModal(false)}
              issuance={currentIssuance}
              reloadIssuances={loadIssuances}
              render={render}
            />
          )}
        </div>
      )}
    </>
  );
}

export default DashboardHoc(Issuances);
