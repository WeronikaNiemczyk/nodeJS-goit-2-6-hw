const passport = require("passport");
require("../config/jwt");

const authMiddleware = passport.authenticate("jwt", { session: false });

module.exports = {
  authMiddleware,
};
