import { motion } from "framer-motion";

export default function Card({ children, className = "", hover = false, as = "div", ...props }) {
  const Component = motion[as] || motion.div;
  return (
    <Component
      className={`card ${className}`}
      whileHover={hover ? { y: -4, boxShadow: "0 16px 32px -18px rgba(20,32,25,0.32)" } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      {...props}
    >
      {children}
    </Component>
  );
}
