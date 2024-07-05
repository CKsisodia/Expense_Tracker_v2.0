const Expense = require("../models/expense");
const User = require("../models/user");
const DownloadHistory = require("../models/downloadHistory");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const sequelize = require("../db/database");
const { uploadFilesToS3 } = require("../services/UploadFile");
const {
  dateForFileName,
  getPagination,
  getSorting,
  getSearching,
  viewFilter,
} = require("../utils/helperFunctions");
const moment = require('moment-timezone')
const {Op} = require('sequelize')

exports.addExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { description, amount, category } = req.body;
    const userId = req.user.id;
    if (!(description && amount && category)) {
      await t.rollback();
      return res.status(400).json(new ApiError("All fiels are mandatory"));
    }
    const numberAmount = Number(amount);
    const createExpense = await Expense.create(
      {
        description,
        amount:numberAmount,
        category,
        userId,
      },
      { transaction: t }
    );

    const user = await User.findByPk(userId, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(400).json(new ApiError("user not found"));
    }

    user.totalAmount = Number(user.totalAmount) + numberAmount;    
    await user.save({ transaction: t });
    await t.commit();

    return res
      .status(201)
      .json(new ApiResponse("New expense created succesfully", createExpense));
  } catch (error) {
    await t.rollback();
    if (error.name === "SequelizeValidationError") {
      const errorMessage = error.errors.map((err) => err.message).join(", ");
      return res.status(400).json(new ApiError(errorMessage));
    }
    return res.status(500).json("Internal server error");
  }
};

exports.getAllExpense = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'DESC';
    const search = req.query.search || '';
    const view = req.query.view || '';

    const { limit, offset } = getPagination(page, pageSize);
    const order = getSorting(sortBy, sortOrder);
    const searchFilter = getSearching(search);
    const viewFilterDates = viewFilter(view);


    const getAllExpenseData = await Expense.findAndCountAll({
      where: {
        userId,
        ...searchFilter,
        ...viewFilterDates
      },
      limit,
      offset,
      order,
    });

    if (!getAllExpenseData) {
      res.status(404).json(new ApiError("Expense not found"));
    }

    const responseData = {
      total: getAllExpenseData.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(getAllExpenseData.count / limit),
      data: getAllExpenseData.rows,
     
    };

    return res
      .status(200)
      .json(new ApiResponse("Get all expenses successfully", responseData));
  } catch (error) {
    return res.status(500).json(new ApiError("Internal server error"));
  }
};

exports.deleteExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { expenseId } = req.params;

    const expense = await Expense.findByPk(expenseId, { transaction: t });
    if (!expense) {
      await t.rollback();
      res.status(400).json(new ApiError("Expense not found"));
    }

    const amount = expense.amount;

    const deletedExpense = await Expense.destroy({
      where: { id: expenseId, userId },
    });

    const user = await User.findByPk(userId, { transaction: t });

    if (!user) {
      await t.rollback();
      return res.status(400).json(new ApiError("user not found"));
    }

    user.totalAmount -= amount;
    await user.save();
    await t.commit();

    return res
      .status(200)
      .json(new ApiResponse("Expense deleted successfully", deletedExpense));
  } catch (error) {
    await t.rollback();
    return res.status(500).json(new ApiError("Internal server error"));
  }
};

exports.updateExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { updateDescription, updateAmount, updateCategory } = req.body;
    const { expenseId } = req.params;
    const userId = req.user.id;

    const numberAmount = Number(updateAmount);


    if (!(updateDescription && updateAmount && updateCategory && expenseId)) {
      await t.rollback();
      return res
        .status(400)
        .json(new ApiError("All fields are mandatory with expenseId"));
    }

    const expense = await Expense.findOne(
      {
        where: { id: expenseId, userId: userId },
      },
      { transaction: t }
    );

    if (!expense) {
      await t.rollback();
      return res.status(404).json(new ApiError("Expense not found"));
    }

    const oldAmount = Number(expense.amount);
    expense.description = updateDescription || expense.description;
    expense.amount = numberAmount || oldAmount;
    expense.category = updateCategory || expense.category;
    await expense.save({ transaction: t });

    const user = await User.findByPk(userId, { transaction: t });

    if (!user) {
      await t.rollback();
      return res.status(400).json(new ApiError("user not found"));
    }

    user.totalAmount = Number(user.totalAmount) + numberAmount - oldAmount;

    await user.save({ transaction: t });
    await t.commit();

    return res
      .status(200)
      .json(new ApiResponse("Expense updated !", { expense }));
  } catch (error) {
    await t.rollback();
    return res.status(500).json(new ApiError("Internal server error"));
  }
};

exports.getUserPremiumLeaderboard = async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: ["username", "totalAmount", "premiumUser"],
      order: [[sequelize.literal("totalAmount"), "DESC"]],
    });

    if (!userData) {
      return res.status(400).json(new ApiError("User not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse("Data fetch Successfully", userData));
  } catch (error) {
    return res.status(500).json(new ApiError("Internal server error"));
  }
};

exports.downloadExpensesList = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.findAll({ where: { userId } });

    if (!expenses.length) {
      return res.status(404).json(new ApiError("No expenses found"));
    }

    const stringifyList = JSON.stringify(expenses);
    const fileName = `Expenses-${dateForFileName(new Date())}.txt`;

    const fileUrl = await uploadFilesToS3(stringifyList, fileName);

    console.log(fileUrl);

    if (!fileUrl) {
      return res.status(404).json(new ApiError("Please try after sometime"));
    }

    if (fileUrl) {
      await DownloadHistory.create({
        fileName: fileUrl.Key,
        fileUrl: fileUrl.Location,
        userId,
      });
    }

    return res.status(200).json(
      new ApiResponse("Get file url successfully", {
        fileUrl: fileUrl.Location,
        fileName: fileUrl.Key,
      })
    );
  } catch (error) {
    return res.status(404).json(new ApiError("Please try after sometime"));
  }
};

exports.downloadHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(404).json(new ApiError("User not found"));
    }

    const getDownloadHistory = await DownloadHistory.findAll({
      where: {
        userId,
      },
    });

    if (!getDownloadHistory) {
      return res.status(404).json(new ApiError("No Data found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          "Downloaded List fetch successfully",
          getDownloadHistory
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError("Internal server error"));
  }
};
