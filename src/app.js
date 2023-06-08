const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Razorpay = require("razorpay");

const payRouter = require("./router");
const db = require("./db");

const app = express();
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(morgan("dev"));

app.use(async (req, res, next) => {
  const _db = await db();
  req.db = _db.models;

  req.razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  next();
});

app.use("/payments", payRouter);

module.exports = app;
