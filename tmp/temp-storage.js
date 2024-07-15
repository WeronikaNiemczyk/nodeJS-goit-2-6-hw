const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");
const jimp = require("jimp");
const Users = require("../models/users-models");

const tmpStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const updateAvatar = async (req, res) => {
  const avatarsPath = path.join(__dirname, "../public/avatars");
  const { path: tmpPath, originalname } = req.file;
  const { _id } = req.user;
  try {
    const extension = originalname.split(".").reverse();
    const avatarName = `${_id}.${extension}`;
    const resultPath = path.join(avatarsPath, avatarName);

    console.log("path", resultPath);

    const image = await jimp.read(tmpPath);
    await image.resize(250, 250).writeAsync(resultPath);

    const avatarURL = `/avatars/${avatarName}`;
    await Users.findByIdAndUpdate(_id, { avatarURL });
    res.status(200).json({ avatarURL });
  } catch {
    res.status(500).json({ message: error.message });
  }
};
const uploadTemp = multer({ tmpStorage });
module.exports = { updateAvatar, uploadTemp };
