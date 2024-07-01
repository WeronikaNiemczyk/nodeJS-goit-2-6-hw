const { fetchContacts, fetchContact } = require("./services");

const getAllContacts = async (req, res) => {
  const contacts = await fetchContacts();

  res.json(contacts);
};

const getContactById = async (req, res) => {
  const contact = await fetchContact(req.params.contactId);

  res.json(contact);
};
module.exports = {
  getAllContacts,
  getContactById,
};
