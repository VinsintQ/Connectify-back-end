const mongoose = require("mongoose");

const educationSchema = mongoose.Schema({
  UserId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  School: {
    required: true,
    type: String,
  },
  Degree: {
    required: true,
    type: String,
  },
  StartDate: {
    required: true,
    type: Date,
  },

  EndDate: {
    required: true,
    type: Date,
  },

  Location: String,
});

module.exports = mongoose.model("education", educationSchema);
