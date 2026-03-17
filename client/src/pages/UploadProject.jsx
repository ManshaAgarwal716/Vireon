import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { http } from "../api/http";
import { getToken } from "../auth/storage";

function splitCsv(value) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function UploadProject() {
  const navigate = useNavigate();
  const token = useMemo(() => getToken(), []);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const disabled = submitting || !title.trim() || !description.trim();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      const res = await http.post("/api/projects", {
        title: title.trim(),
        description: description.trim(),
        techStack: splitCsv(techStack),
        githubLink: githubLink.trim(),
        tags: splitCsv(tags),
      });
      navigate(`/projects/${res.data?._id}`);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Upload a project</h2>
          <p className="mt-2 text-sm text-[#8FA89E]">
            Add a clean description and stack so others can understand quickly.
          </p>
        </div>
      </div>

      {!token ? (
        <div className="mt-8 rounded-2xl border border-[#1F2A24] bg-[#111A16] p-6">
          <p className="text-sm text-[#8FA89E]">
            You’ll need to log in before uploading a project.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2.5 text-sm btn-primary transition"
          >
            Go to login
          </button>
        </div>
      ) : (
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-8 glass card p-6 sm:p-8 space-y-5"
        >
          {error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div>
            <label className="block text-sm mb-2 text-[#8FA89E]">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full input-saas"
              placeholder="e.g. Collab Kanban for dev teams"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-[#8FA89E]">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full input-saas resize-none"
              placeholder="What problem does it solve? What’s unique?"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm mb-2 text-[#8FA89E]">
                Tech stack (comma-separated)
              </label>
              <input
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full input-saas"
                placeholder="React, Node, MongoDB"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-[#8FA89E]">
                Tags (comma-separated)
              </label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full input-saas"
                placeholder="collaboration, open-source"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 text-[#8FA89E]">GitHub link</label>
            <input
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              className="w-full input-saas"
              placeholder="https://github.com/you/repo"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2.5 text-sm font-semibold text-[#8FA89E] btn-secondary transition"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              disabled={disabled}
              className="px-4 py-2.5 text-sm btn-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Uploading…" : "Upload project"}
            </motion.button>
          </div>
        </motion.form>
      )}
    </div>
  );
}

