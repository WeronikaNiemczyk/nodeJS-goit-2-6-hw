const Joi = require("joi");
const express = require("express");
const router = express.Router();
// const contacts = require("../../models/contacts");
const Contact = require("../../models/contacts-models");

const schema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string().min(9).required(),
});
router.get("/", async (req, res) => {
  console.log("GET /api/contacts called"); // Dodane logowanie
  const contacts = await Contact.find();
  console.log("Fetched contacts:", contacts); // Dodane logowanie
  res.json(contacts);
});

// router.get("/", async (req, res, next) => {
//   try {
//     const data = await contacts.listContacts();
//     res.json(data);
//   } catch (err) {
//     console.log(err);
//     res.json({
//       message:
//         err.message || "Something went wrong when trying to get contact list.",
//     });
//   }
// });

// router.get("/:contactId", async (req, res, next) => {
//   try {
//     const contactId = req.params.contactId;
//     const dataID = await contacts.getContactById(contactId);
//     if (!dataID) {
//       res.status(404).json({ message: "Not found." });
//     }
//     res.status(200).json(dataID);
//   } catch (err) {
//     console.log(err);
//     res.json({
//       message:
//         err.message || "Something went wrong when trying to get contact by id.",
//     });
//   }
// });

// router.post("/", async (req, res, next) => {
//   try {
//     const { name, email, phone } = req.body;
//     const { error } = schema.validate(req.body);
//     if (error) {
//       return res.status(400).send(error.details[0].message);
//     }

//     const newContact = await contacts.addContact({ name, email, phone });
//     res.status(201).json(newContact);
//   } catch (err) {
//     console.log(err);
//     res.json({
//       message:
//         err.message || "Something went wrong when trying to add contact.",
//     });
//   }
// });

// router.delete("/:contactId", async (req, res, next) => {
//   try {
//     const contactId = req.params.contactId;
//     const dataRemove = await contacts.removeContact(contactId);
//     if (contactId === dataRemove) {
//       res.status(200).json({ message: "contact deleted" });
//     } else {
//       res.status(404).json({ message: "Not found." });
//     }
//   } catch (err) {
//     console.log(err);
//     res.json({
//       message:
//         err.message || "Something went wrong when trying to remove contact.",
//     });
//   }
// });

// router.put("/:contactId", async (req, res, next) => {
//   try {
//     const { name, email, phone } = req.body;
//     const contactId = req.params.contactId;
//     const { error } = schema.validate(req.body);
//     if (error) {
//       return res.status(400).send(error.details[0].message);
//     }
//     try {
//       const updatedContact = await contacts.updateContact({
//         contactId,
//         name,
//         email,
//         phone,
//       });
//       res.status(200).json(updatedContact);
//     } catch (error) {
//       res.status(404).json({ message: "Not found" });
//     }
//   } catch (err) {
//     console.log(err);
//     res.json({
//       message:
//         err.message || "Something went wrong when trying to update contact.",
//     });
//   }
// });

module.exports = router;
