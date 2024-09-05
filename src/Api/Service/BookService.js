import app from "../apiClient";

export const getAllBooks = async (page, size, token) => {
  return await app.get("/lms/books", {
    headers: {
      Authorization: token,
    },
    params: {
      page: page,
      size: size,
    },
  });
};

export const getAllBooksNp = async (token) => {
  return await app.get("/lms/books/all", {
    headers: {
      Authorization: token,
    },
  });
};

export const deleteBook = async (bookId, token) => {
  return await app.delete(`/lms/books/id/${bookId}`, {
    headers: {
      Authorization: token,
    },
  });
};

export const addBook = async (formData, token) => {
  return await app.post("/lms/books", formData, {
    headers: {
      Authorization: token,
    },
  });
};

export const updateBook = async (formData, bookId, token) => {
  return await app.put(`/lms/books/id/${bookId}`, formData, {
    headers: {
      Authorization: token,
    },
  });
};

export const getBookByTitle = async (bookTitle, token) => {
  return await app.get(`/lms/books/title/${bookTitle}`, {
    headers: {
      Authorization: token,
    },
  });
};

export const bookSearch = async (keyword, token) => {
  return await app.get(`/lms/books/search/${keyword}`, {
    headers: {
      Authorization: token,
    },
  });
};
