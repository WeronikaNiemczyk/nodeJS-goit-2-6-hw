const Joi = require("joi");
const jwt = require("jsonwebtoken");
const Users = require("../../models/users-models");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jimp = require("jimp");
const path = require("path");
const multer = require("multer");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");
const { main } = require("../../email/email");

const schemaRegister = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
  subscription: Joi.string(),
});
const userSignup = async (req, res, next) => {
  const { email, password, subscription } = req.body;
  const { error } = schemaRegister.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const user = await Users.findOne({ email });
    if (user) {
      res.status(409).json({ message: "Email in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const url = gravatar.url(email, { s: "200", r: "pg", d: "404" });
    const verificationToken = uuidv4();
    const newUser = new Users({
      email,
      password: hashedPassword,
      subscription,
      avatarURL: url,
      verificationToken,
    });

    await newUser.save();
    try {
      await main(
        email,
        `<h1>E-mail verification</h1><p>Please confirm your email address by clicking the link:<br> <a href="http://localhost:3000/api/users/verify/${verificationToken}">Click!</a> </br> If you did not sign up, you can simply disregard this email.</p>`
      );
    } catch (err) {
      console.log(err);
      return next(err);
    }

    return res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.url,
        verificationToken: newUser.verificationToken,
      },
    });
  } catch (err) {
    next(err);
  }
};
const verifyToken = async (req, res) => {
  const { verificationToken } = req.params;
  try {
    const user = await Users.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verify = true;
    user.verificationToken = null;
    await user.save();

    return res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
const verifyUser = async (req, res) => {
  const { email } = req.body;
  const { verificationToken } = req.params;
  const user = await Users.findOne({ email });

  if (!email) res.status(400).json({ message: "missing required field email" });

  try {
    if (!user.verify) {
      await main(
        email,
        `<h1>E-mail verification</h1><p>Please confirm your email address by clicking the link:<br> <a href="http://localhost:3000/api/users/verify/${verificationToken}">Click!</a> </br> If you did not sign up, you can simply disregard this email.</p>`
      );
      res.json({ message: "Email sent" });
    } else {
      res.status(400).json({
        message: "Verification has already been passed",
        user: {
          email: email,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const currentUser = async (req, res) => {
  const user = req.user;
  if (user) {
    return res
      .status(200)
      .json({ email: user.email, subscription: user.subscription });
  } else {
    return res.status(401).json({ message: "Not authorized" });
  }
};

const updateAvatar = async (req, res) => {
  const avatarsPath = path.join(__dirname, "../../tmp");

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  console.log("avatarsPath", avatarsPath);
  const { path: tmpPath, originalname } = req.file;
  const { _id } = req.user;
  console.log("tmpPath", tmpPath);
  try {
    const extension = originalname.split(".").pop();
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

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const { error } = schemaRegister.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const isPasswordCorrect = await user.validatePassword(password);
    if (isPasswordCorrect) {
      const payload = {
        id: user._id,
      };
      const token = jwt.sign(payload, process.env.AUTH_SECRET, {
        expiresIn: "12h",
      });
      user.token = token;
      await user.save();
      return res.status(200).json({
        token,
        user: { email: user.email, subscription: user.subscription },
      });
    } else {
      return res.status(401).json({ message: "Wrong password" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
const userLogout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await Users.findById(userId);
    user.token = null;
    await user.save();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateAvatar,
  userSignup,
  userLogin,
  userLogout,
  currentUser,
  verifyToken,
  verifyUser,
};
