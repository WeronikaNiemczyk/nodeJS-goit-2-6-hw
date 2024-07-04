console.log(__dirname);
console.log("jwt.js file is running");

const jwt = require("jsonwebtoken");
// require("dotenv").config();

const payload = {
  id: "some_id",
  username: "some_username",
};
console.log("payload", payload);
// const secret = process.env.AUTH_SECRET;
// const secret = "vHG$6Lz#rKp8E3Rd%2qX!9oNs^5tHu&8yGjAmHfFnBvCdZxVcXbFn";

// const token = jwt.sign(payload, secret, { expiresIn: "12h" });

// console.log("token")
