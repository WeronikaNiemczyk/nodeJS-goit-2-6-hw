const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const { setJWTStrategy, jwt } = require("./config/jwt");
const middleware = require("./middleware/jwt");
const { contactsRouter, userRouter } = require("./routes/api/contacts");
const diskStorage = require("./public/diskStorage");
require("dotenv").config();
const path = require("path");

const { DB_HOST: urlDb } = process.env;
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

setJWTStrategy();

app.use("/api/contacts", contactsRouter);
app.use("/api", userRouter);

app.use((req, res) => {
  res.status(404).json({ message: `Not found - ${req.path}` });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message || "Something broke",
  });
});

const connection = mongoose.connect(urlDb);

const startServer = async () => {
  try {
    await connection;
    console.log("DB connected");
    app.listen(3000, () => {
      console.log("server is runing");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
startServer();

module.exports = app;
