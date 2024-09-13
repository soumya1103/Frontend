import {
  ADD_USER,
  COUNT_USER,
  DELETE_USER,
  GET_ALL_USERS,
  GET_ALL_USERS_NP,
  GET_USERS_BY_CREDENTIAL,
  UPDATE_USER,
  USER_SEARCH,
} from "../Api Constants/UserApiConstants";
import app from "../apiClient";

export const getUserByRole = async (page, size) => {
  return await app.get(GET_ALL_USERS, {
    params: {
      page: page,
      size: size,
    },
  });
};

export const getUserByRoleNp = async () => {
  return await app.get(GET_ALL_USERS_NP);
};

export const getUsersByCredential = async (userCredential) => {
  return await app.get(`${GET_USERS_BY_CREDENTIAL}/${userCredential}`);
};

export const deleteUser = async (userId) => {
  return await app.delete(`${DELETE_USER}/${userId}`);
};

export const addUser = async (userData) => {
  return await app.post(ADD_USER, userData);
};

export const updateUser = async (userData, userId) => {
  return await app.put(`${UPDATE_USER}/${userId}`, userData);
};

export const countUser = async () => {
  return await app.get(COUNT_USER);
};

export const userSearch = async (keyword) => {
  return await app.get(`${USER_SEARCH}/${keyword}`);
};
