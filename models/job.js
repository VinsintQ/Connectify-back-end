const mongoose = require("mongoose");

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
});

module.exports = mongoose.model("Job", jobSchema);
