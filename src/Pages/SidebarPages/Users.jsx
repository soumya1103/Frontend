import React, { useEffect, useState } from "react";
import DashboardHoc from "../../Coponents/HOC/DashboardHoc";
import Button from "../../Coponents/Button/Button";
import Table from "../../Coponents/Table/Table";
import "./Pages.css";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import Operation from "../../Coponents/Operation/Operation";
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
          operation: (
            <Operation
              widthE="7%"
              widthD="5.5%"
              showExtra={true}
              isBooksPage={false}
            />
          ),
        }));

        setUsers(usersData);
      })
      .catch((error) => {
        console.error("There was an error fetching the users data!", error);
      });
  }, []);

  const handleSearch = (query) => {
    console.log("Searching for:", query);
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
