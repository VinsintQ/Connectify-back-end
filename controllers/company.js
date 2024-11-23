const express = require("express");
const router = express.Router();

const Company = require("../models/Company");
const Job = require("../models/job");
const verifyToken = require("../middleware/verify-token");

router.use(verifyToken);
//company routers ------------------------
router.get("/", async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// jobs routes ----------------------------------------
router.get("/Jobs", async (req, res) => {
  try {
    const Jobs = await Job.find().populate("company");
    res.status(200).json(Jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//apply on  a job
router.post("/Jobs/:jobId/app", async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(401).json({ error: "Job not found" });
    }
    req.body.userId = req.user._id;

    const app = await job.application.push(req.body);
    await job.save();
    res.status(200).json(app);
  } catch (error) {
    console.error("Error occurred during application creation:", error); // Log error to console
    res.status(500).json({ error: error.message });
  }
});

router.get("/:companyId", async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      res.status(404).json({ error: "company not found" });
    } else {
      res.status(200).json(company);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    req.body.owner = req.user._id;
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.put("/:companyId", async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      res.status(404).json({ error: "company not found" });
    } else {
      const updatedCompany = await Company.findByIdAndUpdate(
        req.params.companyId,
        req.body
      );
      res.status(200).json(updatedCompany);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/:companyId", async (req, res) => {
  deletedCompany = await Company.findByIdAndDelete(req.params.companyId);
  res.status(200).json({ message: `company deleted` });
});

//jobs router ----------------------------

router.get("/:companyId/jobs", async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.params.companyId });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:companyId/jobs", async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    req.body.company = company._id;
    const job = await Job.create(req.body);
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:companyId/jobs/:jobId", async (req, res) => {
  try {
    const job = await Job.findOne({
      company: req.params.companyId,
      _id: req.params.jobId,
    });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:companyId/jobs/:jobId", async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);

    if (!company.owner == req.user._id) {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      const job = await Job.findByIdAndUpdate(req.params.jobId, req.body);
      res.status(200).json(job);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:companyId/jobs/:jobId", async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);

    if (!company.owner == req.user._id) {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      const job = await Job.findByIdAndDelete(req.params.jobId);
      res.status(200).json({ message: "job deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
