const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const { DB_HOST: urlDb } = process.env;
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

const contactsRouter = require("./routes/api/contacts");
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: `Not found - ${req.path}` });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: "Something broke" });
});

const connection = mongoose.connect(urlDb);

const startServer = async () => {
  try {
    await connection;
    console.log("DB connected");
    app.listen(3000, () => {
      console.log("server is runing");
    });
    // const collections = await mongoose.connection.db.collections();
    // console.log(
    //   "Collections:",
    //   collections.map((c) => c.collectionName)
    // );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
startServer();

module.exports = app;
