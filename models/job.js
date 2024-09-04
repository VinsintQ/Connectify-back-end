const mongoose = require("mongoose");

const musthaveSchema = mongoose.Schema({
  text: { required: true, type: String },
});

const nicetohaveSchema = mongoose.Schema({
  text: { required: true, type: String },
});

const jobSchema = mongoose.Schema({
  jobtitle: { required: true, type: String },
  location: { required: true, type: String },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comapany",
  },
  workplace: { enum: ["onsite", "hybrid", "remote"] },
  jobtype: {
    enum: ["fulltime", "parttime", "internhip", "temporary"],
  },
  overview: String,
  musthave: [musthaveSchema],
  nicetohave: [nicetohaveSchema],
});

module.exports = mongoose.model("Job", jobSchema);
