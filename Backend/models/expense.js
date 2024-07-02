const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const validCategories = [
  "Groceries",
  "Rent",
  "Utilities",
  "Transportation",
  "Entertainment",
  "Dining Out",
  "Healthcare",
  "Insurance",
  "Education",
  "Clothing",
];

const Expense = sequelize.define(
  "expense",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM,
      values: validCategories,
      validate: {
        isIn: {
          args: [validCategories],
          msg: "Invalid category. Please choose from: " + validCategories.join(", "),
        },
      },
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "expense",
  }
);

module.exports = Expense;
