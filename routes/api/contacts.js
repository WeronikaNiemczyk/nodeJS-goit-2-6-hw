const Joi = require("joi");
const express = require("express");
const router = express.Router();
const contacts = require("../../models/contacts");

const schema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email({ minDomainSegments: 2 }),
  phone: Joi.string().min(9),
});

router.get("/", async (req, res, next) => {
  const data = await contacts.listContacts();
  res.json(data);
});

router.get("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  const dataID = await contacts.getContactById(contactId);
  if (!dataID) {
    res.status(404).json({ message: "Not found." });
  }
  res.status(200).json(dataID);
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "missing required name - field" });
  }

  const newContact = await contacts.addContact({ name, email, phone });
  res.status(201).json(newContact);
});

router.delete("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  const dataRemove = await contacts.removeContact(contactId);
  if (contactId === dataRemove) {
    res.status(200).json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found." });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { name, email, phone } = req.body;
  const contactId = req.params.contactId;
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  if (!name && !email && !phone) {
    return res.status(400).json({ message: "missing fields" });
  }

  try {
    const updatedContact = await contacts.updateContact({
      contactId,
      name,
      email,
      phone,
    });
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
});

module.exports = router;
