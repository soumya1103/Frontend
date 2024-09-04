import app from "../apiClient";

export const getAllCategories = async (page, size, token) => {
  return await app.get("/lms/categories", {
    headers: {
      Authorization: token,
    },
    params: {
      page: page,
      size: size,
    },
  });
};

export const getAllCategoriesNp = async (token) => {
  return await app.get("/lms/categories/all", {
    headers: {
      Authorization: token,
    },
  });
};

export const deleteCategory = async (categoryName, token) => {
  return await app.delete(`/lms/categories/name/${categoryName}`, {
    headers: {
      Authorization: token,
    },
  });
};

export const addCategory = async (categoryData, token) => {
  return await app.post("/lms/categories", categoryData, {
    headers: {
      Authorization: token,
    },
  });
};

export const updateCategory = async (categoryData, categoryName, token) => {
  return await app.put(`/lms/categories/name/${categoryName}`, categoryData, {
    headers: {
      Authorization: token,
    },
  });
};

export const countCategory = async (token) => {
  return await app.get("/lms/categories/count", {
    headers: {
      Authorization: token,
    },
  });
};

export const categorySearch = async (keyword, token) => {
  return await app.get(`/lms/categories/search/${keyword}`, {
    headers: {
      Authorization: token,
    },
  });
};
