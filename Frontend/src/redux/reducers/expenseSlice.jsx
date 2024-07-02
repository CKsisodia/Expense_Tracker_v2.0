import { createSlice } from "@reduxjs/toolkit";
import { getAllExpenseAction , getDownloadHistoryAction, getLeaderboardAction} from "../actions/asyncExpenseAction";

const initialState = {
  expenseData: [],
  leaderBoardData: [],
  downloadHistory: [],
};

const expenseSlice = createSlice({
  name: "expense",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllExpenseAction.fulfilled, (state, action) => {
      const response = action.payload;
      state.expenseData = response;
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
// export const expenseAction = expenseSlice.actions;

export const selectExpenseData = (state) => state.expense.expenseData;
export const selectLeaderBoardData = (state) => state.expense.leaderBoardData;
export const selectDownloadHistoryData = (state) => state.expense.downloadHistory;
