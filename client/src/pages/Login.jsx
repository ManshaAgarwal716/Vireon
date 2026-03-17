import AuthLayout from "../layouts/AuthLayout";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../api/http";
import { setAuth } from "../auth/storage";

const Login = () => {
  const [focused, setFocused] = useState(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fieldVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 10 },
      show: { opacity: 1, y: 0 },
    }),
    []
  );

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      setSubmitting(true);
      const res = await http.post("/api/auth/login", {
        email: email.trim(),
        password,
      });
      setAuth(res.data);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="text-xl font-semibold text-center mb-6"
      >
        Welcome Back
      </motion.h2>

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-5"
      >
        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <motion.div
          variants={fieldVariants}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          <label className="block text-sm mb-2 text-[#8FA89E]">
            Email
          </label>
          <motion.input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused((v) => (v === "email" ? null : v))}
            animate={
              focused === "email"
                ? {
                    borderColor: "rgba(22,196,127,0.9)",
                    boxShadow: "0 0 0 4px rgba(22,196,127,0.15)",
                  }
                : { borderColor: "rgba(31,42,36,1)", boxShadow: "0 0 0 0 rgba(0,0,0,0)" }
            }
            transition={{ duration: 0.18 }}
            className="w-full p-3 rounded-lg bg-[#0B1210] border focus:outline-none"
            placeholder="Enter your email"
          />
        </motion.div>

        <motion.div
          variants={fieldVariants}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <label className="block text-sm mb-2 text-[#8FA89E]">
            Password
          </label>
          <motion.input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused((v) => (v === "password" ? null : v))}
            animate={
              focused === "password"
                ? {
                    borderColor: "rgba(22,196,127,0.9)",
                    boxShadow: "0 0 0 4px rgba(22,196,127,0.15)",
                  }
                : { borderColor: "rgba(31,42,36,1)", boxShadow: "0 0 0 0 rgba(0,0,0,0)" }
            }
            transition={{ duration: 0.18 }}
            className="w-full p-3 rounded-lg bg-[#0B1210] border focus:outline-none"
            placeholder="Enter your password"
          />
        </motion.div>

        <motion.button
          type="submit"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          whileHover={{ scale: submitting ? 1 : 1.02 }}
          whileTap={{ scale: submitting ? 1 : 0.98 }}
          disabled={submitting}
          className="w-full py-3 rounded-lg bg-[#16C47F] text-black font-semibold hover:bg-[#00FFB2] transition duration-200 shadow-[0_12px_30px_rgba(22,196,127,0.18)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Logging in…" : "Login"}
        </motion.button>

        <p className="text-center text-sm text-[#8FA89E]">
          New here?{" "}
          <Link to="/register" className="text-[#16C47F] hover:text-[#00FFB2] transition">
            Create an account
          </Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
};

export default Login;