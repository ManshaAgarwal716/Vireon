import { motion, useReducedMotion } from "framer-motion";
import { pageTransition, pageVariants } from "./transitions";

export default function MotionPage({ children, className }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.main
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={
        reduceMotion
          ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
          : pageVariants
      }
      transition={pageTransition}
    >
      {children}
    </motion.main>
  );
}
