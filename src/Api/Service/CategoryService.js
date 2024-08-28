import app from "../apiClient";

export const getAllCategories = async () => {
  return await app.get("/lms/categories");
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
