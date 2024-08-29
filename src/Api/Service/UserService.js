import app from "../apiClient";

export const getUserByRole = async () => {
  return await app.get("/lms/users");
};

export const getUsersByCredential = async (userCredential) => {
  return await app.get(`/lms/users/credential/${userCredential}`);
};

export const deleteUser = async (userId) => {
  return await app.delete(`/lms/users/id/${userId}`);
};

export const addUser = async (userData) => {
  return await app.post("/lms/users", userData);
};

export const updateUser = async (userData, userId) => {
  return await app.put(`/lms/users/id/${userId}`, userData);
};

export const countUser = async () => {
  return await app.get("/lms/users/count");
};
