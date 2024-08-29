import app from "../apiClient";

export const getIssuances = async () => {
  return await app.get("/lms/user");
};

export const deleteBook = async (bookId) => {
  return await app.delete(`/lms/books/id/${bookId}`);
};

export const addIssuanceByUser = async (formData) => {
  return await app.post("/lms/books", formData);
};

export const addIssuanceByBook = async (formData) => {
  return await app.post("/lms/books", formData);
};

export const updateBook = async (formData, bookId) => {
  return await app.put(`/lms/books/id/${bookId}`, formData);
};
