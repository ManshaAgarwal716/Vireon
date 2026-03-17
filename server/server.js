require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const collaborationRoutes = require("./routes/collaborationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/collaboration-requests", collaborationRoutes);
console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running on port 3000");
      console.log("MongoDB connection successfully established");
    });
  })
  .catch((err) => console.log(err));