const e = require("cors");
const mongoose = require("mongoose");

companyFollowersSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
});

module.exports = mongoose.model("Company", companySchema);
