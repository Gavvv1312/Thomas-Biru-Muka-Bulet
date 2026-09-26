import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SIZE_CLASS = {
  sm: "max-w-[420px]",
  lg: "max-w-[640px]",
};

export default function Modal({ open, onClose, title, subtitle, children, size = "sm" }) {
  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-ink/45"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose?.();
          }}
        >
          <motion.div
            className={`bg-surface rounded-md2 p-7 w-full ${SIZE_CLASS[size] || SIZE_CLASS.sm} max-h-[85vh] overflow-y-auto shadow-card`}
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
          >
            {title && <h3 className="text-lg mb-1">{title}</h3>}
            {subtitle && <p className="text-ink-soft text-sm mb-4">{subtitle}</p>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
