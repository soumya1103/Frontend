import React, { useState, useEffect } from "react";
import DashboardHoc from "../../Coponents/HOC/DashboardHoc";
import Button from "../../Coponents/Button/Button";
import Table from "../../Coponents/Table/Table";
import "./Pages.css";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import Operation from "../../Coponents/Operation/Operation";
import Modal from "../../Coponents/Modal/Modal";
import Form from "../../Coponents/Form/Form";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../Api/Service/CategoryService";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const columns = [
    { header: "Icon", accessor: "categoryIcon" },
    { header: "Name", accessor: "categoryName" },
    { header: "Operation", accessor: "operation" },
  ];

  const addCategories = async (formData, resetForm) => {
    try {
      const response = await addCategory(formData);
      console.log("Category added successfully:", response.data);
      setCategories([...categories, response.data]);
      resetForm();
      handleClose();
      await loadCategories();
    } catch (error) {
      console.error("There was an error adding the category!", error);
    }
  };

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
            onClickEdit={() => handleEditIcon(category.categoryName)}
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
    setIsEdit(false);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCategoryToEdit(null);
  };

  const handleEditIcon = (categoryName) => {
    setIsEdit(true);
    setCategoryToEdit(categoryName);
    setShowModal(true);
  };

  const updateCategories = async (formData, resetForm, categoryToEdit) => {
    try {
      const response = await updateCategory(formData, categoryToEdit);
      console.log("Category edited successfully:", response.data);
      setCategories(
        categories.map((category) =>
          category.categoryName === categoryToEdit ? response.data : category
        )
      );
      resetForm();
      handleClose();
      await loadCategories();
    } catch (error) {
      console.log("There was an error updating the category", error);
    }
  };

  const handleFormSubmit = (formData, resetForm) => {
    if (isEdit && categoryToEdit) {
      updateCategories(formData, resetForm, categoryToEdit);
    } else {
      addCategories(formData, resetForm);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const formArrForEdit = [
    {
      label: "Category Name : ",
      name: "categoryName",
      type: "text",
      required: false,
    },
    {
      label: "Category Icon URL : ",
      name: "categoryIcon",
      type: "text",
      required: false,
    },
  ];

  const formArrForAdd = [
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
          title={isEdit ? "Edit Category" : "Add Category"}
          formArr={isEdit ? formArrForEdit : formArrForAdd}
          submitBtn={isEdit ? "Update" : "Add"}
          initialValues={isEdit ? categoryToEdit : {}}
          onSubmit={handleFormSubmit}
        />
      </Modal>
    </div>
  );
}

export default DashboardHoc(Categories);
