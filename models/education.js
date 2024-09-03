const mongoose = require("mongoose");

const skillSchema = mongoose.Schema({
  SKillName: {
    required: true,
    type: String,
  },
  UserId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
});

const educationSchema = mongoose.Schema({
  userId: {
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

  Skills: [skillSchema],

  Location: String,
});

module.exports = mongoose.model("education", educationSchema);
