import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApiServices } from "../services/authApiService";

export const userSignupAction = createAsyncThunk(
  "userSignupAction",
  async (signupData) => {
    const response = await authApiServices.userSignup(signupData);
    return response;
  }
);

export const userLoginAction = createAsyncThunk(
  "userLoginAction",
  async (loginData) => {
    const response = await authApiServices.userLogin(loginData);
    return response;
  }
);

export const forgotPasswordAction = createAsyncThunk(
  "forgotPasswordAction",
  async (forgotData) => {
    const response = await authApiServices.forgotPassword(forgotData);
    return response;
  }
);

export const resetPasswordAction = createAsyncThunk(
  "resetPasswordAction",
  async (resetData) => {
    const response = await authApiServices.resetPassword(resetData);
    return response;
  }
);

export const getUserInfoAction = createAsyncThunk(
  "userInfoAction",
  async () => {
    const response = await authApiServices.userInfo();
    return response;
  }
);

export const buyPremiumAction = createAsyncThunk("buyPremiumAction", async () => {
  const response = await authApiServices.buyPremium();
  return response;
});

