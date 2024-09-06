import app from "../apiClient";

export const getAllCategories = async (page, size) => {
  return await app.get("/lms/categories", {
    params: {
      page: page,
      size: size,
    },
  });
};

export const getAllCategoriesNp = async () => {
  return await app.get("/lms/categories/all");
};

export const deleteCategory = async (categoryName) => {
  return await app.delete(`/lms/categories/name/${categoryName}`);
};

export const addCategory = async (categoryData) => {
  return await app.post("/lms/categories", categoryData);
};

export const updateCategory = async (categoryData, categoryName) => {
  return await app.put(`/lms/categories/name/${categoryName}`, categoryData);
};

export const countCategory = async () => {
  return await app.get("/lms/categories/count");
};

export const categorySearch = async (keyword) => {
  return await app.get(`/lms/categories/search/${keyword}`);
};
