import React, { useEffect, useState } from "react";
import DashboardHoc from "../../Coponents/HOC/DashboardHoc";
import Button from "../../Coponents/Button/Button";
import Table from "../../Coponents/Table/Table";
import "./Pages.css";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import Operation from "../../Coponents/Operation/Operation";
import axios from "axios";
import Modal from "../../Coponents/Modal/Modal";
import Form from "../../Coponents/Form/Form";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const columns = [
    { header: "Icon", accessor: "categoryIcon" },
    { header: "Name", accessor: "categoryName" },
    { header: "Operation", accessor: "operation" },
  ];

  const handleClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleDeleteIcon = (categoryName) => {
    axios
      .delete(`http://localhost:8080/lms/categories/name/${categoryName}`)
      .then((response) => {
        console.log("Category deleted successfully:", response.data);
      })
      .catch((error) => {
        console.error("There was an error deleting the category!", error);
      });
  };

  const handleFormSubmit = (formData, resetForm) => {
    axios
      .post("http://localhost:8080/lms/categories", formData)
      .then((response) => {
        console.log("Category added successfully:", response.data);
        setCategories([...categories, response.data]);
        resetForm();
        handleClose();
      })
      .catch((error) => {
        console.error("There was an error adding the category!", error);
      });
  };

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
          operation: (
            <Operation
              widthE="60%"
              widthD="45%"
              onClickEdit={() => {}}
              onClickDelete={() => handleDeleteIcon(category.categoryName)}
            />
          ),
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
    console.log("Searching for:", query);
  };

  const formArr = [
    {
      label: "Category Name : ",
      name: "categoryName",
      type: "text",
      required: true,
    },
    {
      label: "Category Icon URL : ",
      name: "categoryIcon",
      type: "text",
      required: true,
    },
  ];

  return (
    <div className="pages-outer-container">
      <div className="pages-inner-container">
        <SearchBar placeholder="Search Category" onSearch={handleSearch} />
        <Button onClick={handleClick}>Add Category</Button>
      </div>
      <div className="pages-table">
        <Table columns={columns} data={categories} />
      </div>
      <Modal
        show={showModal}
        onClose={handleClose}
        height="200px"
        width="400px"
      >
        <Form
          title="Add Category"
          formArr={formArr}
          submitBtn="Add"
          onSubmit={handleFormSubmit}
        />
      </Modal>
    </div>
  );
}

export default DashboardHoc(Categories);
