const mongoose = require("mongoose");

const expierienceSchema = new mongoose.Schema({
  UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  company: { required: true, type: String },
  position: { required: true, type: String },
  isCurrentRole: { type: Boolean, default: false },
  StartDate: { type: Date, required: true },
  EndDate: { type: Date },
  Description: String,
});

module.exports = mongoose.model("expierience", expierienceSchema);
