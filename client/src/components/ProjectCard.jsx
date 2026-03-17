import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#1F2A24] bg-[#0B1210] px-2.5 py-1 text-xs text-[#8FA89E]">
      {children}
    </span>
  );
}

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

export default function ProjectCard({ project }) {
  const title = project?.title || "Untitled project";
  const description = project?.description || "";
  const techStack = Array.isArray(project?.techStack) ? project.techStack : [];
  const tags = Array.isArray(project?.tags) ? project.tags : [];
  const score = project?.aiAnalysis?.score ?? null;

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
      className="group relative overflow-hidden rounded-2xl p-5 glass card"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(22,196,127,0.18),transparent_55%)]" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-[#E6F4EA] truncate">
            <Link to={`/projects/${project?._id}`} className="hover:text-white">
              {title}
            </Link>
          </h3>
          {project?.user?.name || project?.user?.email ? (
            <p className="mt-1 text-xs text-[#8FA89E]">
              by {project.user.name || project.user.email}
            </p>
          ) : null}
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <ScorePill score={score} />
          {project?.githubLink ? (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noreferrer"
              className="text-xs rounded-lg border border-[#1F2A24] px-2.5 py-2 text-[#8FA89E] hover:text-[#E6F4EA] hover:bg-[#0B1210] transition"
            >
              GitHub
            </a>
          ) : null}
        </div>
      </div>

      {description ? (
        <p className="relative mt-4 text-sm text-[#8FA89E] line-clamp-3">
          {description}
        </p>
      ) : null}

      {(techStack.length > 0 || tags.length > 0) && (
        <div className="relative mt-4 flex flex-wrap gap-2">
          {techStack.slice(0, 5).map((t) => (
            <Chip key={`tech-${t}`}>{t}</Chip>
          ))}
          {tags.slice(0, 5).map((t) => (
            <Chip key={`tag-${t}`}>#{t}</Chip>
          ))}
        </div>
      )}

      <div className="relative mt-5 flex items-center justify-between">
        <Link
          to={`/projects/${project?._id}`}
          className="text-sm font-medium text-[#16C47F] hover:text-[#00FFB2] transition"
        >
          View details →
        </Link>
        {project?.createdAt ? (
          <span className="text-xs text-[#8FA89E]">
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        ) : null}
      </div>
    </motion.article>
  );
}

