import app from "../apiClient";

export const getAllBooks = async (page, size) => {
  return await app.get("/lms/books", {
    params: {
      page: page,
      size: size,
    },
  });
};

export const getAllBooksNp = async () => {
  return await app.get("/lms/books/all");
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

export const getBookByTitle = async (bookTitle) => {
  return await app.get(`/lms/books/title/${bookTitle}`);
};

export const bookSearch = async (keyword) => {
  return await app.get(`/lms/books/search/${keyword}`);
};
