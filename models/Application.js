const mongoose = require("mongoose");

const appSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cv: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("App", appSchema);
