import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { http } from "../api/http";
import { getToken } from "../auth/storage";
import { Link } from "react-router-dom";

function Pill({ children, tone = "neutral" }) {
  const cls =
    tone === "good"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
      : tone === "bad"
        ? "border-red-500/30 bg-red-500/10 text-red-200"
        : tone === "warn"
          ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-200"
          : "border-[#1F2A24] bg-[#0B1210] text-[#8FA89E]";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${cls}`}>
      {children}
    </span>
  );
}

function statusTone(status) {
  if (status === "accepted") return "good";
  if (status === "rejected") return "bad";
  return "warn";
}

export default function CollaborationRequests() {
  const token = useMemo(() => getToken(), []);
  const [tab, setTab] = useState("incoming"); // incoming | outgoing
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const activeList = tab === "incoming" ? incoming : outgoing;

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [inc, out] = await Promise.all([
        http.get("/api/collaboration-requests/incoming"),
        http.get("/api/collaboration-requests/outgoing"),
      ]);
      setIncoming(Array.isArray(inc.data) ? inc.data : []);
      setOutgoing(Array.isArray(out.data) ? out.data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function respond(id, action) {
    setBusyId(id);
    setError("");
    try {
      await http.patch(`/api/collaboration-requests/${id}/respond`, { action });
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to update request");
    } finally {
      setBusyId(null);
    }
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-10">
        <div className="rounded-2xl border border-[#1F2A24] bg-[#111A16] p-8">
          <h2 className="text-xl font-semibold">Requests</h2>
          <p className="mt-2 text-sm text-[#8FA89E]">
            Please log in to view collaboration requests.
          </p>
          <Link
            to="/login"
            className="mt-5 inline-flex rounded-xl bg-[#16C47F] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#00FFB2] transition"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Collaboration requests</h2>
          <p className="mt-2 text-sm text-[#8FA89E]">
            Manage incoming requests on your projects or track the ones you sent.
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTab("incoming")}
          className={[
            "rounded-xl px-4 py-2.5 text-sm font-semibold transition border",
            tab === "incoming"
              ? "bg-[#16C47F] text-black border-transparent"
              : "border-[#1F2A24] text-[#8FA89E] hover:text-[#E6F4EA] hover:bg-[#0B1210]",
          ].join(" ")}
        >
          Incoming
        </button>
        <button
          type="button"
          onClick={() => setTab("outgoing")}
          className={[
            "rounded-xl px-4 py-2.5 text-sm font-semibold transition border",
            tab === "outgoing"
              ? "bg-[#16C47F] text-black border-transparent"
              : "border-[#1F2A24] text-[#8FA89E] hover:text-[#E6F4EA] hover:bg-[#0B1210]",
          ].join(" ")}
        >
          Outgoing
        </button>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[84px] rounded-2xl border border-[#1F2A24] skeleton"
            />
          ))}
        </div>
      ) : activeList.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[#1F2A24] bg-[#111A16] p-8">
          <h3 className="text-lg font-semibold">No {tab} requests</h3>
          <p className="mt-2 text-sm text-[#8FA89E]">
            {tab === "incoming"
              ? "When someone requests to collaborate on your projects, it’ll show up here."
              : "Requests you send will show up here so you can track them."}
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-6 space-y-3"
        >
          {activeList.map((r) => (
            <div
              key={r._id}
              className="rounded-2xl border border-[#1F2A24] bg-[#111A16] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={r?.project?._id ? `/projects/${r.project._id}` : "#"}
                    className="font-semibold hover:text-white transition"
                  >
                    {r?.project?.title || "Project"}
                  </Link>
                  <Pill tone={statusTone(r.status)}>{r.status}</Pill>
                </div>

                <p className="mt-2 text-sm text-[#8FA89E]">
                  {tab === "incoming"
                    ? `From ${r?.requester?.name || r?.requester?.email || "user"}`
                    : `To ${r?.owner?.name || r?.owner?.email || "owner"}`}
                </p>

                {r.message ? (
                  <p className="mt-2 text-sm text-[#8FA89E] line-clamp-2">
                    “{r.message}”
                  </p>
                ) : null}
              </div>

              {tab === "incoming" && r.status === "pending" ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={busyId === r._id}
                    onClick={() => respond(r._id, "reject")}
                    className="rounded-xl border border-[#1F2A24] px-4 py-2.5 text-sm font-semibold text-[#8FA89E] hover:text-[#E6F4EA] hover:bg-[#0B1210] transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    disabled={busyId === r._id}
                    onClick={() => respond(r._id, "accept")}
                    className="rounded-xl bg-[#16C47F] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#00FFB2] transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Accept
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

