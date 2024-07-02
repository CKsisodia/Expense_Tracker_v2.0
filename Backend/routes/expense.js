const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense");
const { validateAccessToken } = require("../middlewares/auth");

router.post("/add-expense", validateAccessToken, expenseController.addExpense);
router.get("/expense-list",validateAccessToken, expenseController.getAllExpense);
router.delete("/delete-expense/:expenseId",validateAccessToken, expenseController.deleteExpense);
router.put("/update-expense/:expenseId",validateAccessToken, expenseController.updateExpense);
router.get("/premium-leaderboard",validateAccessToken, expenseController.getUserPremiumLeaderboard);
router.get("/download-expenses-list",validateAccessToken, expenseController.downloadExpensesList);
router.get("/download-history",validateAccessToken, expenseController.downloadHistory);

module.exports = router;
