import app from "../apiClient";

export const getUserByRole = async () => {
  return await app.get("/lms/users");
};

export const getUsersByCredential = async (userCredential) => {
  return await app.get(`/lms/users/credential/${userCredential}`);
};

// export const deleteBook = async (bookId) => {
//   return await app.delete(`/lms/books/id/${bookId}`);
// };

// export const addBook = async (formData) => {
//   return await app.post("/lms/books", formData);
// };

// export const updateBook = async (formData, bookId) => {
//   return await app.put(`/lms/books/id/${bookId}`, formData);
// };
