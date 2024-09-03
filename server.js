const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
// at the top, with other imports
const profilesRouter = require("./controllers/profile");

require("./config/database.js");
const morgan = require("morgan");
const express = require("express");

const usersRouter = require("./controllers/users");
const app = express();
app.use(morgan("dev"));
const PORT = process.env.PORT || 3000;
app.use(express.json());

// Routes
app.use(cors());

app.use("/users", usersRouter);
app.use("/profiles", profilesRouter);
app.listen(PORT, () => {
  console.log("The express app is ready!");
});
