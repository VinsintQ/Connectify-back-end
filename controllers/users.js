const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verify-token");
const bcrypt = require("bcrypt");
//models
const User = require("../models/user");
const Expierience = require("../models/expierience");
const Education = require("../models/education");
const Project = require("../models/project");
const Post = require("../models/post");

// protected Routes

//Routes
router.post("/signup", async (req, res) => {
  try {
    // Check if the username is already taken
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.status(400).json({ error: "Username already taken." });
    }

    // Create a new user with hashed password
    const user = await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      occupation: req.body.occupation,
      hashedPassword: bcrypt.hashSync(
        req.body.password,
        parseInt(process.env.SALT)
      ),
    });

    const token = jwt.sign(
      {
        username: user.username,
        _id: user._id,
      },
      process.env.JWT_SECRET
    );
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
      const token = jwt.sign(
        {
          username: user.username,
          _id: user._id,
          isRestaurant: user.isRestaurant,
        },
        process.env.JWT_SECRET
      );
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: "Invalid username or password." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.use(verifyToken);

router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/add-follower", async (req, res) => {
  try {
    const { username, userId } = req.body;
    const userToAdd = await User.findOne({ username: username });
    if (!userToAdd) {
      return res.status(404).json({ error: "User to add not found." });
    }

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found." });
    }

    const alreadyFollowed = currentUser.Followers.some(
      (friend) => friend.username === username
    );
    if (alreadyFollowed) {
      return res
        .status(400)
        .json({ error: "Username is already in your friends list." });
    }

    currentUser.Followers.push(userToAdd);
    await currentUser.save();

    res.status(200).json({ message: "Friend added successfully." });
  } catch (error) {
    console.error("Error adding friend:", error);
    res
      .status(400)
      .json({ error: "An error occurred while adding the friend." });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404);
      throw new Error("Something went wrong");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/add-friend", async (req, res) => {
  try {
    const { username, userId } = req.body;
    const userToAdd = await User.findOne({ username: username });
    if (!userToAdd) {
      return res.status(404).json({ error: "User to add not found." });
    }

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found." });
    }

    const alreadyfriend = currentUser.Friends.some(
      (friend) => friend.username === username
    );
    if (alreadyfriend) {
      return res
        .status(400)
        .json({ error: "Username is already in your friends list." });
    }

    currentUser.Friends.push(userToAdd);
    await currentUser.save();

    res.status(200).json({ message: "Friend added successfully." });
  } catch (error) {
    console.error("Error adding friend:", error);
    res
      .status(400)
      .json({ error: "An error occurred while adding the friend." });
  }
});

//experiece routes here---------------------

router.post("/expierience", async (req, res) => {
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

router.get("/expierience", async (req, res) => {
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

router.get("/:userId/expierience", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      res.status(500).json({ error: "User does not exist" });
    }
    const exp = await Expierience.find({
      UserId: req.params.userId,
    });
    res.status(200).json({ exp });
  } catch (error) {
    //console.log(error);
    res.status(500).json(error);
  }
});

router.put("/:userId/experience/:expId", async (req, res) => {
  const exp = await Expierience.findById(req.params.expId);
  //verify user is the owner of this exp
  if (!exp.UserId == req.user._id) {
    res.status(500).json({ error: "You are not allowed to do that " });
  }
});

router.delete("/:userId/experience/:expId", async (req, res) => {
  const exp = await Expierience.findByIdAndDelete(req.params.expId);

  if (!exp.UserId == req.user._id) {
    res.status(500).json({ error: "only owner can do this " });
  }
  // await exp.delete();
  res.status(200).json({ message: "Expierience deleted success" });
});

router.post("/:userId/experience", async (req, res) => {
  try {
    req.body.UserId = req.user._id;

    if (req.body.isCurrentRole) {
      req.body.EndDate = null;
    }
    const experience = await Expierience.create(req.body);

    res.status(201).json(experience);
  } catch (error) {
    //console.log(error);
    res.status(500).json(error);
  }
});

//education routes here------------------------

router.post(":userId/education", async (req, res) => {
  try {
    req.body.UserId = req.user._id;
    // if (req.body.isCurrentRole) {
    //   req.body.EndDate = null;
    // }
    const education = await Education.create(req.body);

    res.status(201).json(education);
  } catch (error) {
    //console.log(error);
    res.status(500).json(error);
  }
});

router.get("/:userid/education", async (req, res) => {
  try {
    const user = await User.findById(req.params.userid);

    if (!user) {
      res.status(500).json({ error: "User does not exist" });
    }
    const education = await Education.find({
      UserId: req.params.userid,
    });
    res.status(200).json({ education });
  } catch (error) {
    //console.log(error);
    res.status(500).json(error);
  }
});

router.put("/:userId/education/:eduId", async (req, res) => {
  const education = await Education.findById(req.params.eduId);

  //verify user is the owner of this edu
  if (!education.UserId == req.user._id) {
    res.status(500).json({ error: "You are not allowed to do that " });
  } else {
    await Education.findByIdAndUpdate(req.params.eduId, req.body);
  }
  res.status(200).json({ message: "education updated" });
});

router.delete("/:userId/education/:eduId", async (req, res) => {
  const education = await Education.findById(req.params.eduId);
  if (!education.UserId == req.user._id) {
    res.status(500).json({ error: "only owner can do this " });
  }

  const deletedEducation = await Education.findByIdAndDelete(req.params.eduId);

  // await education.delete();
  res.status(200).json({ message: "education deleted success" });
});

//project routes here------------------------

router.post("/:userId/project", async (req, res) => {
  try {
    req.body.userId = req.user._id;

    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:userId/project", async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id });

    res.status(201).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
});

router.put("/:userId/project/:proId", async (req, res) => {
  const project = await Project.findById(req.params.proId);

  if (!project.userId == req.user._id) {
    res.status(500).json({ error: "You are not allowed to do that " });
  } else {
    await Project.findByIdAndUpdate(req.params.proId, req.body);
  }
  res.status(200).json({ message: "project updated" });
});

router.delete("/:userId/project/:proId", async (req, res) => {
  const project = await Project.findById(req.params.proId);

  if (!project.userId == req.user._id) {
    res.status(500).json({ error: "only owner can do this " });
  }

  const deletesproject = await Project.findByIdAndDelete(req.params.proId);

  // await education.delete();
  res.status(200).json({ message: "project deleted success" });
});

//post routes here

router.post("/:userId/post", async (req, res) => {
  try {
    req.body.userId = req.user._id;

    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:userId/post", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user._id });

    res.status(201).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
});

router.put("/:userId/post/:postId", async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post.userId == req.user._id) {
    res.status(500).json({ error: "You are not allowed to do that " });
  } else {
    await Post.findByIdAndUpdate(req.params.postId, req.body);
  }
  res.status(200).json({ message: "post updated" });
});

router.delete("/:userId/post/:postId", async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post.userId == req.user._id) {
    res.status(500).json({ error: "only owner can do this " });
  }

  const deletesproject = await Post.findByIdAndDelete(req.params.postId);

  // await education.delete();
  res.status(200).json({ message: "post deleted success" });
});

//comments routes here---------------------------

router.get("/:userId/post/:postId/comment", async (req, res) => {
  try {
    const currentPost = await Post.findById(req.params.postId);
    res.status(201).json(currentPost.comments);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/:userId/post/:postId/comment", async (req, res) => {
  try {
    req.body.userId = req.user._id;
    const currentPost = await Post.findById(req.params.postId);
    await currentPost.comments.push(req.body);
    currentPost.save();
    res.status(201).json(currentPost.comments[currentPost.comments.length - 1]);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:userId/post/:postId/comment/:commentId", async (req, res) => {
  try {
    const currentPost = await Post.findById(req.params.postId);

    currentPost.comments = currentPost.comments.filter((comment) => {
      return comment.id !== req.params.commentId;
    });

    currentPost.save();

    res.status(200).json(currentPost.comments);
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
});

module.exports = router;
