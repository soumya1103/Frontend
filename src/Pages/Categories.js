import React, { useEffect, useState } from "react";
import DashboardHoc from "../Coponents/HOC/DashboardHoc";
import "./Categories.css";
import Button from "../Coponents/Button";
import Table from "../Coponents/Table";
import SearchBar from "../Coponents/SearchBar";
import Operation from "../Coponents/Operation";
import axios from "axios";

function Categories() {
  const [categories, setCategories] = useState([]);

  const columns = [
    { header: "Icon", accessor: "categoryIcon" },
    { header: "Name", accessor: "categoryName" },
    { header: "Operation", accessor: "operation" },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:8080/lms/categories")
      .then((response) => {
        const categoriesData = response.data.map((category) => ({
          ...category,
          categoryIcon: (
            <img
              src={category.categoryIcon}
              alt={category.categoryName}
              width="13%"
            />
          ),
          operation: <Operation widthE="6%" widthD="4.5%" />,
        }));

        setCategories(categoriesData);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the categories data!",
          error
        );
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
        <SearchBar placeholder="Search Category" onSearch={handleSearch} />
        <Button>Add Category</Button>
      </div>
      <div className="pages-table">
        <Table columns={columns} data={categories} />
      </div>
    </div>
  );
}

export default DashboardHoc(Categories);
