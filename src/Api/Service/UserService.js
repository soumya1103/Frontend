import app from "../apiClient";

export const getUserByRole = async (page, size) => {
  return await app.get("/lms/users", {
    params: {
      page: page,
      size: size,
    },
  });
};

export const getUserByRoleNp = async () => {
  return await app.get("/lms/users/all");
};

export const getUsersByCredential = async (userCredential) => {
  return await app.get(`/lms/users/credential/${userCredential}`);
};

export const deleteUser = async (userId) => {
  return await app.delete(`/lms/users/id/${userId}`);
};

export const addUser = async (userData) => {
  return await app.post("/lms/users/user", userData);
};

export const updateUser = async (userData, userId) => {
  return await app.put(`/lms/users/id/${userId}`, userData);
};

export const countUser = async () => {
  return await app.get("/lms/users/count");
};

export const userSearch = async (keyword) => {
  return await app.get(`/lms/users/search/${keyword}`);
};
