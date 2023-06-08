const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const package = sequelize.define("package", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    name: {
      type: DataTypes.STRING,
    },
  });
  return package;
};
