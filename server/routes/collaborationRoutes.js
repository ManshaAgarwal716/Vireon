const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  sendRequest,
  getIncomingRequests,
  getOutgoingRequests,
  respondToRequest,
} = require("../controllers/collaborationController");

// Send a collaboration request for a project
router.post("/", protect, sendRequest);

// Owner: requests received on their projects
router.get("/incoming", protect, getIncomingRequests);

// Requester: requests they sent
router.get("/outgoing", protect, getOutgoingRequests);

// Owner: accept/reject
router.patch("/:id/respond", protect, respondToRequest);

module.exports = router;

