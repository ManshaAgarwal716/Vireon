const CollaborationRequest = require("../models/CollaborationRequest");
const Project = require("../models/Project");

exports.sendRequest = async (req, res) => {
  try {
    const { projectId, message } = req.body;
    if (!projectId) return res.status(400).json({ message: "projectId is required" });

    const project = await Project.findById(projectId).select("user collaborators");
    if (!project) return res.status(404).json({ message: "Project not found" });

    const ownerId = project.user?.toString();
    const requesterId = req.user._id.toString();

    if (ownerId === requesterId) {
      return res.status(400).json({ message: "You cannot request collaboration on your own project" });
    }

    if (Array.isArray(project.collaborators) && project.collaborators.some((id) => id.toString() === requesterId)) {
      return res.status(400).json({ message: "You are already a collaborator on this project" });
    }

    const existing = await CollaborationRequest.findOne({
      project: projectId,
      requester: req.user._id,
      status: "pending",
    });
    if (existing) return res.status(409).json({ message: "Request already pending" });

    const request = await CollaborationRequest.create({
      project: projectId,
      requester: req.user._id,
      owner: project.user,
      message: message || "",
      status: "pending",
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIncomingRequests = async (req, res) => {
  try {
    const requests = await CollaborationRequest.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .populate("project", "title")
      .populate("requester", "name email");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOutgoingRequests = async (req, res) => {
  try {
    const requests = await CollaborationRequest.find({ requester: req.user._id })
      .sort({ createdAt: -1 })
      .populate("project", "title")
      .populate("owner", "name email");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    const { action } = req.body; // "accept" | "reject"
    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({ message: "action must be 'accept' or 'reject'" });
    }

    const request = await CollaborationRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (request.status !== "pending") {
      return res.status(409).json({ message: `Request already ${request.status}` });
    }

    request.status = action === "accept" ? "accepted" : "rejected";
    await request.save();

    if (request.status === "accepted") {
      await Project.findByIdAndUpdate(
        request.project,
        { $addToSet: { collaborators: request.requester } },
        { new: true }
      );
    }

    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

