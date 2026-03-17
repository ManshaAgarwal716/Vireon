import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import PremiumBackground from "../components/PremiumBackground";

const features = [
  {
    title: "Upload projects",
    desc: "Share what you’re building with clean cards, tags, stack, and GitHub links.",
  },
  {
    title: "Find collaborators",
    desc: "Request collaboration and manage approvals with a simple, transparent workflow.",
  },
  {
    title: "AI project analysis",
    desc: "Get a score plus actionable suggestions and improvements to level up your listing and roadmap.",
  },
];

export default function Landing() {
  const shouldReduceMotion = useReducedMotion(); // ✅ FIX ADDED

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PremiumBackground />

      <header className="relative z-10">
        <div className="mx-auto max-w-6xl px-5 pt-10">
          <nav className="glass card px-5 py-4 flex items-center justify-between">
            <Link to="/" className="font-bold tracking-widest text-[#16C47F] hover:text-[#00FFB2] transition">
              VIREON
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <a href="#features" className="text-sm px-3 py-2 rounded-lg text-[#8FA89E] hover:text-[#E6F4EA] hover:bg-[#111A16]/40 transition">
                Features
              </a>
              <Link to="/home" className="text-sm px-3 py-2 rounded-lg text-[#8FA89E] hover:text-[#E6F4EA] hover:bg-[#111A16]/40 transition">
                Explore
              </Link>
              <Link to="/login" className="text-sm px-3 py-2 rounded-lg text-[#8FA89E] hover:text-[#E6F4EA] hover:bg-[#111A16]/40 transition">
                Login
              </Link>
              <Link to="/register" className="text-sm px-3 py-2 btn-primary transition">
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-5 pt-20 pb-16">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.2 }
                    : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
                }
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
              >
                Build.{" "}
                <span className="text-[#16C47F] drop-shadow-[0_0_18px_rgba(0,255,178,0.25)]">
                  Share.
                </span>{" "}
                Collaborate.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.2 }
                    : { duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }
                }
                className="mt-5 text-lg text-[#8FA89E] max-w-2xl"
              >
                Vireon is a structured collaboration platform for developers to upload projects, discover teammates,
                and get AI-powered feedback to improve clarity, stack relevance, and next steps.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.2 }
                    : { duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }
                }
                className="mt-8 flex flex-wrap gap-3"
              >
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.92 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0.2 }
                      : { duration: 0.35, delay: 0.28, ease: [0.22, 1, 0.36, 1] }
                  }
                >
                  <Link to="/register" className="px-5 py-3 btn-primary transition inline-flex">
                    Get Started
                  </Link>
                </motion.div>

                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.92 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0.2 }
                      : { duration: 0.35, delay: 0.32, ease: [0.22, 1, 0.36, 1] }
                  }
                >
                  <Link
                    to="/home"
                    className="px-5 py-3 text-sm font-semibold text-[#E6F4EA] btn-secondary transition inline-flex"
                  >
                    Explore Projects
                  </Link>
                </motion.div>
              </motion.div>

              <div className="mt-8 flex flex-wrap gap-2">
                {["Fast onboarding", "Team workflow", "AI insights"].map((k) => (
                  <span
                    key={k}
                    className="inline-flex items-center rounded-full border border-[#1F2A24] bg-[#0B1210]/40 backdrop-blur-md px-3 py-1 text-xs text-[#8FA89E]"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="glass card p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Project preview</p>
                <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-200">
                  AI 84/100
                </span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="h-4 w-2/3 rounded bg-[#0B1210]/60 border border-[#1F2A24]" />
                <div className="h-4 w-full rounded bg-[#0B1210]/60 border border-[#1F2A24]" />
                <div className="h-4 w-5/6 rounded bg-[#0B1210]/60 border border-[#1F2A24]" />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {["React", "Node", "MongoDB"].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-[#1F2A24] bg-[#0B1210]/60 px-2.5 py-1 text-xs text-[#8FA89E]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-[#1F2A24] bg-[#0B1210]/55 p-4">
                <p className="text-xs text-[#8FA89E]">AI suggestions</p>
                <ul className="mt-2 text-sm text-[#8FA89E] list-disc pl-5 space-y-1">
                  <li>Add a short problem statement and target users.</li>
                  <li>Include deployment link + setup steps.</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-5 pb-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Built for serious builders</h2>
              <p className="mt-2 text-sm text-[#8FA89E]">
                Everything you need to ship projects and grow with collaborators.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {features.map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
                whileHover={{ y: -4 }}
                className="glass card p-6"
              >
                <div className="h-10 w-10 rounded-2xl bg-[linear-gradient(135deg,rgba(22,196,127,0.35),rgba(0,255,178,0.18))] border border-[#1F2A24]" />
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-[#8FA89E]">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#1F2A24]">
        <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-bold tracking-widest text-[#16C47F]">VIREON</p>
            <p className="mt-2 text-sm text-[#8FA89E]">
              © {new Date().getFullYear()} Vireon. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/home" className="text-sm text-[#8FA89E] hover:text-[#E6F4EA] transition">
              Explore
            </Link>
            <Link to="/register" className="text-sm text-[#8FA89E] hover:text-[#E6F4EA] transition">
              Get Started
            </Link>
            <a href="#features" className="text-sm text-[#8FA89E] hover:text-[#E6F4EA] transition">
              Features
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}