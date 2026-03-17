const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    techStack: [{ type: String, trim: true }],

    githubLink: {
      type: String,
      trim: true,
      default: "",
    },

    tags: [{ type: String, trim: true }],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    aiAnalysis: {
      score: { type: Number, default: null },
      suggestions: [{ type: String }],
      improvements: [{ type: String }],
      model: { type: String, default: "" },
      analyzedAt: { type: Date, default: null },
      error: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);