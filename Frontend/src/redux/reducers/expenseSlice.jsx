import { createSlice } from "@reduxjs/toolkit";
import {
  getAllExpenseAction,
  getDownloadHistoryAction,
  getLeaderboardAction,
} from "../actions/asyncExpenseAction";

export const initialState = {
  expenseData: [],
  leaderBoardData: [],
  downloadHistory: [],
  queryParams: {
    page: 0,
    pageSize: 5,
    sortBy: "createdAt",
    sortOrder: "DESC",
    search: "",
    view: ""
  }
};

const expenseSlice = createSlice({
  name: "expense",
  initialState: initialState,
  reducers: {
    setQueryParams(state, action) {
      state.queryParams = action.payload;
      localStorage.setItem('queryParams', JSON.stringify(action.payload))
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllExpenseAction.fulfilled, (state, action) => {
      const response = action.payload;
      state.expenseData = response?.data;
    });
    builder.addCase(getLeaderboardAction.fulfilled, (state, action) => {
      const response = action.payload;
      state.leaderBoardData = response;
    });
    builder.addCase(getDownloadHistoryAction.fulfilled, (state, action) => {
      const response = action.payload;
      state.downloadHistory = response?.data;
    });
  },
});

export default expenseSlice.reducer;
export const expenseAction = expenseSlice.actions;

export const selectExpenseData = (state) => state.expense.expenseData;
export const selectLeaderBoardData = (state) => state.expense.leaderBoardData;
export const selectDownloadHistoryData = (state) =>
  state.expense.downloadHistory;
