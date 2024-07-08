const jwt = require("jsonwebtoken");
const Users = require("../models/users-models");

const authMiddleware = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  console.log("token", token);
  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    const userId = decoded.id;

    const user = await Users.findById(userId);
    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = {
  authMiddleware,
};
