import React from "react";
import DashboardHoc from "../Coponents/HOC/DashboardHoc";
import "./Categories.css";
import Button from "../Coponents/Button";
import Table from "../Coponents/Table";
import SearchBar from "../Coponents/SearchBar";
import Operation from "../Coponents/Operation";

function Books() {
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
      operation: <Operation />,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      operation: <Operation />,
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michael@example.com",
      operation: <Operation />,
    },
    {
      id: 4,
      name: "Michael Johnson",
      email: "michael@example.com",
      operation: <Operation />,
    },
    {
      id: 5,
      name: "Michael Johnson",
      email: "michael@example.com",
      operation: <Operation />,
    },
    {
      id: 6,
      name: "Michael Johnson",
      email: "michael@example.com",
      operation: <Operation />,
    },
    {
      id: 7,
      name: "Michael Johnson",
      email: "michael@example.com",
      operation: <Operation />,
    },
    {
      id: 8,
      name: "Michael Johnson",
      email: "michael@example.com",
      operation: <Operation />,
    },
    {
      id: 9,
      name: "Michael Johnson",
      email: "michael@example.com",
      operation: <Operation />,
    },
    {
      id: 10,
      name: "Michael Johnson",
      email: "michael@example.com",
      operation: <Operation />,
    },
  ];

  const handleSearch = (query) => {
    // Perform your search logic here, e.g., filter a list or make an API call
    console.log("Searching for:", query);
    // Update the searchResults state with the results
    // setSearchResults(results);
  };

  return (
    <div className="pages-outer-container">
      <div className="pages-inner-container">
        <SearchBar placeholder="Search  Books" onSearch={handleSearch} />
        <Button>Add Books</Button>
      </div>
      <div className="pages-table">
        <Table columns={columns} data={data} />
      </div>
    </div>
  );
}

export default DashboardHoc(Books);
