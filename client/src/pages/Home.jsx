import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import { http } from "../api/http";

function splitCsv(value) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [rawProjects, setRawProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [techFilter, setTechFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const debounceRef = useRef(null);

  const hasProjects = useMemo(() => projects.length > 0, [projects.length]);

  const filteredProjects = useMemo(() => {
    const s = search.trim().toLowerCase();
    const tech = splitCsv(techFilter).map((x) => x.toLowerCase());
    const tags = splitCsv(tagFilter).map((x) => x.toLowerCase());

    return rawProjects.filter((p) => {
      if (s && !(p?.title || "").toLowerCase().includes(s)) return false;

      if (tech.length) {
        const stack = (p?.techStack || []).map((x) => String(x).toLowerCase());
        const ok = tech.some((t) => stack.includes(t));
        if (!ok) return false;
      }

      if (tags.length) {
        const ptags = (p?.tags || []).map((x) => String(x).toLowerCase());
        const ok = tags.some((t) => ptags.includes(t));
        if (!ok) return false;
      }

      return true;
    });
  }, [rawProjects, search, techFilter, tagFilter]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    http
      .get("/api/projects")
      .then((res) => {
        if (!alive) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setRawProjects(list);
        setProjects(list);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.response?.data?.message || e.message || "Failed to load projects");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setProjects(filteredProjects);
  }, [filteredProjects]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (techFilter.trim()) params.tech = techFilter.trim();
      if (tagFilter.trim()) params.tags = tagFilter.trim();

      setLoading(true);
      setError("");
      http
        .get("/api/projects", { params })
        .then((res) => {
          const list = Array.isArray(res.data) ? res.data : [];
          setRawProjects(list);
        })
        .catch((e) => {
          setError(e?.response?.data?.message || e.message || "Failed to load projects");
        })
        .finally(() => setLoading(false));
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, techFilter, tagFilter]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Project feed</h2>
          <p className="mt-2 text-sm text-[#8FA89E]">
            Discover what others are building. Upload yours when you’re ready.
          </p>
        </div>
        <Link
          to="/projects/new"
          className="shrink-0 px-4 py-2.5 text-sm btn-primary transition"
        >
          Upload project
        </Link>
      </div>

      <div className="mt-8 glass card p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm mb-2 text-[#8FA89E]">Search by title</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full input-saas"
              placeholder="e.g. Kanban, Portfolio, Chat app"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-[#8FA89E]">Filter by tech stack</label>
            <input
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              className="w-full input-saas"
              placeholder="React, Node, MongoDB"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-[#8FA89E]">Filter by tags</label>
            <input
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="w-full input-saas"
              placeholder="open-source, collaboration"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#8FA89E]">
            Showing <span className="text-[#E6F4EA] font-semibold">{projects.length}</span>{" "}
            project{projects.length === 1 ? "" : "s"}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setTechFilter("");
              setTagFilter("");
            }}
            className="px-4 py-2.5 text-sm font-semibold text-[#8FA89E] btn-secondary transition"
          >
            Clear filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-[180px] rounded-2xl border border-[#1F2A24] skeleton"
            />
          ))}
        </div>
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
          {error}
        </div>
      ) : !hasProjects ? (
        <div className="mt-10 rounded-2xl border border-[#1F2A24] bg-[#111A16] p-8">
          <h3 className="text-lg font-semibold">No projects yet</h3>
          <p className="mt-2 text-sm text-[#8FA89E]">
            Be the first to upload a project to the feed.
          </p>
          <div className="mt-5">
            <Link
              to="/projects/new"
              className="inline-flex rounded-xl bg-[#16C47F] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#00FFB2] transition"
            >
              Upload your first project
            </Link>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((p, idx) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: Math.min(idx * 0.03, 0.25) }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

