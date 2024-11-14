const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  jobtitle: { required: true, type: String },
  location: { required: true, type: String },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comapany",
  },
  workplace: { required: true, type: String },
  jobtype: { required: true, type: String },
  overview: String,
});

module.exports = mongoose.model("Job", jobSchema);
