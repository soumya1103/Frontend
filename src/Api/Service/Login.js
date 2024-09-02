import app from "../apiClient";

export const login = async (userCredential, password) => {
  return await app.post(`/lms/login`, { userCredential, password });
};

export const getCurrentUser = async (token) => {
  return await app.get(`/lms/current-user`, {
    headers: {
      Authorization: token,
    },
  });
};

export const logout = () => {
  window.localStorage.removeItem("authtoken");
};
