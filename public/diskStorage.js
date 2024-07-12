const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/avatars"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
console.log("join", path.join(__dirname, "../public/avatars"));

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1048576,
  },
});

module.exports = { upload };
