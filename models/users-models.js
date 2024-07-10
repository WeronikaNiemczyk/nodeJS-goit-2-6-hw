const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const usersSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
});

usersSchema.methods.setPassword = async (password) => {
  this.password = await bcrypt.hash(password, 10);
};
usersSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
