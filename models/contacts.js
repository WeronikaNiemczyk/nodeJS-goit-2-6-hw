// const fs = require("fs").promises;
// const path = require("path");

// const contactsPath = path.join(__dirname, "contacts.json");

// const listContacts = async () => {
//   const data = await fs.readFile(contactsPath);
//   const contactsData = JSON.parse(data);
//   return contactsData;
// };

// const getContactById = async (contactId) => {
//   const data = await fs.readFile(contactsPath);
//   const contacts = JSON.parse(data);
//   const contact = contacts.find((contact) => contact.id === contactId);
//   return contact;
// };

// const removeContact = async (contactId) => {
//   const data = await fs.readFile(contactsPath);
//   let contacts = JSON.parse(data);
//   const newContacts = contacts.filter((contact) => contact.id !== contactId);
//   return [...newContacts];
// };

// const addContact = async ({ name, email, phone }) => {
//   const data = await fs.readFile(contactsPath);
//   const contacts = JSON.parse(data);

//   const newContacts = {
//     id: Date.now().toString(),
//     name,
//     email,
//     phone,
//   };

//   contacts.push(newContacts);
//   return newContacts;
// };

// const updateContact = async ({ contactId, name, email, phone }) => {
//   const data = await fs.readFile(contactsPath);
//   const contacts = JSON.parse(data);
//   const contact = contacts.find((contact) => contact.id === contactId);

//   if (contact) {
//     if (name !== undefined) contact.name = name;
//     if (email !== undefined) contact.email = email;
//     if (phone !== undefined) contact.phone = phone;

//     return contact;
//   } else {
//     const updatedContact = {
//       id: contactId,
//       name: name || "",
//       email: email || "",
//       phone: phone || "",
//     };
//     contacts.push(updatedContact);

//     return updatedContact;
//   }
// };

// module.exports = {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// };
