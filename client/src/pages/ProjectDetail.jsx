import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { http } from "../api/http";
import { getToken, getUser } from "../auth/storage";

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#1F2A24] bg-[#0B1210] px-2.5 py-1 text-xs text-[#8FA89E]">
      {children}
    </span>
  );
}

function ScoreBadge({ score }) {
  const s = typeof score === "number" ? score : null;
  if (s === null) return null;
  const tone =
    s >= 80 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" :
    s >= 60 ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-200" :
    "border-red-500/30 bg-red-500/10 text-red-200";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${tone}`}>
      {s}/100
    </span>
  );
}

function ProgressBar({ value }) {
  const v = typeof value === "number" ? Math.max(0, Math.min(100, value)) : 0;
  return (
    <div className="h-2 w-full rounded-full bg-[#0B1210] border border-[#1F2A24] overflow-hidden">
      <div
        className="h-full rounded-full bg-[#16C47F]"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = useMemo(() => getToken(), []);
  const me = useMemo(() => getUser(), []);
  const [reqStatus, setReqStatus] = useState(null); // pending | accepted | rejected | null
  const [reqError, setReqError] = useState("");
  const [reqMessage, setReqMessage] = useState("");
  const [reqBusy, setReqBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    http
      .get(`/api/projects/${id}`)
      .then((res) => {
        if (!alive) return;
        setProject(res.data || null);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.response?.data?.message || e.message || "Failed to load project");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    let alive = true;
    if (!token) return;
    if (!id) return;

    http
      .get("/api/collaboration-requests/outgoing")
      .then((res) => {
        if (!alive) return;
        const list = Array.isArray(res.data) ? res.data : [];
        const match = list.find((r) => r?.project?._id === id);
        setReqStatus(match?.status || null);
      })
      .catch(() => {
        if (!alive) return;
        // keep it silent; the request box will still work
        setReqStatus(null);
      });

    return () => {
      alive = false;
    };
  }, [id, token]);

  const isOwner = useMemo(() => {
    const myId = me?.id || me?._id;
    const ownerId = project?.user?._id || project?.user?.id || project?.user;
    if (!myId || !ownerId) return false;
    return myId.toString() === ownerId.toString();
  }, [me, project]);

  async function sendCollabRequest() {
    setReqError("");
    if (!token) {
      setReqError("Please log in to request collaboration.");
      return;
    }
    try {
      setReqBusy(true);
      const res = await http.post("/api/collaboration-requests", {
        projectId: id,
        message: reqMessage.trim(),
      });
      setReqStatus(res.data?.status || "pending");
      setReqMessage("");
    } catch (e) {
      setReqError(e?.response?.data?.message || e.message || "Failed to send request");
    } finally {
      setReqBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/"
          className="text-sm text-[#8FA89E] hover:text-[#E6F4EA] transition"
        >
          ← Back to feed
        </Link>
        <Link
          to="/projects/new"
          className="rounded-xl bg-[#16C47F] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#00FFB2] transition"
        >
          Upload project
        </Link>
      </div>

      {loading ? (
        <div className="mt-8 h-[260px] rounded-2xl border border-[#1F2A24] skeleton" />
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
          {error}
        </div>
      ) : !project ? (
        <div className="mt-8 rounded-2xl border border-[#1F2A24] bg-[#111A16] p-8">
          <h2 className="text-xl font-semibold">Project not found</h2>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-[#1F2A24] bg-[#111A16] p-6 sm:p-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {project.title}
                </h1>
                {project?.user?.name || project?.user?.email ? (
                  <p className="mt-2 text-sm text-[#8FA89E]">
                    by {project.user.name || project.user.email}
                  </p>
                ) : null}
                {project?.createdAt ? (
                  <p className="mt-1 text-xs text-[#8FA89E]">
                    Posted {new Date(project.createdAt).toLocaleString()}
                  </p>
                ) : null}
              </div>

              {project.githubLink ? (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-[#1F2A24] bg-[#0B1210] px-4 py-2.5 text-sm font-semibold text-[#E6F4EA] hover:bg-[#111A16] transition"
                >
                  View on GitHub
                </a>
              ) : null}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-[#8FA89E] whitespace-pre-line">
              {project.description}
            </p>

            {(project.techStack?.length > 0 || project.tags?.length > 0) && (
              <div className="mt-6 flex flex-wrap gap-2">
                {(project.techStack || []).map((t) => (
                  <Chip key={`tech-${t}`}>{t}</Chip>
                ))}
                {(project.tags || []).map((t) => (
                  <Chip key={`tag-${t}`}>#{t}</Chip>
                ))}
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-[#1F2A24] bg-[#0B1210] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">AI Review</h3>
                  <p className="mt-1 text-sm text-[#8FA89E]">
                    Feedback on description clarity and stack relevance.
                  </p>
                </div>
                <ScoreBadge score={project?.aiAnalysis?.score ?? null} />
              </div>

              {typeof project?.aiAnalysis?.score === "number" ? (
                <div className="mt-4 space-y-3">
                  <ProgressBar value={project.aiAnalysis.score} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold">Suggestions</p>
                      <ul className="mt-2 space-y-2 text-sm text-[#8FA89E] list-disc pl-5">
                        {(project.aiAnalysis.suggestions || []).slice(0, 6).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                        {(project.aiAnalysis.suggestions || []).length === 0 ? (
                          <li>Looks good — no suggestions returned.</li>
                        ) : null}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Improvements</p>
                      <ul className="mt-2 space-y-2 text-sm text-[#8FA89E] list-disc pl-5">
                        {(project.aiAnalysis.improvements || []).slice(0, 6).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                        {(project.aiAnalysis.improvements || []).length === 0 ? (
                          <li>No improvements returned.</li>
                        ) : null}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : project?.aiAnalysis?.error ? (
                <div className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-100">
                  AI analysis unavailable: {project.aiAnalysis.error}
                </div>
              ) : (
                <div className="mt-4 text-sm text-[#8FA89E]">
                  AI analysis hasn’t been generated yet for this project.
                </div>
              )}
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="rounded-2xl border border-[#1F2A24] bg-[#111A16] p-6 h-fit"
          >
            <h3 className="text-lg font-semibold">Collaboration</h3>
            <p className="mt-2 text-sm text-[#8FA89E]">
              Request to collaborate with the project owner.
            </p>

            {!token ? (
              <div className="mt-4">
                <Link
                  to="/login"
                  className="inline-flex w-full justify-center rounded-xl bg-[#16C47F] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#00FFB2] transition"
                >
                  Log in to request
                </Link>
              </div>
            ) : isOwner ? (
              <div className="mt-4 rounded-xl border border-[#1F2A24] bg-[#0B1210] p-4 text-sm text-[#8FA89E]">
                You own this project. Manage requests from the{" "}
                <Link to="/requests" className="text-[#16C47F] hover:text-[#00FFB2] transition">
                  Requests
                </Link>{" "}
                page.
              </div>
            ) : reqStatus ? (
              <div className="mt-4 rounded-xl border border-[#1F2A24] bg-[#0B1210] p-4">
                <p className="text-sm text-[#8FA89E]">
                  Status:{" "}
                  <span className="font-semibold text-[#E6F4EA]">{reqStatus}</span>
                </p>
                <p className="mt-2 text-xs text-[#8FA89E]">
                  You can track all your requests on the{" "}
                  <Link to="/requests" className="text-[#16C47F] hover:text-[#00FFB2] transition">
                    Requests
                  </Link>{" "}
                  page.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {reqError ? (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                    {reqError}
                  </div>
                ) : null}
                <div>
                  <label className="block text-sm mb-2 text-[#8FA89E]">
                    Message (optional)
                  </label>
                  <textarea
                    value={reqMessage}
                    onChange={(e) => setReqMessage(e.target.value)}
                    rows={4}
                    className="w-full p-3 rounded-lg bg-[#0B1210] border border-[#1F2A24] focus:outline-none focus:border-[#16C47F] resize-none"
                    placeholder="Tell the owner why you’d like to collaborate…"
                  />
                </div>
                <motion.button
                  type="button"
                  onClick={sendCollabRequest}
                  whileHover={{ scale: reqBusy ? 1 : 1.02 }}
                  whileTap={{ scale: reqBusy ? 1 : 0.98 }}
                  disabled={reqBusy}
                  className="w-full rounded-xl bg-[#16C47F] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#00FFB2] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {reqBusy ? "Sending…" : "Request to collaborate"}
                </motion.button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </div>
  );
}

