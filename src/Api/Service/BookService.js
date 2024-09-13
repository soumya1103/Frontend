import app from "../apiClient";
import {
  ADD_BOOK,
  BOOK_SEARCH,
  DELETE_BOOK,
  GET_ALL_BOOKS,
  GET_ALL_BOOKS_NP,
  GET_BOOK_BY_ID,
  GET_BOOK_BY_TITLE,
  UPDATE_BOOK,
} from "../Api Constants/BookApiConstants";

export const getAllBooks = async (page, size) => {
  return await app.get(GET_ALL_BOOKS, {
    params: {
      page: page,
      size: size,
    },
  });
};

export const getAllBooksNp = async () => {
  return await app.get(GET_ALL_BOOKS_NP);
};

export const deleteBook = async (bookId) => {
  return await app.delete(`${DELETE_BOOK}/${bookId}`);
};

export const addBook = async (formData) => {
  return await app.post(ADD_BOOK, formData);
};

export const updateBook = async (formData, bookId) => {
  return await app.put(`${UPDATE_BOOK}/${bookId}`, formData);
};

export const getBookById = async (bookId) => {
  return await app.get(`${GET_BOOK_BY_ID}/${bookId}`);
};

export const getBookByTitle = async (bookTitle) => {
  return await app.get(`${GET_BOOK_BY_TITLE}/${bookTitle}`);
};

export const bookSearch = async (keyword) => {
  return await app.get(`${BOOK_SEARCH}/${keyword}`);
};
