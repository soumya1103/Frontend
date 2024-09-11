import { configureStore } from "@reduxjs/toolkit";

const mockReducer = (state = {}, action) => state;

export const createMockStore = (initialState) => {
  return configureStore({
    reducer: { auth: mockReducer },
    preloadedState: initialState,
  });
};
