import React, { useEffect, useState } from "react";
import DashboardHoc from "../../Coponents/HOC/DashboardHoc";
import Button from "../../Coponents/Button/Button";
import Table from "../../Coponents/Table/Table";
import "./Pages.css";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import Operation from "../../Coponents/Operation/Operation";
import axios from "axios";

function Books() {
  const [books, setBooks] = useState([]);

  const columns = [
    { header: "Category", accessor: "categoryName" },
    { header: "Title", accessor: "bookTitle" },
    { header: "Author", accessor: "bookAuthor" },
    { header: "Rating", accessor: "bookRating" },
    { header: "Count", accessor: "bookCount" },
    { header: "Operation", accessor: "operation" },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:8080/lms/books")
      .then((response) => {
        const booksData = response.data.map((book) => ({
          ...book,
          operation: (
            <Operation
              widthE="100%"
              widthD="80%"
              showExtra={true}
              isBooksPage={true}
            />
          ),
        }));

        setBooks(booksData);
      })
      .catch((error) => {
        console.error("There was an error fetching the books data!", error);
      });
  }, []);

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  return (
    <div className="pages-outer-container">
      <div className="pages-inner-container">
        <SearchBar placeholder="Search Books" onSearch={handleSearch} />
        <Button>Add Books</Button>
      </div>
      <div className="pages-table">
        <Table columns={columns} data={books} />
      </div>
    </div>
  );
}

export default DashboardHoc(Books);
