import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/authReducers";
import expenseSlice from "./reducers/expenseSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    expense: expenseSlice,
  },
});

export default store;
