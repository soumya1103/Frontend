import app from "../apiClient";

export const getIssuances = async (token) => {
  return await app.get("/lms/issuances", {
    headers: {
      Authorization: token,
    },
  });
};

export const deleteIssuance = async (bookId, token) => {
  return await app.delete(`/lms/issuances/id/${bookId}`, {
    headers: {
      Authorization: token,
    },
  });
};

export const addIssuance = async (formData, token) => {
  return await app.post("/lms/issuances", formData, {
    headers: {
      Authorization: token,
    },
  });
};

export const updateIssuance = async (formData, isuanceId, token) => {
  return await app.put(`/lms/issuances/id/${isuanceId}`, formData, {
    headers: {
      Authorization: token,
    },
  });
};

export const countByType = async (token) => {
  return await app.get("/lms/issuances/type/count", {
    headers: {
      Authorization: token,
    },
  });
};
