const mongoose = require("mongoose");

followersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

friendsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,

    default: "Job Seeker",
  },
  image: {
    type: String,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  isPrivate: {
    type: String,
    default: "false",
  },
  Followers: [followersSchema],
  Friends: [friendsSchema],
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

module.exports = mongoose.model("User", userSchema);
