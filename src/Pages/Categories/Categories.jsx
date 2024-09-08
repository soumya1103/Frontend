import React, { useState, useEffect } from "react";
import DashboardHoc from "../../Coponents/HOC/DashboardHoc";
import Button from "../../Coponents/Button/Button";
import Table from "../../Coponents/Table/Table";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import CategoryModal from "./CategoryModal";
import ConfirmationModal from "../../Coponents/Modal/ConfirmationModal";
import { getAllCategories, deleteCategory, categorySearch } from "../../Api/Service/CategoryService";
import "../Pages.css";
import CategoryOperations from "./CategoryOperations";
import { useSelector } from "react-redux";
import Loader from "../../Coponents/Loader/Loader";
import Toast from "../../Coponents/Toast/Toast";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState();
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryData, setCategoryData] = useState({
    categoryName: "",
    categoryIcon: "",
  });

  const [keyword, setKeyword] = useState("");
  const [searchData, setSearchData] = useState([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");

  const auth = useSelector((state) => state.auth);

  const getPageSizeBasedOnWidth = () => {
    const width = window.innerWidth;
    if (width > 1024) {
      return 7;
    } else if (width <= 1024) {
      return 14;
    }
  };

  const [size, setSize] = useState(getPageSizeBasedOnWidth());

  const handleResize = () => {
    const newSize = getPageSizeBasedOnWidth();
    setSize(newSize);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [page, size]);

  const loadCategories = async () => {
    try {
      const response = await getAllCategories(page, size, auth?.token);

      const categoriesData = response.data.content.map((category, index) => ({
        ...category,
        sNo: index + 1 + page * size,
        categoryIcon: <img src={category.categoryIcon} alt={category.categoryName} width="13%" />,
        operation: <CategoryOperations category={category} onEdit={handleEditIcon} onDelete={handleDeleteIcon} />,
      }));
      setCategories(categoriesData);
      setTotalPages(response.data.totalPages);
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

  const handleDeleteIcon = (categoryName) => {
    setCategoryToDelete(categoryName);
    setShowConfirmationModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  const handleAddCategoryClick = () => {
    setCategoryData({ categoryName: "", categoryIcon: "" });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleSearch = async () => {
    if (keyword.trim() === "") {
      loadCategories();
      setSearchData([]);
    } else if (keyword.length >= 3) {
      try {
        const response = await categorySearch(keyword, auth?.token);
        const categoriesData = response.data.map((category, index) => ({
          ...category,
          sNo: index + 1 + page * size,
          categoryIcon: <img src={category.categoryIcon} alt={category.categoryName} width="13%" />,
          operation: <CategoryOperations category={category} onEdit={handleEditIcon} onDelete={handleDeleteIcon} />,
        }));
        setSearchData(categoriesData);
      } catch (error) {
        console.log(error);
      }
    } else if (keyword.length < 3 && keyword.length > 0) {
      setToastMessage("Atleast 3 characters are required!");
      setShowToast(true);
      setToastType("error");
    }
  };

  const handleOnChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    if (value.trim() === "") {
      loadCategories();
      setSearchData([]);
    }
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      try {
        const response = await deleteCategory(categoryToDelete, auth?.token);
        if (response?.status === 200 || response?.status === 201) {
          setToastMessage("Category deleted successfully!");
          setShowToast(true);
          setToastType("success");
        }
        await loadCategories();
      } catch (error) {
        setToastMessage("There was an error deleting the category!");
        setShowToast(true);
        setToastType("error");
      } finally {
        setShowConfirmationModal(false);
        setCategoryToDelete(null);
      }
    }
  };

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
        <div className="pages-outer-container">
          <div className="pages-inner-container">
            <SearchBar placeholder="Search Category" handleOnChange={handleOnChange} handleSearch={handleSearch} />
            <Button onClick={handleAddCategoryClick}>Add Category</Button>
          </div>
          <div className="pages-table">
            {searchData.length !== 0 ? (
              <Table currentPage={page} totalPages={totalPages} columns={columns} data={searchData} onPageChange={setPage} />
            ) : (
              <Table show={true} currentPage={page} totalPages={totalPages} columns={columns} data={categories} onPageChange={setPage} />
            )}
          </div>
          {showModal && (
            <CategoryModal
              isEdit={isEdit}
              categoryData={categoryData}
              categoryToEdit={categoryToEdit}
              onClose={handleModalClose}
              reloadCategories={loadCategories}
              auth={auth}
            />
          )}
          {showConfirmationModal && (
            <ConfirmationModal show={showConfirmationModal} onClose={() => setShowConfirmationModal(false)} onConfirm={handleConfirmDelete} />
          )}
          <Toast message={toastMessage} type={toastType} show={showToast} onClose={() => setShowToast(false)} />
        </div>
      )}
    </>
  );
}

const columns = [
  { header: "S.No.", accessor: "sNo" },
  { header: "Name", accessor: "categoryName" },
  { header: "Icon", accessor: "categoryIcon" },
  { header: "Action", accessor: "operation" },
];

export default DashboardHoc(Categories);
