import { motion, useReducedMotion } from "framer-motion";

export default function PremiumBackground() {
  const reduceMotion = useReducedMotion();

  const floatTransition = (duration) =>
    reduceMotion
      ? { duration: 0.2 }
      : { duration, repeat: Infinity, ease: "easeInOut" };

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_15%_-10%,rgba(124,58,237,0.22),transparent_60%),radial-gradient(900px_520px_at_90%_10%,rgba(59,130,246,0.18),transparent_55%),linear-gradient(180deg,#06080c,#070d0b_35%,#0b1210)]" />

      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:52px_52px]" />

      <motion.div
        className="absolute -top-44 -left-56 h-[720px] w-[720px] rounded-full blur-3xl opacity-20"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(124,58,237,0.95), rgba(59,130,246,0.35), transparent 65%)",
        }}
        initial={false}
        animate={reduceMotion ? { x: 0, y: 0 } : { x: [0, 28, -8, 0], y: [0, 18, 40, 0] }}
        transition={floatTransition(18)}
      />
      <motion.div
        className="absolute -top-52 -right-72 h-[820px] w-[820px] rounded-full blur-3xl opacity-16"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, rgba(59,130,246,0.85), rgba(99,102,241,0.35), transparent 65%)",
        }}
        initial={false}
        animate={reduceMotion ? { x: 0, y: 0 } : { x: [0, -22, 14, 0], y: [0, 34, 12, 0] }}
        transition={floatTransition(22)}
      />
      <motion.div
        className="absolute -bottom-72 left-1/2 -translate-x-1/2 h-[720px] w-[720px] rounded-full blur-3xl opacity-12"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(147,51,234,0.65), rgba(37,99,235,0.25), transparent 65%)",
        }}
        initial={false}
        animate={reduceMotion ? { x: 0, y: 0 } : { x: [0, 26, -26, 0], y: [0, -12, 18, 0] }}
        transition={floatTransition(26)}
      />
    </div>
  );
}

