import React, { useEffect, useState } from "react";
import DashboardHoc from "../../Component/HOC/DashboardHoc";
import "./Dashboard.css";
import bookDashboard from "../../Images/book-dashboard.png";
import categoryDashboard from "../../Images/categories-dashboard.png";
import userDashboard from "../../Images/users-dashboard.png";
import inhouseUserDashboard from "../../Images/inhouse-users-dashboard.png";
import Table from "../../Component/Table/Table";
import { getAllBooksNp } from "../../Api/Service/BookService";
import Loader from "../../Component/Loader/Loader";
import { Link } from "react-router-dom";
import { getAllCount } from "../../Api/Service/DashboardService";

function Dashboard() {
  const [booksData, setBooksData] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalInHouseUsers, setTotalInHouseUsers] = useState(0);

  const booksColumns = [
    { header: "Title", accessor: "bookTitle" },
    { header: "Author", accessor: "bookAuthor" },
    { header: "Rating", accessor: "bookRating" },
    { header: "Count", accessor: "bookCount" },
  ];

  const loadBooks = async () => {
    try {
      const response = await getAllBooksNp();
      const limitedBooksData = response.data.slice(0, 8);
      setBooksData(limitedBooksData);
      setTotalBooks(response.data.length);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCounts = async () => {
    try {
      const response = await getAllCount();
      setTotalCategories(response.data.categoryCount);
      setTotalUsers(response.data.userCount);
      setTotalInHouseUsers(response.data.issuanceCountByType);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadBooks();
    loadCounts();
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
        <div className="dashboard-outer-container">
          <div className="dashboard-inner-container">
            <Link to="/books" style={{ textDecoration: "none" }}>
              <div className="dashboard-card">
                <img src={bookDashboard} alt="book" width="20%" />
                <h3>{totalBooks}</h3>
                <h4>Total Books</h4>
              </div>
            </Link>
            <Link to="/categories" style={{ textDecoration: "none" }}>
              <div className="dashboard-card">
                <img src={categoryDashboard} alt="category" width="20%" />
                <h3>{totalCategories}</h3>
                <h4>Total Categories</h4>
              </div>
            </Link>
            <Link to="/users" style={{ textDecoration: "none" }}>
              <div className="dashboard-card">
                <img src={userDashboard} alt="user" width="20%" />
                <h3>{totalUsers}</h3>
                <h4>Total Users</h4>
              </div>
            </Link>
            <Link to="/issuances" style={{ textDecoration: "none" }}>
              <div className="dashboard-card">
                <img src={inhouseUserDashboard} alt="inhouse-user" width="20%" />
                <h3>{totalInHouseUsers}</h3>
                <h4>Total Inhouse Users</h4>
              </div>
            </Link>
          </div>
          <div className="dashboard-table-container">
            <h2>Books</h2>
            <Table columns={booksColumns} data={booksData} />
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardHoc(Dashboard);
