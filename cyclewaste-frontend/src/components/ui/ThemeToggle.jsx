import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../lib/ThemeContext.jsx";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme, vtSwapRef } = useTheme();
  const isDark = theme === "dark";
  const reduceMotion = useReducedMotion();
  // During a View Transitions swap the root crossfade already shows the new
  // icon (the old one is frozen in the outgoing snapshot), so the icon's own
  // enter animation is skipped — otherwise it pops in after the crossfade.
  const skipEnter = Boolean(vtSwapRef?.current);

  const icon = isDark ? <FiSun size={16} /> : <FiMoon size={16} />;

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      title={isDark ? "Mode terang" : "Mode gelap"}
      whileHover={{ scale: reduceMotion ? 1 : 1.06 }}
      whileTap={{ scale: reduceMotion ? 1 : 0.92 }}
      className={`relative w-9 h-9 flex items-center justify-center rounded-full border border-line bg-surface text-ink-soft hover:text-moss-deep hover:border-moss transition-colors duration-300 overflow-hidden ${className}`}
    >
      {reduceMotion ? (
        <span key={theme} className="absolute flex items-center justify-center">
          {icon}
        </span>
      ) : (
        <AnimatePresence initial={false}>
          <motion.span
            key={theme}
            initial={skipEnter ? false : { opacity: 0, rotate: -120, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 120, scale: 0.5 }}
            transition={{
              opacity: { duration: 0.2, ease: "easeOut" },
              rotate: { type: "spring", stiffness: 380, damping: 24 },
              scale: { type: "spring", stiffness: 380, damping: 24 },
            }}
            className="absolute flex items-center justify-center will-change-transform"
          >
            {icon}
          </motion.span>
        </AnimatePresence>
      )}
    </motion.button>
  );
}
