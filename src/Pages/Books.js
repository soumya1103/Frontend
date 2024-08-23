import React, { useEffect, useState } from "react";
import DashboardHoc from "../Coponents/HOC/DashboardHoc";
import Button from "../Coponents/Button";
import Table from "../Coponents/Table";
import SearchBar from "../Coponents/SearchBar";
import Operation from "../Coponents/Operation";
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
        console.log(response.data);

        const booksData = response.data.map((book) => ({
          ...book,
          operation: <Operation widthE="13%" widthD="10%" />,
        }));

        setBooks(booksData);
      })
      .catch((error) => {
        console.error("There was an error fetching the books data!", error);
      });
  }, []);

  const handleSearch = (query) => {
    // Perform your search logic here, e.g., filter a list or make an API call
    console.log("Searching for:", query);
    // Update the searchResults state with the results
    // setSearchResults(results);
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
