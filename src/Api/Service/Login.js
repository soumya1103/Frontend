import { CURRENT_USER, LOGIN } from "../Api Constants/LoginApiConstants";
import app from "../apiClient";

export const login = async (userCredential, password) => {
  return await app.post(LOGIN, { userCredential, password });
};

export const getCurrentUser = async () => {
  return await app.get(CURRENT_USER);
};

export const logout = () => {
  window.localStorage.removeItem("authtoken");
};
