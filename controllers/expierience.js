const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verify-token");
const Expierience = require("../models/expierience");
const User = require("../models/user");
// protected Routes
router.use(verifyToken);
// route for adding an a expierience
router.post("/", async (req, res) => {
  try {
    req.body.UserId = req.user._id;
    if (req.body.isCurrentRole) {
      req.body.EndDate = null;
    }
    const expierience = await Expierience.create(req.body);

    res.status(201).json(expierience);
  } catch (error) {
    //console.log(error);
    res.status(500).json(error);
  }
});
//get all user expierience
router.get("/", async (req, res) => {
  try {
    const expierience = await Expierience.find({
      UserId: req.user._id,
    });
    res.status(200).json(expierience);
  } catch (error) {
    //console.log(error);
    res.status(500).json(error);
  }
});

//get another user expierience
router.get("/:userid", async (req, res) => {
  try {
    const user = await User.findById(req.params.userid);

    if (!user) {
      res.status(500).json({ error: "User does not exist" });
    }
    const exp = await Expierience.find({
      UserId: req.params.userid,
    });
    res.status(200).json({ exp });
  } catch (error) {
    //console.log(error);
    res.status(500).json(error);
  }
});

router.put("/:expId", async (req, res) => {
  const exp = await Expierience.findById(req.params.expId);
  //verify user is the owner of this exp
  if (!exp.UserId == req.user._id) {
    res.status(500).json({ error: "You are not allowed to do that " });
  }
});

module.exports = router;
