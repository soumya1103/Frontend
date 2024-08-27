import app from "../apiClient";

export const getAllCategories = async () => {
  return await app.get("/lms/categories");
};

export const deleteCategory = async (categoryName) => {
  return await app.delete(`/lms/categories/name/${categoryName}`);
};

export const addCategory = async (formData) => {
  return await app.post("/lms/categories", formData);
};

export const updateCategory = async (categoryToEdit, formData) => {
  return await app.put(`/lms/categories/name/${categoryToEdit}`, formData);
};
