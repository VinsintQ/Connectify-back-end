const mongoose = require("mongoose");

const skillSchema = mongoose.Schema({
  SKillName: {
    required: true,
    type: String,
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const expierienceSchema = new mongoose.Schema({
  UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  company: { required: true, type: String },

  isCurrentRole: { type: Boolean, default: false },
  StartDate: { type: Date, required: true },
  EndDate: { type: Date },
  Description: String,
  skills: [skillSchema],
});

module.exports = mongoose.model("expierience", expierienceSchema);
