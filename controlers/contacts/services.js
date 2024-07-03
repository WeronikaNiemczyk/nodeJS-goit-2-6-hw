const Contact = require("../../models/contacts-models");

const fetchContacts = () => {
  return Contact.find();
};
const fetchContact = (contactId) => {
  return Contact.findOne({
    _id: contactId,
  });
};

const insertContact = ({ name, email, phone }) => {
  return Contact.create({ name, email, phone });
};
const putContact = ({ contactId, toUpdate, upsert = false }) => {
  return Contact.findByIdAndUpdate(
    { _id: contactId },
    { $set: toUpdate },
    { new: true, strict: "throw", upsert }
  );
};
const updateFavorite = async (contactId, toUpdate) => {
  const fav = await Contact.findById(contactId);
  if (!fav) {
    return null;
  }
  fav.favorite = toUpdate.favorite;
  await fav.save();
  return fav;
};

const deleteContact = (contactId) => {
  return Contact.deleteOne({ _id: contactId });
};

module.exports = {
  fetchContacts,
  fetchContact,
  insertContact,
  putContact,
  deleteContact,
  updateFavorite,
};
