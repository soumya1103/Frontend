import React, { useEffect, useState } from "react";
import DashboardHoc from "../Coponents/HOC/DashboardHoc";
import "./Dashboard.css";
import bookDashboard from "../Images/book-dashboard.png";
import categoryDashboard from "../Images/categories-dashboard.png";
import userDashboard from "../Images/users-dashboard.png";
import inhouseUserDashboard from "../Images/inhouse-users-dashboard.png";
import Table from "../Coponents/Table";
import axios from "axios";

function Dashboard() {
  const [booksData, setBooksData] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [usersData, setUsersData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const booksColumns = [
    { header: "Title", accessor: "bookTitle" },
    { header: "Author", accessor: "bookAuthor" },
    { header: "Rating", accessor: "bookRating" },
    { header: "Count", accessor: "bookCount" },
  ];

  const userColumns = [
    { header: "Name", accessor: "userName" },
    { header: "Phone Number", accessor: "userCredential" },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:8080/lms/books")
      .then((response) => {
        const limitedBooksData = response.data.slice(0, 10);
        setBooksData(limitedBooksData);
        setTotalBooks(response.data.length);
      })
      .catch((error) => {
        console.error("There was an error fetching the books data!", error);
      });

    axios
      .get("http://localhost:8080/lms/categories/count")
      .then((response) => {
        setTotalCategories(response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the categories count!",
          error
        );
      });

    axios
      .get("http://localhost:8080/lms/user")
      .then((response) => {
        const limitedUsersData = response.data.slice(0, 11);
        setUsersData(limitedUsersData);
        setTotalUsers(response.data.length);
      })
      .catch((error) => {
        console.error("There was an error fetching the users data!", error);
      });
  }, []);

  return (
    <div className="dashboard-outer-container">
      <div className="dashboard-inner-container">
        <div className="dashboard-card">
          <img src={bookDashboard} alt="book" width="20%" />
          <h4>{totalBooks}</h4>
          <h4>Total Books</h4>
        </div>
        <div className="dashboard-card">
          <img src={categoryDashboard} alt="category" width="20%" />
          <h4>{totalCategories}</h4>
          <h4>Total Categories</h4>
        </div>
        <div className="dashboard-card">
          <img src={userDashboard} alt="user" width="20%" />
          <h4>{totalUsers}</h4>
          <h4>Total Users</h4>
        </div>
        <div className="dashboard-card">
          <img src={inhouseUserDashboard} alt="inhouse-user" width="20%" />
          <h4>20</h4>
          <h4>Total Inhouse Users</h4>
        </div>
      </div>
      <div className="dashboard-table-container">
        <div>
          <h2>Books</h2>
          <Table columns={booksColumns} data={booksData} />
        </div>
        <div>
          <h2>Users</h2>
          <Table columns={userColumns} data={usersData} />
        </div>
      </div>
    </div>
  );
}

export default DashboardHoc(Dashboard);
