import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { http } from "../api/http";
import { getToken, getUser } from "../auth/storage";

function ScorePill({ score }) {
  const s = typeof score === "number" ? score : null;
  if (s === null) return null;
  const tone =
    s >= 80 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" :
    s >= 60 ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-200" :
    "border-red-500/30 bg-red-500/10 text-red-200";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${tone}`}>
      AI {s}/100
    </span>
  );
}

function Card({ children }) {
  return (
    <div className="glass card p-6">
      {children}
    </div>
  );
}

export default function Dashboard() {
  const token = useMemo(() => getToken(), []);
  const user = useMemo(() => getUser(), []);

  const [myProjects, setMyProjects] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let alive = true;
    setLoading(true);
    setError("");

    Promise.all([
      http.get("/api/projects/mine"),
      http.get("/api/collaboration-requests/incoming"),
      http.get("/api/collaboration-requests/outgoing"),
    ])
      .then(([p, inc, out]) => {
        if (!alive) return;
        setMyProjects(Array.isArray(p.data) ? p.data : []);
        setIncoming(Array.isArray(inc.data) ? inc.data : []);
        setOutgoing(Array.isArray(out.data) ? out.data : []);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.response?.data?.message || e.message || "Failed to load dashboard");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [token]);

  if (!token) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10">
        <Card>
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p className="mt-2 text-sm text-[#8FA89E]">
            Please log in to view your dashboard.
          </p>
          <Link
            to="/login"
            className="mt-5 inline-flex px-4 py-2.5 text-sm btn-primary transition"
          >
            Go to login
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Dashboard</h2>
          <p className="mt-2 text-sm text-[#8FA89E]">
            Welcome{user?.name ? `, ${user.name}` : ""}. Here’s what’s happening with your projects.
          </p>
        </div>
        <Link
          to="/projects/new"
          className="shrink-0 px-4 py-2.5 text-sm btn-primary transition"
        >
          Upload project
        </Link>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[220px] rounded-2xl border border-[#1F2A24] skeleton" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
          {error}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-8 grid gap-5 lg:grid-cols-3"
        >
          <Card>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">My projects</h3>
              <span className="text-xs text-[#8FA89E]">{myProjects.length}</span>
            </div>
            {myProjects.length === 0 ? (
              <p className="mt-3 text-sm text-[#8FA89E]">
                You haven’t uploaded any projects yet.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {myProjects.slice(0, 5).map((p) => (
                  <Link
                    key={p._id}
                    to={`/projects/${p._id}`}
                    className="block rounded-xl border border-[#1F2A24] bg-[#0B1210]/60 backdrop-blur-md p-3 hover:bg-[#111A16]/50 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold truncate">{p.title}</p>
                      <ScorePill score={p?.aiAnalysis?.score ?? null} />
                    </div>
                    <p className="mt-1 text-xs text-[#8FA89E]">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
                {myProjects.length > 5 ? (
                  <p className="text-xs text-[#8FA89E]">+{myProjects.length - 5} more</p>
                ) : null}
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">Collaboration</h3>
              <Link
                to="/requests"
                className="text-sm font-medium text-[#16C47F] hover:text-[#00FFB2] transition"
              >
                Manage →
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#1F2A24] bg-[#0B1210] p-4">
                <p className="text-xs text-[#8FA89E]">Incoming</p>
                <p className="mt-2 text-2xl font-bold">{incoming.filter((r) => r.status === "pending").length}</p>
                <p className="mt-1 text-xs text-[#8FA89E]">pending</p>
              </div>
              <div className="rounded-xl border border-[#1F2A24] bg-[#0B1210] p-4">
                <p className="text-xs text-[#8FA89E]">Outgoing</p>
                <p className="mt-2 text-2xl font-bold">{outgoing.filter((r) => r.status === "pending").length}</p>
                <p className="mt-1 text-xs text-[#8FA89E]">pending</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-[#8FA89E]">
              <p>
                Accepted:{" "}
                <span className="text-[#E6F4EA] font-semibold">
                  {incoming.filter((r) => r.status === "accepted").length}
                </span>
              </p>
              <p>
                Rejected:{" "}
                <span className="text-[#E6F4EA] font-semibold">
                  {incoming.filter((r) => r.status === "rejected").length}
                </span>
              </p>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">AI insights</h3>
              <span className="text-xs text-[#8FA89E]">top items</span>
            </div>

            {myProjects.length === 0 ? (
              <p className="mt-3 text-sm text-[#8FA89E]">
                Upload projects to see AI feedback here.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {myProjects.slice(0, 3).map((p) => {
                  const score = p?.aiAnalysis?.score;
                  const suggestions = (p?.aiAnalysis?.suggestions || []).slice(0, 2);
                  const improvements = (p?.aiAnalysis?.improvements || []).slice(0, 2);
                  const err = p?.aiAnalysis?.error;
                  return (
                    <div key={p._id} className="rounded-xl border border-[#1F2A24] bg-[#0B1210]/60 backdrop-blur-md p-4">
                      <div className="flex items-start justify-between gap-3">
                        <Link to={`/projects/${p._id}`} className="font-semibold hover:text-white transition truncate">
                          {p.title}
                        </Link>
                        <ScorePill score={typeof score === "number" ? score : null} />
                      </div>

                      {err && typeof score !== "number" ? (
                        <p className="mt-2 text-xs text-yellow-100">
                          AI unavailable: {err}
                        </p>
                      ) : (
                        <>
                          {suggestions.length > 0 ? (
                            <ul className="mt-2 text-sm text-[#8FA89E] list-disc pl-5 space-y-1">
                              {suggestions.map((s, i) => (
                                <li key={`s-${i}`}>{s}</li>
                              ))}
                            </ul>
                          ) : null}
                          {improvements.length > 0 ? (
                            <ul className="mt-2 text-sm text-[#8FA89E] list-disc pl-5 space-y-1">
                              {improvements.map((s, i) => (
                                <li key={`i-${i}`}>{s}</li>
                              ))}
                            </ul>
                          ) : null}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  );
}

