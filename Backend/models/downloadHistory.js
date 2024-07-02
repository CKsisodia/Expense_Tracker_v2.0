const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");
const User = require("./user");

const DownloadHistory = sequelize.define(
  "downloadHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    tableName: "downloadHistory",
  }
);

User.hasMany(DownloadHistory, { foreignKey: "userId" });
DownloadHistory.belongsTo(User, { foreignKey: "userId" });

module.exports = DownloadHistory;
