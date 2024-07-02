import { createSlice } from "@reduxjs/toolkit";
import { getUserInfoAction, userLoginAction } from "../actions/asyncAuthAction";

const initialState = {
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    logoutUser(state, action) {
      state.userData = null;
      localStorage.clear();
      document.cookie = `refreshToken=; Path=/`;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLoginAction.fulfilled, (state, action) => {
      const response = action.payload;
      localStorage.setItem("accessToken", response?.data?.accessToken);
      if (response?.status) {
        state.isLoggedin = true;
      }
      const isSecure = window.location.protocol === "https:";
      const secureFlag = isSecure ? "; Secure" : "";
      document.cookie = `refreshToken=${response.data.refreshToken}; Path=/${secureFlag}`;
    });
    builder.addCase(getUserInfoAction.fulfilled, (state, action) => {
      const response = action.payload;
      state.userData = response;
    });
  },
});

export default userSlice.reducer;
export const userActions = userSlice.actions;
export const selectUserData = (state) => state.user.userData;
