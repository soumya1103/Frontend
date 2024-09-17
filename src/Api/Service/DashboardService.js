import app from "../apiClient";
import { GET_COUNTS } from "../ApiConstants";

export const getAllCount = async () => {
  return await app.get(GET_COUNTS);
};
