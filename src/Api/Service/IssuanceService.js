import app from "../apiClient";

export const getIssuances = async () => {
  return await app.get("/lms/issuances");
};

export const deleteIssuance = async (bookId) => {
  return await app.delete(`/lms/issuances/id/${bookId}`);
};

export const addIssuance = async (formData) => {
  return await app.post("/lms/issuances", formData);
};

export const updateIssuance = async (formData, bookId) => {
  return await app.put(`/lms/books/id/${bookId}`, formData);
};

export const countByType = async () => {
  return await app.get("/lms/issuances/type/count");
};
