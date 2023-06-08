const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const payment = sequelize.define("payment", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    referenceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    metaData: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    pgId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentURL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "INITIATED",
    },
  });
  return payment;
};
