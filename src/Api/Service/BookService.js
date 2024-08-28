import app from "../apiClient";

export const getAllBooks = async () => {
  return await app.get("/lms/books");
};

export const deleteBook = async (bookId) => {
  return await app.delete(`/lms/books/id/${bookId}`);
};

export const addBook = async (formData) => {
  return await app.post("/lms/books", formData);
};

export const updateBook = async (formData, bookId) => {
  return await app.put(`/lms/books/id/${bookId}`, formData);
};
