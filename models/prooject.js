const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  Description: { required: true, type: String },
  skills: [proskillSchema],
});

const proskillSchema = mongoose.Schema({
  skill: { required: true, type: String },
});
module.exports = mongoose.model("project", projectSchema);
