import app from "../apiClient";

export const getUserByRole = async (page, size, token) => {
  return await app.get("/lms/users", {
    headers: {
      Authorization: token,
    },
    params: {
      page: page,
      size: size,
    },
  });
};

export const getUserByRoleNp = async (token) => {
  return await app.get("/lms/users/all", {
    headers: {
      Authorization: token,
    },
  });
};

export const getUsersByCredential = async (userCredential, token) => {
  return await app.get(`/lms/users/credential/${userCredential}`, {
    headers: {
      Authorization: token,
    },
  });
};

export const deleteUser = async (userId, token) => {
  return await app.delete(`/lms/users/id/${userId}`, {
    headers: {
      Authorization: token,
    },
  });
};

export const addUser = async (userData, token) => {
  return await app.post("/lms/users/user", userData, {
    headers: {
      Authorization: token,
    },
  });
};

export const updateUser = async (userData, userId, token) => {
  return await app.put(`/lms/users/id/${userId}`, userData, {
    headers: {
      Authorization: token,
    },
  });
};

export const countUser = async (token) => {
  return await app.get("/lms/users/count", {
    headers: {
      Authorization: token,
    },
  });
};
