const mongoose = require("mongoose");

const proskillSchema = mongoose.Schema({
  skill: { required: true, type: String },
});

const projectSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description: { required: true, type: String },
  skills: [proskillSchema],
});

module.exports = mongoose.model("project", projectSchema);
