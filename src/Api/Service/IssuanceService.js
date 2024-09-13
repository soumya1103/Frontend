import {
  ADD_ISSUANCE,
  COUNT_ISSUANCE,
  DELETE_ISSUANCE,
  GET_ALL_ISSUANCES,
  GET_ISSUANCES_BY_BOOK_ID,
  GET_ISSUANCES_BY_CREDENTIAL,
  GET_ISSUANCES_BY_USER_ID,
  ISSUANCE_SEARCH,
} from "../Api Constants/IssuanceApiConstant";
import app from "../apiClient";

export const getIssuances = async (page, size) => {
  return await app.get(GET_ALL_ISSUANCES, {
    params: {
      page: page,
      size: size,
    },
  });
};

export const getIssuancesByUserCredential = async (userCredential) => {
  return await app.get(`${GET_ISSUANCES_BY_CREDENTIAL}/${userCredential}`);
};

export const deleteIssuance = async (bookId) => {
  return await app.delete(`${DELETE_ISSUANCE}/${bookId}`);
};

export const addIssuance = async (formData) => {
  return await app.post(ADD_ISSUANCE, formData);
};

export const updateIssuance = async (formData, isuanceId) => {
  return await app.put(`/lms/issuances/id/${isuanceId}`, formData);
};

export const countByType = async () => {
  return await app.get(COUNT_ISSUANCE);
};

export const getIssuancesByBookId = async (bookId) => {
  return await app.get(`${GET_ISSUANCES_BY_BOOK_ID}/${bookId}`);
};

export const getIssuancesByUserId = async (userId) => {
  return await app.get(`${GET_ISSUANCES_BY_USER_ID}/${userId}`);
};

export const issuanceSearch = async (keyword) => {
  return await app.get(`${ISSUANCE_SEARCH}/${keyword}`);
};
