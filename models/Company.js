const e = require("cors");
const mongoose = require("mongoose");

const companyFollowersSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const AboutSchema = new mongoose.Schema({
  description: { type: String, required: true },
  industry: { required: true, type: String },
  workplace: { required: true, type: String },
  location: String,
});

const companySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  name: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  companySize: { enum: ["0-1", "2-49", "50-500", "500+"] },
  companyFollower: [companyFollowersSchema],
  About: [AboutSchema],
});

module.exports = mongoose.model("Company", companySchema);
