const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  Firstname: {
    required: true,
    type: String,
  },
  Lastname: {
    required: true,
    type: String,
  },
  Email: {
    required: true,
    type: String,
  },
  hashedPassword: {
    required: true,
    type: String,
  },
  Location: String,
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

module.exports = mongoose.model("User", userSchema);
