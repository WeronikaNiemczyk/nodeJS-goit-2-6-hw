const express = require("express");
const router = express.Router();
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
} = require("../../controlers/contacts/index");
const { upload } = require("../../public/diskStorage");

router.get("/", authMiddleware, getAllContacts);
router.get("/:contactId", authMiddleware, getContactById);
router.post("/", authMiddleware, addContact);
router.put("/:contactId", authMiddleware, updateContact);
router.delete("/:contactId", authMiddleware, removeContact);
router.patch("/:contactId/favorite", authMiddleware, addToFavorite);
router.post("/users/signup", userSignup);
router.post("/users/login", userLogin);
router.get("/users/logout", authMiddleware, userLogout);
router.get("/users/current", authMiddleware, currentUser);
router.patch(
  "/users/avatars",
  authMiddleware,
  upload.single("picture"),
  updateAvatar
);

module.exports = router;
