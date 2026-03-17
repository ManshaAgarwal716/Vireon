import { Link, NavLink, Outlet } from "react-router-dom";
import { clearAuth, getUser } from "../auth/storage";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PremiumBackground from "./PremiumBackground";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "text-sm px-3 py-2 rounded-lg transition relative",
          "after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-1 after:h-[2px] after:rounded-full after:bg-[#16C47F]",
          "after:origin-left after:scale-x-0 after:transition-transform after:duration-200 after:ease-out",
          "hover:after:scale-x-100",
          isActive
            ? "text-[#0B1210] bg-[#16C47F] after:scale-x-100 after:bg-black/80"
            : "text-[#8FA89E] hover:text-[#E6F4EA] hover:bg-[#111A16]",
        ].join(" ")
      }
    >
      <span className="relative z-10">{children}</span>
    </NavLink>
  );
}

export default function AppShell() {
  const [bump, setBump] = useState(0);
  const user = useMemo(() => {
    void bump;
    return getUser();
  }, [bump]);

  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("touchstart", onDown, { passive: true });
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("touchstart", onDown);
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen text-[#E6F4EA]">
      <PremiumBackground />

      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={[
          "fixed inset-x-0 top-0 z-50 border-b border-[#1F2A24] transition duration-200",
          isScrolled
            ? "bg-[#0B1210]/70 backdrop-blur-xl shadow-[0_12px_34px_rgba(0,0,0,0.28)]"
            : "bg-[#0B1210]/45 backdrop-blur-md",
        ].join(" ")}
      >
        <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
          <Link to="/" className="font-bold tracking-widest text-[#16C47F] hover:text-[#00FFB2] transition">
            VIREON
          </Link>

          <div className="hidden sm:flex items-center gap-2">
            <NavItem to="/home">Home</NavItem>
            <NavItem to="/dashboard">Dashboard</NavItem>
            <NavItem to="/projects/new">Upload</NavItem>
            <NavItem to="/requests">Requests</NavItem>
            <NavItem to="/landing">Landing</NavItem>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative" ref={menuRef}>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-[#1F2A24] text-[#8FA89E] hover:text-[#E6F4EA] hover:bg-[#111A16] transition"
                >
                  <span className="hidden md:inline">
                    {user.name || user.email}
                  </span>
                  <span className="md:hidden">Account</span>
                  <span className={`transition-transform ${menuOpen ? "rotate-180" : ""}`}>▾</span>
                </motion.button>

                <AnimatePresence>
                  {menuOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-[#1F2A24] bg-[#0B1210]/95 backdrop-blur-xl shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
                    >
                      <div className="px-4 py-3 border-b border-[#1F2A24]">
                        <p className="text-xs text-[#8FA89E]">Signed in as</p>
                        <p className="text-sm font-semibold truncate">
                          {user.email || user.name}
                        </p>
                      </div>

                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="block rounded-xl px-3 py-2 text-sm text-[#8FA89E] hover:text-[#E6F4EA] hover:bg-[#111A16] transition"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/requests"
                          onClick={() => setMenuOpen(false)}
                          className="block rounded-xl px-3 py-2 text-sm text-[#8FA89E] hover:text-[#E6F4EA] hover:bg-[#111A16] transition"
                        >
                          Requests
                        </Link>
                        <Link
                          to="/projects/new"
                          onClick={() => setMenuOpen(false)}
                          className="block rounded-xl px-3 py-2 text-sm text-[#8FA89E] hover:text-[#E6F4EA] hover:bg-[#111A16] transition"
                        >
                          Upload project
                        </Link>
                      </div>

                      <div className="p-2 border-t border-[#1F2A24]">
                        <button
                          type="button"
                          onClick={() => {
                            clearAuth();
                            setMenuOpen(false);
                            setBump((x) => x + 1);
                          }}
                          className="w-full text-left rounded-xl px-3 py-2 text-sm text-red-200 hover:bg-red-500/10 transition"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NavItem to="/login">Login</NavItem>
                <Link
                  to="/register"
                  className="text-sm px-3 py-2 btn-primary transition"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="pt-[76px] relative">
        <Outlet />
      </div>
    </div>
  );
}

