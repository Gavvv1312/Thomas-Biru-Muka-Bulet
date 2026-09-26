import { motion } from "framer-motion";

export default function StepDots({ total, current }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <motion.div
            key={step}
            className={`h-2 rounded-full transition-colors duration-300 ${
              isActive ? "bg-moss" : isDone ? "bg-signal-deep" : "bg-line"
            }`}
            animate={{ width: isActive ? 22 : 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          />
        );
      })}
    </div>
  );
}
