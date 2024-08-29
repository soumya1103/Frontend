import React, { useEffect, useState } from "react";
import DashboardHoc from "../../Coponents/HOC/DashboardHoc";
import Button from "../../Coponents/Button/Button";
import Table from "../../Coponents/Table/Table";
import "./Pages.css";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import Operation from "../../Coponents/Operation/Operation";
import { getIssuances } from "../../Api/Service/IssuanceService";

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

  const loadIssuances = async () => {
    try {
      const response = await getIssuances();
      const issuancesData = response.data.map((issuance) => ({
        ...issuance,
        operation: (
          <Operation
            widthE="100%"
            widthD="90%"
            showExtra={true}
            isBooksPage={false}
            // onClickEdit={() => handleEditIcon(book)}
            // onClickDelete={() => handleDeleteIcon(book.bookId)}
          />
        ),
      }));

      setIssuances(issuancesData);
    } catch (error) {
      console.error("There was an error fetching the issuance data!", error);
    }
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  useEffect(() => {
    loadIssuances();
  }, []);

  return (
    <div className="pages-outer-container">
      <div className="pages-inner-container">
        <SearchBar placeholder="Search Issuance" onSearch={handleSearch} />
        <Button>Add Issuance</Button>
      </div>
      <div className="pages-table">
        <Table columns={columns} data={issuances} />
      </div>
    </div>
  );
}

export default DashboardHoc(Issuances);
