const mongoose = require("mongoose");

const appSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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

const jobSchema = mongoose.Schema({
  jobtitle: { required: true, type: String },
  location: { required: true, type: String },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  workplace: { required: true, type: String },
  jobtype: { required: true, type: String },
  overview: String,
  application: [appSchema],
});

module.exports = mongoose.model("Job", jobSchema);
