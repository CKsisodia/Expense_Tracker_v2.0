import ApiHelper from "../../utils/apiHelperFunction";
import { toast } from "react-toastify";

class ExpenseApiServices {
  static getInstance() {
    return new ExpenseApiServices();
  }

  addExpense = async (formData) => {
    try {
      const response = await ApiHelper.post("/expense/add-expense", formData);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      throw error;
    }
  };

  getAllExpense = async () => {
    try {
      const response = await ApiHelper.get("/expense/expense-list");
      return response?.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  deleteExpense = async (expenseId) => {
    try {
      const response = await ApiHelper.delete(
        `expense/delete-expense/${expenseId}`
      );
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      throw error;
    }
  };

  updateExpense = async (editFormData) => {
    try {
      const expenseId = editFormData?.expenseId;
      const updatedData = {
        updateDescription: editFormData?.updateDescription,
        updateAmount: editFormData?.updateAmount,
        updateCategory: editFormData?.updateCategory,
      };
      const response = await ApiHelper.put(
        `expense/update-expense/${expenseId}`,
        updatedData
      );
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      throw error;
    }
  };

  premiumUserLeaderboard = async () => {
    try {
      const response = await ApiHelper.get("/expense/premium-leaderboard");
      return response?.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  downloadExpenses = async () => {
    try {
      const response = await ApiHelper.get("/expense/download-expenses-list");
      return response?.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  downloadHistory = async () => {
    try {
      const response = await ApiHelper.get("/expense/download-history");
      return response?.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export const expenseApiServices = ExpenseApiServices.getInstance();
