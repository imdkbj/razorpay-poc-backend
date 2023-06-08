"use strict";
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize-cockroachdb");

let db = {};
let sequelize;

const connectionString = process.env.DATABASE_URL;

const initializeModels = () => {
  try {
    sequelize = new Sequelize(connectionString, {
      dialectOptions: {
        application_name: "razorpay-poc",
      },
    });

    let models = {};
    fs.readdirSync(`${__dirname}/models`)
      .filter((file) => file.indexOf(".") !== 0 && file.slice(-3) === ".js")
      .forEach(async (file) => {
        const model = require(path.join(__dirname, "models", file))(sequelize);
        models[model.name] = model;
      });

    db.sequelize = sequelize;
    db.models = models;
    global.models = models;
  } catch (error) {
    console.log(error);
  }
};

module.exports = async () => {
  try {
    if (db.isConnected) {
      console.log("=> Using existing connection.");
      return db;
    }

    console.log("=> Connecting to database.");
    initializeModels();

    console.time("dbConneciton => ");
    await sequelize.authenticate();
    console.timeEnd("dbConneciton => ");

    // await sequelize.sync();

    db.isConnected = true;
    console.log("=> Created a new connection.");
    return db;
  } catch (e) {
    console.log("DB Connection error", e);
    throw new Error(e);
  }
};
