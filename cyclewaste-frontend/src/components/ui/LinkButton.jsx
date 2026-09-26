import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { buttonClasses } from "./Button.jsx";

const MotionLink = motion(Link);

export default function LinkButton({ to, variant = "primary", size, block, children, className = "", ...props }) {
  const classes = buttonClasses({ variant, size, block, className });
  return (
    <MotionLink
      to={to}
      className={classes}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      {...props}
    >
      {children}
    </MotionLink>
  );
}
