const express = require("express");
const contactsRouter = express.Router();
const { authMiddleware } = require("../../middleware/jwt");
const {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
  addToFavorite,
} = require("../../controlers/contacts/index");

contactsRouter.get("/", authMiddleware, getAllContacts);
contactsRouter.get("/:contactId", authMiddleware, getContactById);
contactsRouter.post("/", authMiddleware, addContact);
contactsRouter.put("/:contactId", authMiddleware, updateContact);
contactsRouter.delete("/:contactId", authMiddleware, removeContact);
contactsRouter.patch("/:contactId/favorite", authMiddleware, addToFavorite);

module.exports = { contactsRouter };
