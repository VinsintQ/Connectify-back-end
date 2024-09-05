const mongoose = require("mongoose");

const toolsSchema = mongoose.Schema({
  tool: { required: true, type: String },
});

const projectSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description: { required: true, type: String },
  tools: [toolsSchema],
});

module.exports = mongoose.model("project", projectSchema);
