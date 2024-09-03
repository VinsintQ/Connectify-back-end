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

const expierienceSchema = new mongoose.Schema({
  UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  company: { required: true, type: String },

  isCurrentRole: { type: boolean, default: false },
  StartDate: { type: Date, required: true },
  EndDate: { type: Date, required: true },
  Description: String,
  skills: [skillSchema],
});

module.exports = mongoose.model("expierience", expierienceSchema);
