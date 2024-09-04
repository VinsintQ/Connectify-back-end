const express = require("express");
const router = express.Router();
const Company = require("../models/company");
const verifyToken = require("../middleware/verify-token");

router.get("/", async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:companyId", async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      res.status(404).json({ error: "company not found" });
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
    res.status(500).json(error);
  }
});
router.put("/:companyId", async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      res.status(404).json({ error: "company not found" });
    } else {

      const updatedCompany=await Company.findByIdAndUpdate(req.params.companyId, req.body);
      res.status(200).json(updatedCompany);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/:companyId", async (req, res) => {

deletedCompany=await Company.findByIdAndDelete(req.params.companyId);
res.status(200).json({message:`${deletedCompany} deleted`});

});

module.exports = router;
