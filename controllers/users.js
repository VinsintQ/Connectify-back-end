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
const user = require("../models/user");

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
      image: req.body.image,
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

router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.use(verifyToken);
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

router.put("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user._id !== req.params.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true } // This option returns the updated document
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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

router.get("/:userId/experience/:expId", async (req, res) => {
  try {
    const exp = await Expierience.findById(req.params.expId);

    res.status(200).json(exp);
  } catch (error) {
    //console.log(error);
    res.status(500).json(error);
  }
});

router.get("/:userId/experience", async (req, res) => {
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
  await Expierience.findByIdAndUpdate(req.params.expId, req.body);
  res.status(200).json({ message: "Expierience updated" });
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
  console.log(req.body);
  try {
    req.body.UserId = req.user._id;

    if (req.body.EndDate == null) {
      req.body.isCurrentRole = false;
    }
    const experience = await Expierience.create(req.body);
    console.log(experience);
    res.status(201).json(experience);
  } catch (error) {
    //console.log(error);
    res.status(500).json(error);
  }
});

//education routes here------------------------

router.post("/:userId/education", async (req, res) => {
  try {
    req.body.UserId = req.user._id;

    const education = await Education.create(req.body);

    res.status(201).json(education);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});
router.get("/:userId/education/:eduId", async (req, res) => {
  try {
    const edu = await Education.findById(req.params.eduId);

    res.status(200).json(edu);
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
    req.body.userId = req.params.userId;

    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:userId/project/:proId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.proId);

    res.status(200).json(project);
  } catch (error) {
    //console.log(error);
    res.status(500).json(error);
  }
});

router.get("/:userId/project", async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.params.userId });

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
router.get("/:userid/allposts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: "desc" });

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

router.get("/:userId/post/:postId/", async (req, res) => {
  try {
    const currentPost = await Post.findById(req.params.postId)
      .populate({
        path: "comments.userid",
        select: "username image",
      })
      .populate({
        path: "userId",
        select: "username image",
      });

    res.status(201).json(currentPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/:userId/post/:postId/comment", async (req, res) => {
  try {
    req.body.userId = req.user._id;
    const currentPost = await Post.findById(req.params.postId);
    req.body.userid = req.user._id;
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

//users skills routes
router.post("/:userId/skill", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.params.userId !== req.user._id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    user.Skills.push(req.body);

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:userId/skill/:skillId", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.Skills = user.Skills.filter((skill) => {
      return skill.id !== req.params.skillId;
    });

    user.save();

    res.status(200).json(user.Skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:userId/skill", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    const skills = user.Skills;

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// project tools routes
router.post("/:userId/project/:projectId/tools", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const project = await Project.findById(req.params.projectId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!project) {
      return res.status(404).json({ error: "project not found" });
    }

    await project.tools.push(req.body);
    project.save();
    res.status(200).json(project.tools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:userId/project/:projectId/tools", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    const tools = project.tools;

    res.status(200).json(tools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:userId/project/:projectId/tools/:toolId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    project.tools = project.tools.filter((tool) => {
      return tool.id !== req.params.toolId;
    });

    project.save();

    res.status(200).json(project.tools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//like  a post route

router.get("/:userId/post/:postId/like", async (req, res) => {
  try {
    const currentPost = await Post.findById(req.params.postId);
    res.status(201).json(currentPost.like);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/:userId/post/:postId/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    likes = post.like;
    const hasLiked = likes.some((like) => like.userid == req.user._id);
    if (hasLiked) {
      return res
        .status(400)
        .json({ error: "You have already liked this post" });
    }

    req.body.userid = req.user._id;
    post.like.push(req.body);

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:userId/post/:postId/like/:likeId", async (req, res) => {
  try {
    const currentPost = await Post.findById(req.params.postId);

    currentPost.like = currentPost.like.filter((like) => {
      return like.id !== req.params.likeId;
    });
    currentPost.save();

    res.status(200).json(currentPost.like);
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
});

//dislike a post route

router.get("/:userId/post/:postId/dislike", async (req, res) => {
  try {
    const currentPost = await Post.findById(req.params.postId);
    res.status(201).json(currentPost.disLike);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/:userId/post/:postId/dislike", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    dislikes = post.disLike;
    const hasdisLiked = dislikes.some(
      (dislike) => dislike.userid == req.user._id
    );
    if (hasdisLiked) {
      return res
        .status(400)
        .json({ error: "You have already liked this post" });
    }

    req.body.userid = req.user._id;
    post.disLike.push(req.body);

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:userId/post/:postId/dislike/:dislikeId", async (req, res) => {
  try {
    const currentPost = await Post.findById(req.params.postId);

    currentPost.disLike = currentPost.disLike.filter((disLike) => {
      return disLike.id !== req.params.dislikeId;
    });
    currentPost.save();

    res.status(200).json(currentPost.disLike);
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
});

module.exports = router;
