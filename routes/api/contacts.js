const express = require("express");
const contactsRouter = express.Router();
const userRouter = express.Router();
const { authMiddleware } = require("../../middleware/jwt");
const {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
  addToFavorite,
  userSignup,
  userLogin,
  userLogout,
  currentUser,
  updateAvatar,
  verifyUser,
} = require("../../controlers/contacts/index");
const { upload } = require("../../public/diskStorage");

contactsRouter.get("/", authMiddleware, getAllContacts);
contactsRouter.get("/:contactId", authMiddleware, getContactById);
contactsRouter.post("/", authMiddleware, addContact);
contactsRouter.put("/:contactId", authMiddleware, updateContact);
contactsRouter.delete("/:contactId", authMiddleware, removeContact);
contactsRouter.patch("/:contactId/favorite", authMiddleware, addToFavorite);
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

module.exports = { contactsRouter, userRouter };
// try {
//   await email("<h2>Dzień dobry<h2/>", "hello", "weronika.tlusciak@gmail.com");
// } catch (err) {
//   console.log(err);
//   return next(err);
// }
