const mongoose = require("mongoose");

const expierienceSchema = new mongoose.Schema({
  UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  company: { required: true, type: String },

  isCurrentRole: { type: boolean, default: false },
  StartDate: { type: Date, required: true },
  EndDate: { type: Date, required: true },
  Description: String,
});
