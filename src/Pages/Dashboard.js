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
  // const [usersData, setUsersData] = useState([]);

  const booksColumns = [
    { header: "Title", accessor: "bookTitle" },
    { header: "Author", accessor: "bookAuthor" },
    { header: "Rating", accessor: "bookRating" },
    { header: "Count", accessor: "bookCount" },
  ];

  // const usersColumns = [
  //   { header: "Category ID", accessor: "categoryId" },
  //   { header: "Name", accessor: "categoryName" },
  //   { header: "Icon", accessor: "categoryIcon" },
  // ];

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

    // axios
    //   .get("http://localhost:8080/lms/users")
    //   .then((response) => {
    //     setUsersData(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("There was an error fetching the users data!", error);
    //   });
  }, []);

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
  ];

  const data = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Michael Johnson", email: "michael@example.com" },
    { id: 4, name: "Michael Johnson", email: "michael@example.com" },
    { id: 5, name: "Michael Johnson", email: "michael@example.com" },
    { id: 6, name: "Michael Johnson", email: "michael@example.com" },
    { id: 7, name: "Michael Johnson", email: "michael@example.com" },
    { id: 8, name: "Michael Johnson", email: "michael@example.com" },
    { id: 9, name: "Michael Johnson", email: "michael@example.com" },
    { id: 10, name: "Michael Johnson", email: "michael@example.com" },
  ];

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
          <h4>50</h4>
          <h4>Total Users</h4>
        </div>
        <div className="dashboard-card">
          <img src={inhouseUserDashboard} alt="inhouse-user" width="20%" />
          <h4>20</h4>
          <h4>Total Inhouse Users</h4>
        </div>
      </div>
      <div className="dashboard-table-container">
        <Table columns={booksColumns} data={booksData} />
        <Table columns={columns} data={data} />
      </div>
    </div>
  );
}

export default DashboardHoc(Dashboard);
