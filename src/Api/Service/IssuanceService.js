import app from "../apiClient";

export const getIssuances = async (page, size) => {
  return await app.get("/lms/issuances", {
    params: {
      page: page,
      size: size,
    },
  });
};

export const getIssuancesByUserCredential = async (userCredential) => {
  return await app.get(`/lms/issuance/user/${userCredential}`);
};

export const deleteIssuance = async (bookId) => {
  return await app.delete(`/lms/issuances/id/${bookId}`);
};

export const addIssuance = async (formData) => {
  return await app.post("/lms/issuances", formData);
};

export const updateIssuance = async (formData, isuanceId) => {
  return await app.put(`/lms/issuances/id/${isuanceId}`, formData);
};

export const countByType = async () => {
  return await app.get("/lms/issuances/type/count");
};

export const getIssuancesByBookId = async (bookId) => {
  return await app.get(`/lms/issuances/book/${bookId}`);
};

export const getIssuancesByUserId = async (userId) => {
  return await app.get(`/lms/issuances/user/${userId}`);
};

export const issuanceSearch = async (keyword) => {
  return await app.get(`/lms/issuances/search/${keyword}`);
};
