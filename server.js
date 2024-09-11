const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const profilesRouter = require("./controllers/profile");

const followerRouter = require("./controllers/follower");
const conversationRouter = require("./controllers/conversation");
const messageRouter = require("./controllers/message");
const companyRouter = require("./controllers/company.js");
require("./config/database.js");
const morgan = require("morgan");
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const usersRouter = require("./controllers/users");
const uploadImage = require("./uploadImage.js");
const app = express();
const server = http.createServer(app);
app.use(morgan("dev"));
const PORT = process.env.PORT || 3000;
app.use(express.json());

// Routes
app.use(cors());

app.use("/users", usersRouter);
app.use("/profiles", profilesRouter);
app.use("/follower", followerRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);
app.use("/company", companyRouter);
//app.use("/expierience", expierienceRouter);

app.post("/upload", async (req, res) => {
  uploadImage(req.body.image)
    .then((url) => {
      res.status(200).json({ url });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let users = [];

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendData", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getData", { senderId, text });
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(PORT, () => {
  console.log("The express app is ready!");
});
