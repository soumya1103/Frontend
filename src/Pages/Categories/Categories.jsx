import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { categorySearch, deleteCategory, getAllCategories } from "../../Api/Service/CategoryService";
import Button from "../../Coponents/Button/Button";
import DashboardHoc from "../../Coponents/HOC/DashboardHoc";
import Loader from "../../Coponents/Loader/Loader";
import ConfirmationModal from "../../Coponents/Modal/ConfirmationModal";
import SearchBar from "../../Coponents/SearchBar/SearchBar";
import Table from "../../Coponents/Table/Table";
import Toast from "../../Coponents/Toast/Toast";
import "../Pages.css";
import CategoryModal from "./CategoryModal";
import CategoryOperations from "./CategoryOperations";

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

  const [columns] = useState([
    { header: "S.No.", accessor: "sNo" },
    { header: "Name", accessor: "categoryName" },
    { header: "Icon", accessor: "categoryIcon" },
    { header: "Action", accessor: "operation" },
  ]);

  const getPageSizeBasedOnWidth = () => {
    const width = window.innerWidth;
    if (width > 1024) {
      return 7;
    } else if (width <= 1024) {
      return 12;
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
  });

  useEffect(() => {
    loadCategories();
  }, [page, size]);

  const loadCategories = async () => {
    try {
      const response = await getAllCategories(page, size);

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
    setCategoryToEdit(category.categoryId);
    setShowModal(true);
  };

  const handleDeleteIcon = (categoryId) => {
    setCategoryToDelete(categoryId);
    setShowConfirmationModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  const handleAddCategoryClick = () => {
    setCategoryData({ categoryName: "", categoryIcon: "" });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleSearch = async () => {
    const trimmedKeyword = keyword.trim();
    console.log(trimmedKeyword);

    if (trimmedKeyword === "") {
      loadCategories();
      setSearchData([]);
    } else if (trimmedKeyword.length >= 3) {
      try {
        const response = await categorySearch(trimmedKeyword);
        console.log(response.data);

        if (response.data.length === 0) {
          setToastMessage("No data found!");
          setShowToast(true);
          setToastType("error");
        } else {
          const categoriesData = response.data.map((category, index) => ({
            ...category,
            sNo: index + 1 + page * size,
            categoryIcon: <img src={category.categoryIcon} alt={category.categoryName} width="13%" />,
            operation: <CategoryOperations category={category} onEdit={handleEditIcon} onDelete={handleDeleteIcon} />,
          }));
          setSearchData(categoriesData);
        }
      } catch (error) {
        setToastMessage("Error finding items!");
        setShowToast(true);
        setToastType("error");
      }
    } else if (trimmedKeyword.length < 3 && trimmedKeyword.length > 0) {
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
        const response = await deleteCategory(categoryToDelete);
        setToastMessage(response.data.message);
        setShowToast(true);
        setToastType("success");
        await loadCategories();
      } catch (error) {
        setToastMessage(error.response.data.message);
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
        <div data-testid="category-container" className="pages-outer-container">
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
              data-testid="category-modal"
              isEdit={isEdit}
              categoryData={categoryData}
              categoryToEdit={categoryToEdit}
              onClose={handleModalClose}
              reloadCategories={loadCategories}
            />
          )}
          {showConfirmationModal && (
            <ConfirmationModal
              data-testid="confirmation-modal"
              show={showConfirmationModal}
              onClose={() => setShowConfirmationModal(false)}
              onConfirm={handleConfirmDelete}
            />
          )}
          <Toast message={toastMessage} type={toastType} show={showToast} onClose={() => setShowToast(false)} />
        </div>
      )}
    </>
  );
}

export default DashboardHoc(Categories);
