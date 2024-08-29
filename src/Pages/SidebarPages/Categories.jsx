import React, { useState, useEffect } from "react";
import DashboardHoc from "../../Coponents/HOC/DashboardHoc";
import Button from "../../Coponents/Button/Button";
import Table from "../../Coponents/Table/Table";
import "./Pages.css";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import Operation from "../../Coponents/Operation/Operation";
import Modal from "../../Coponents/Modal/Modal";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../Api/Service/CategoryService";
import Input from "../../Coponents/Input/Input";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState();

  const [categoryData, setCategoryData] = useState({
    categoryName: "",
    categoryIcon: "",
  });

  const handleChange = (e) => {
    setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
  };

  const columns = [
    { header: "Name", accessor: "categoryName" },
    { header: "Icon", accessor: "categoryIcon" },
    { header: "Action", accessor: "operation" },
  ];

  const loadCategories = async () => {
    try {
      const response = await getAllCategories();

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
            onClickEdit={() => handleEditIcon(category)}
            onClickDelete={() => handleDeleteIcon(category.categoryName)}
          />
        ),
      }));

      setCategories(categoriesData);
    } catch (error) {
      console.error("There was an error fetching the categories data!", error);
    }
  };

  const handleDeleteIcon = async (categoryName) => {
    try {
      const response = await deleteCategory(categoryName);
      console.log("Category deleted successfully:", response.data);
      await loadCategories();
    } catch (error) {
      console.error("There was an error deleting the category!", error);
    }
  };

  const handleClick = () => {
    setCategoryData({ categoryName: "", categoryIcon: "" });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleEditIcon = async (category) => {
    setCategoryData({
      categoryName: category.categoryName,
      categoryIcon: category.categoryIcon,
    });
    setIsEdit(true);
    setShowModal(true);
    setCategoryToEdit(category.categoryName);
  };

  const updateCategories = async (categoryData, categoryName) => {
    try {
      const response = await updateCategory(categoryData, categoryName);
      console.log("Category edited successfully:", response.data);
      setCategories([...categories, response.data]);
      handleClose();
      await loadCategories();
    } catch (error) {
      console.log("There was an error updating the category", error);
    }
  };

  const addCategories = async (categoryData) => {
    try {
      const response = await addCategory(categoryData);
      console.log("Category added successfully:", response.data);
      setCategories([...categories, response.data]);
      handleClose();
      await loadCategories();
    } catch (error) {
      console.error("There was an error adding the category!", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const onSumbitAddHandler = async () => {
    await addCategories(categoryData);
  };

  const onSumbitEditHandler = async () => {
    await updateCategories(categoryData, categoryToEdit);
  };

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
        height="230px"
        width="400px"
      >
        {isEdit ? (
          <p className="form-title">Edit Category</p>
        ) : (
          <p className="form-title">Add Category</p>
        )}
        <div className="form-content">
          <Input
            label="Category Name"
            name="categoryName"
            value={categoryData.categoryName}
            type="text"
            required={isEdit ? false : true}
            onChange={(e) => handleChange(e)}
          />

          <Input
            label="Category Icon"
            name="categoryIcon"
            type="text"
            value={categoryData.categoryIcon}
            required={!isEdit}
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div className="form-submit-btn">
          {isEdit ? (
            <Button onClick={onSumbitEditHandler}>Update</Button>
          ) : (
            <Button onClick={onSumbitAddHandler}>Add</Button>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default DashboardHoc(Categories);
