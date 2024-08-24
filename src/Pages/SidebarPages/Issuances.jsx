import React, { useEffect, useState } from "react";
import DashboardHoc from "../../Coponents/HOC/DashboardHoc";
import Button from "../../Coponents/Button/Button";
import Table from "../../Coponents/Table/Table";
import "./Pages.css";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import Operation from "../../Coponents/Operation/Operation";
import axios from "axios";

function Issuances() {
  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Operation", accessor: "operation" },
  ];

  const data = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      operation: <Operation widthE="8%" widthD="6.5%" showExtra={false} />,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      operation: <Operation widthE="8%" widthD="6.5%" showExtra={false} />,
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michael@example.com",
      operation: <Operation widthE="8%" widthD="6.5%" showExtra={false} />,
    },
    {
      id: 4,
      name: "Michael Johnson",
      email: "michael@example.com",
      operation: <Operation widthE="8%" widthD="6.5%" showExtra={false} />,
    },
    {
      id: 5,
      name: "Michael Johnson",
      email: "michael@example.com",
      operation: <Operation widthE="8%" widthD="6.5%" showExtra={false} />,
    },
    {
      id: 6,
      name: "Michael Johnson",
      email: "michael@example.com",
      operation: <Operation widthE="8%" widthD="6.5%" showExtra={false} />,
    },
    {
      id: 7,
      name: "Michael Johnson",
      email: "michael@example.com",
      operation: <Operation widthE="8%" widthD="6.5%" showExtra={false} />,
    },
    {
      id: 8,
      name: "Michael Johnson",
      email: "michael@example.com",
      operation: <Operation widthE="8%" widthD="6.5%" showExtra={false} />,
    },
    {
      id: 9,
      name: "Michael Johnson",
      email: "michael@example.com",
      operation: <Operation widthE="8%" widthD="6.5%" showExtra={false} />,
    },
    {
      id: 10,
      name: "Michael Johnson",
      email: "michael@example.com",
      operation: <Operation widthE="8%" widthD="6.5%" showExtra={false} />,
    },
  ];

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  return (
    <div className="pages-outer-container">
      <div className="pages-inner-container">
        <SearchBar placeholder="Search Issuance" onSearch={handleSearch} />
        <Button>Add Issuance</Button>
      </div>
      <div className="pages-table">
        <Table columns={columns} data={data} />
      </div>
    </div>
  );
}

export default DashboardHoc(Issuances);
