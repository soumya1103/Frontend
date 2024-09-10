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

export const deleteCategory = async (categoryId) => {
  return await app.delete(`/lms/categories/id/${categoryId}`);
};

export const addCategory = async (categoryData) => {
  return await app.post("/lms/categories", categoryData);
};

export const updateCategory = async (categoryData, categoryId) => {
  return await app.put(`/lms/categories/id/${categoryId}`, categoryData);
};

export const countCategory = async () => {
  return await app.get("/lms/categories/count");
};

export const categorySearch = async (keyword) => {
  return await app.get(`/lms/categories/search/${keyword}`);
};
