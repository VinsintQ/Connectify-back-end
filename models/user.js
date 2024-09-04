const mongoose = require("mongoose");

followersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
});

skillsSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: true,
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
  },

  hashedPassword: {
    type: String,
    required: true,
  },
  Followers: [followersSchema],
  Friends: [friendsSchema],
  Skills: [skillsSchema],
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

module.exports = mongoose.model("User", userSchema);
