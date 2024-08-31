import React, { useState, useEffect } from "react";
import DashboardHoc from "../../Coponents/HOC/DashboardHoc";
import Button from "../../Coponents/Button/Button";
import Table from "../../Coponents/Table/Table";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import CategoryModal from "./CategoryModal";
import {
  getAllCategories,
  deleteCategory,
} from "../../Api/Service/CategoryService";
import "../Pages.css";
import CategoryOperations from "./CategoryOperations";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState();
  const [categoryData, setCategoryData] = useState({
    categoryName: "",
    categoryIcon: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

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
          <CategoryOperations
            category={category}
            onEdit={handleEditIcon}
            onDelete={handleDeleteIcon}
          />
        ),
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error("There was an error fetching the categories data!", error);
    }
  };

  const handleEditIcon = (category) => {
    setCategoryData({
      categoryName: category.categoryName,
      categoryIcon: category.categoryIcon,
    });
    setIsEdit(true);
    setCategoryToEdit(category.categoryName);
    setShowModal(true);
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

  const handleModalClose = () => setShowModal(false);

  const handleAddCategoryClick = () => {
    setCategoryData({ categoryName: "", categoryIcon: "" });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  return (
    <div className="pages-outer-container">
      <div className="pages-inner-container">
        <SearchBar placeholder="Search Category" onSearch={handleSearch} />
        <Button onClick={handleAddCategoryClick}>Add Category</Button>
      </div>
      <div className="pages-table">
        <Table columns={columns} data={categories} />
      </div>
      {showModal && (
        <CategoryModal
          isEdit={isEdit}
          categoryData={categoryData}
          categoryToEdit={categoryToEdit}
          onClose={handleModalClose}
          reloadCategories={loadCategories}
        />
      )}
    </div>
  );
}

const columns = [
  { header: "Name", accessor: "categoryName" },
  { header: "Icon", accessor: "categoryIcon" },
  { header: "Action", accessor: "operation" },
];

export default DashboardHoc(Categories);
