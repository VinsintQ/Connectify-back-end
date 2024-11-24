const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  serviceTitle: { required: true, type: String },
  description: { required: true, type: String },
  startingPrice: { required: true, type: Number },
});

module.exports = mongoose.model("service", serviceSchema);
