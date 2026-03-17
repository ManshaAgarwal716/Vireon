const Project = require("../models/Project");
const { analyzeProject } = require("../services/aiAnalysis");

function parseList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean);
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubLink, tags } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "title and description are required" });
    }

    const project = await Project.create({
      title,
      description,
      techStack: Array.isArray(techStack) ? techStack : [],
      githubLink: githubLink || "",
      tags: Array.isArray(tags) ? tags : [],
      user: req.user._id,
    });

    try {
      const analysis = await analyzeProject({
        title: project.title,
        description: project.description,
        techStack: project.techStack,
        tags: project.tags,
        githubLink: project.githubLink,
      });
      project.aiAnalysis = analysis;
      await project.save();
    } catch (aiError) {
      project.aiAnalysis = {
        score: null,
        suggestions: [],
        improvements: [],
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        analyzedAt: new Date(),
        error: aiError?.message || "AI analysis failed",
      };
      await project.save().catch(() => {});
    }

    res.status(201).json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const { search, title, tech, techStack, tags } = req.query;

    const query = {};

    const titleQuery = (search || title || "").toString().trim();
    if (titleQuery) {
      query.title = { $regex: titleQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    }

    const techList = parseList(tech || techStack);
    if (techList.length) {
      query.techStack = { $in: techList };
    }

    const tagList = parseList(tags);
    if (tagList.length) {
      query.tags = { $in: tagList };
    }

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.json(projects);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("user", "name email");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: "Invalid project id" });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("user", "name email");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, getMyProjects };