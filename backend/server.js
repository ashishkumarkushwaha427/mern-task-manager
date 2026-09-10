const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});