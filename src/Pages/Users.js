import React, { useEffect, useState } from "react";
import DashboardHoc from "../Coponents/HOC/DashboardHoc";
import Button from "../Coponents/Button";
import Table from "../Coponents/Table";
import SearchBar from "../Coponents/SearchBar";
import Operation from "../Coponents/Operation";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);

  const columns = [
    { header: "Name", accessor: "userName" },
    { header: "Phone Number", accessor: "userCredential" },
    { header: "Operation", accessor: "operation" },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:8080/lms/user")
      .then((response) => {
        const usersData = response.data.map((user) => ({
          ...user,
          operation: <Operation widthE="6%" widthD="5%" showExtra={true} />,
        }));

        setUsers(usersData);
      })
      .catch((error) => {
        console.error("There was an error fetching the users data!", error);
      });
  }, []);

  const handleSearch = (query) => {
    // Perform your search logic here, e.g., filter the users list or make an API call
    console.log("Searching for:", query);
    // Update the users state with the filtered results
  };

  return (
    <div className="pages-outer-container">
      <div className="pages-inner-container">
        <SearchBar placeholder="Search User" onSearch={handleSearch} />
        <Button>Add User</Button>
      </div>
      <div className="pages-table">
        <Table columns={columns} data={users} />
      </div>
    </div>
  );
}

export default DashboardHoc(Users);
