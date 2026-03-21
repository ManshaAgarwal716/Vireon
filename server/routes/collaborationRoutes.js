const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  sendRequest,
  getIncomingRequests,
  getOutgoingRequests,
  respondToRequest,
} = require("../controllers/collaborationController");

router.post("/", protect, sendRequest);

router.get("/incoming", protect, getIncomingRequests);

router.get("/outgoing", protect, getOutgoingRequests);

router.patch("/:id/respond", protect, respondToRequest);

module.exports = router;

