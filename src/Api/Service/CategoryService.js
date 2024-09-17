import app from "../apiClient";
import { GET_ALL_CATEGORIES, GET_ALL_CATEGORIES_NP, DELETE_CATEGORY, ADD_CATEGORY, UPDATE_CATEGORY, CATEGORY_SEARCH } from "../ApiConstants";

export const getAllCategories = async (page, size) => {
  return await app.get(GET_ALL_CATEGORIES, {
    params: {
      page: page,
      size: size,
    },
  });
};

export const getAllCategoriesNp = async () => {
  return await app.get(GET_ALL_CATEGORIES_NP);
};

export const deleteCategory = async (categoryId) => {
  return await app.delete(`${DELETE_CATEGORY}/${categoryId}`);
};

export const addCategory = async (categoryData) => {
  return await app.post(ADD_CATEGORY, categoryData);
};

export const updateCategory = async (categoryData, categoryId) => {
  return await app.put(`${UPDATE_CATEGORY}/${categoryId}`, categoryData);
};

export const categorySearch = async (keyword) => {
  return await app.get(`${CATEGORY_SEARCH}/${keyword}`);
};
