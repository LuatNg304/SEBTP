import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    login: (state, action) => {
      return action.payload;
    },
    logout: () => {
      return initialState;
    },
    updateUser: (state, action) => {
      return { ...state, ...action.payload };
    }
  },
});

export const { login, logout,updateUser } = accountSlice.actions;

export default accountSlice.reducer;
