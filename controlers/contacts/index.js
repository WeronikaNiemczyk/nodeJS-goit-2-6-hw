const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {
  fetchContacts,
  fetchContact,
  insertContact,
  putContact,
  deleteContact,
  updateFavorite,
} = require("./services");
const Users = require("../../models/users-models");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");

const schema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string().min(9).required(),
  favorite: Joi.boolean,
});
const schemaRegister = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
  subscription: Joi.string(),
});
const schemaFav = Joi.object({
  favorite: Joi.boolean().required(),
});

const currentUser = async (req, res) => {
  const user = req.user;
  if (user) {
    return res
      .status(200)
      .json({ email: user.email, subscription: user.subscription });
  } else {
    return res.status(401).json({ message: "Not authorized" });
  }
};

const userSignup = async (req, res, next) => {
  const { email, password, subscription } = req.body;
  const { error } = schemaRegister.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const user = await Users.findOne({ email });
    if (user) {
      res.status(409).json({ message: "Email in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const url = gravatar.url(email, { s: "200", r: "pg", d: "404" });
    const newUser = new Users({
      email,
      password: hashedPassword,
      subscription,
      avatarURL: url,
    });

    await newUser.save();
    return res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.url,
      },
    });
  } catch (err) {
    next(err);
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const { error } = schemaRegister.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const isPasswordCorrect = await user.validatePassword(password);
    if (isPasswordCorrect) {
      const payload = {
        id: user._id,
      };
      const token = jwt.sign(payload, process.env.AUTH_SECRET, {
        expiresIn: "12h",
      });
      user.token = token;
      await user.save();
      return res.status(200).json({
        token,
        user: { email: user.email, subscription: user.subscription },
      });
    } else {
      return res.status(401).json({ message: "Wrong password" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
const userLogout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await Users.findById(userId);
    // if (!user) {
    //   return res.status(401).json({ message: "Not authorized" });
    // } else {
    user.token = null;
    await user.save();
    return res.status(204).send();
    // }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await fetchContacts();
    res.json(contacts);
  } catch (err) {
    next(err);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await fetchContact(req.params.contactId);
    if (contact) {
      res.json(contact);
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

const addContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const result = await insertContact({
    name,
    email,
    phone,
  });
  res.status(201).json(result);
  try {
  } catch (err) {
    next(err);
  }
};
const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const result = await putContact({
      contactId,
      toUpdate: req.body,
      upsert: true,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const removeContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    await deleteContact(contactId);
    res.status(204).send({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};
const addToFavorite = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const { error } = schemaFav.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  if (favorite === undefined) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  try {
    const result = await updateFavorite(contactId, { favorite });
    if (!result) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }

  // const userLogout = (req, res) => {
  //   try {
  //     res.json(ok);
  //   } catch (err) {
  //     next(err);
  //   }
  // };
};
module.exports = {
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
};
