import { motion, useReducedMotion } from "framer-motion";

const AuthLayout = ({ children }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-screen text-[#E6F4EA] flex items-center justify-center overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(22,196,127,0.35), rgba(0,255,178,0.12), rgba(22,196,127,0.22))",
          backgroundSize: "200% 200%",
          mixBlendMode: "screen",
        }}
        initial={false}
        animate={
          reduceMotion
            ? { opacity: 0.12 }
            : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"], opacity: 0.22 }
        }
        transition={reduceMotion ? { duration: 0.2 } : { duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-[#00FFB2] opacity-10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-200px] left-[-200px] w-[400px] h-[400px] bg-[#16C47F] opacity-10 blur-3xl rounded-full"></div>
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md glass-strong card p-8"
      >
        <h1 className="text-center text-2xl font-bold text-[#16C47F] mb-6">
          VIREON
        </h1>

        {children}
      </motion.div>
    </div>
  );
};

export default AuthLayout;