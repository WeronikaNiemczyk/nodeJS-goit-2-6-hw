const Contact = require("../../models/contacts-models");

const fetchContacts = () => {
  return Contact.find();
};
const fetchContact = (contactId) => {
  return Contact.findOne({
    _id: contactId,
  });
};

module.exports = { fetchContacts, fetchContact };
