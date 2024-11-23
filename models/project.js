const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { required: true, type: String },
  description: { required: true, type: String },
});

module.exports = mongoose.model("project", projectSchema);
