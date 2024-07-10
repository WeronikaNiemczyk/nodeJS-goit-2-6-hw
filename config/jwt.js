const passport = require("passport");
const { ExtractJwt, Strategy: JWTStrategy } = require("passport-jwt");
const Users = require("../models/users-models");
require("dotenv").config();

const { AUTH_SECRET: secret } = process.env;
const setJWTStrategy = () => {
  const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  passport.use(
    new JWTStrategy(params, async function (payload, done) {
      try {
        const user = await Users.findOne({ _id: payload.id }).lean();
        if (!user) {
          return done(new Error("User not found"));
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
};
module.exports = { setJWTStrategy };
