const express = require("express");
const router = express.Router();
const {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
  addToFavorite,
} = require("../../controlers/contacts/index");

router.get("/", getAllContacts);
router.get("/:contactId", getContactById);
router.post("/", addContact);
router.put("/:contactId", updateContact);
router.delete("/:contactId", removeContact);
router.patch("/:contactId/favorite", addToFavorite);

module.exports = router;
