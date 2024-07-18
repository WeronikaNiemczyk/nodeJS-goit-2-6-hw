const express = require("express");
const userRouter = express.Router();
const { authMiddleware } = require("../../middleware/jwt");
const {
  userSignup,
  userLogin,
  userLogout,
  currentUser,
  updateAvatar,
  verifyUser,
} = require("../../controlers/users/index");
const { upload } = require("../../public/diskStorage");

userRouter.post("/users/signup", userSignup);
userRouter.post("/users/login", userLogin);
userRouter.get("/users/logout", authMiddleware, userLogout);
userRouter.get("/users/current", authMiddleware, currentUser);
userRouter.patch(
  "/users/avatars",
  authMiddleware,
  upload.single("picture"),
  updateAvatar
);
userRouter.get("/users/verify/:verificationToken", verifyUser);

module.exports = { userRouter };
// try {
//   await email("<h2>Dzień dobry<h2/>", "hello", "weronika.tlusciak@gmail.com");
// } catch (err) {
//   console.log(err);
//   return next(err);
// }
