const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");
const User = require("./user");

const ForgotPasswordRequests = sequelize.define(
  "forgotPasswordRequests",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
  },
  {
    timestamps: true,
    tableName: "forgotPasswordRequests",
  }
);

User.hasMany(ForgotPasswordRequests, { foreignKey: "userId" });
ForgotPasswordRequests.belongsTo(User, { foreignKey: "userId" });

module.exports = ForgotPasswordRequests;
