const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  getMyProjects,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createProject);
router.get("/", getProjects);
router.get("/mine", protect, getMyProjects);
router.get("/:id", getProjectById);

module.exports = router;