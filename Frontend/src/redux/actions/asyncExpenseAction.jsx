import { createAsyncThunk } from "@reduxjs/toolkit";
import { expenseApiServices } from "../services/expenseApiService";

export const addExpenseAction = createAsyncThunk(
  "addExpenseAction",
  async (formData) => {
    const response = await expenseApiServices.addExpense(formData);
    return response;
  }
);
export const getAllExpenseAction = createAsyncThunk(
  "getAllExpenseAction",
  async (queryParams) => {
    const response = await expenseApiServices.getAllExpense(queryParams);
    return response;
  }
);
export const deleteExpenseAction = createAsyncThunk(
  "deleteExpenseAction",
  async (expenseId, thunkAPI) => {
    const response = await expenseApiServices.deleteExpense(expenseId);
    if (response) {
       const state = thunkAPI.getState()
      thunkAPI.dispatch(getAllExpenseAction(state?.expense?.queryParams));
    }
    return response;
  }
);

export const updateExpenseAction = createAsyncThunk(
  "updateExpenseAction",
  async (updatedExpenseData, thunkAPI) => {
    const response = await expenseApiServices.updateExpense(updatedExpenseData);
    if (response) {
      const state = thunkAPI.getState()
      thunkAPI.dispatch(getAllExpenseAction(state?.expense?.queryParams));
    }
    return response;
  }
);
export const getLeaderboardAction = createAsyncThunk(
  "getLeaderboardAction",
  async () => {
    const response = await expenseApiServices.premiumUserLeaderboard();
    return response;
  }
);
export const downloadExpensesAction = createAsyncThunk(
  "downloadExpensesAction",
  async () => {
    const response = await expenseApiServices.downloadExpenses();
    return response;
  }
);
export const getDownloadHistoryAction = createAsyncThunk(
  "getDownloadHistoryAction",
  async () => {
    const response = await expenseApiServices.downloadHistory();
    return response;
  }
);

