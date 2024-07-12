const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
require("dotenv").config();
const { upload } = require("./diskStorage");

const { DB_HOST: urlDb } = process.env;
const uploadApp = express();

uploadApp.use(express.json());

uploadApp.use(express.static(path.join(__dirname, "../public")));

uploadApp.post("/avatars", upload.single("picture"), (req, res) => {
  res.send("File uploaded successfully");
});

uploadApp.use((req, res) => {
  res.status(404).json({ message: `Not found - ${req.path}` });
});

uploadApp.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message || "Something broke",
  });
});

const connection = mongoose.connect(urlDb);

const startServer = async () => {
  try {
    await connection;
    console.log("DB connected");
    uploadApp.listen(8000, () => {
      console.log("server is runing");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
startServer();

module.exports = uploadApp;
