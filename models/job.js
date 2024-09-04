const mongoose = require("mongoose");

const musthaveSchema = mongoose.Schema({
  text: { required: true, type: String },
});
const nicetohaveSchema = mongoose.Schema({
  text: { required: true, type: String },
});
const jobSchema = mongoose.Schema({
  jobtitle: { required: true, type: String },
  workplace: { required: true, enum: ["onsite", "hybrid", "remote"] },
  location: { required: true, type: String },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comapany",
  },
  jobtype: {
    required: true,
    enum: ["fulltime", "parttime", "internhip", "temporary"],
  },
  overview: String,
  musthave: { required: true, type: [musthaveSchema] },
  nicetohave: { required: true, type: [nicetohaveSchema] },
});

module.exports = mongoose.model("Job", jobSchema);
