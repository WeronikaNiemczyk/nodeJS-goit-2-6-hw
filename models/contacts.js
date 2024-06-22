const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    const contactsData = JSON.parse(data);
    return contactsData;
  } catch (err) {
    console.log(err);
    res.json({
      message:
        err.message ||
        "Something went wrong when trying to get contact list.",
    });
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const contact = contacts.find((contact) => contact.id === contactId);
    return contact;
  } catch (err) {
    console.log(err);
    res.json({
      message:
        err.message || "Something went wrong when trying to get contact by id.",
    });
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath);
    let contacts = JSON.parse(data);
    const newContacts = contacts.filter((contact) => contact.id !== contactId);
    return [...newContacts];
  } catch (err) {
    console.log(err);
    res.json({
      message:
        err.message || "Something went wrong when trying to remove contact.",
    });
  }
};

const addContact = async ({ name, email, phone }) => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    // console.log("contacts", contacts);
    const newContacts = {
      id: Date.now().toString(),
      name,
      email,
      phone,
    };
    // console.log("newContacts", newContacts);

    contacts.push(newContacts);
    return newContacts;
  } catch (err) {
    console.log(err);
    res.json({
      message:
        err.message || "Something went wrong when trying to add contact.",
    });
  }
};

const updateContact = async ({ contactId, name, email, phone }) => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const contact = contacts.find((contact) => contact.id === contactId);

    if (contact) {
      if (name !== undefined) contact.name = name;
      if (email !== undefined) contact.email = email;
      if (phone !== undefined) contact.phone = phone;

      return contact;
    } else {
      const updatedContact = {
        id: contactId,
        name: name || "",
        email: email || "",
        phone: phone || "",
      };
      contacts.push(updatedContact);

      return updatedContact;
    }
  } catch (err) {
    console.log(err);
    res.json({
      message:
        err.message || "Something went wrong when trying to update contact.",
    });
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
