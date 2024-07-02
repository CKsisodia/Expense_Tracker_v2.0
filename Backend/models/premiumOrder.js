const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");
const User = require("./user");

const PremiumOrders = sequelize.define(
  "premiumOrders",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "2",
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "premiumOrders",
  }
);

User.hasMany(PremiumOrders, { foreignKey: "userId" });
PremiumOrders.belongsTo(User, { foreignKey: "userId" });

module.exports = PremiumOrders;
