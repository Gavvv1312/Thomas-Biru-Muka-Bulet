import { motion } from "framer-motion";
import Spinner from "./Spinner.jsx";

export const VARIANT_CLASS = {
  primary: "btn-primary",
  signal: "btn-signal",
  ghost: "btn-ghost",
  outline: "btn-outline",
  "danger-ghost": "btn-danger-ghost",
};

export function buttonClasses({ variant = "primary", size, block, className = "" }) {
  return [
    "btn",
    VARIANT_CLASS[variant] || VARIANT_CLASS.primary,
    size === "sm" ? "btn-sm" : "",
    block ? "btn-block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function Button({
  as = "button",
  variant = "primary",
  size,
  block,
  loading,
  disabled,
  children,
  className = "",
  ...props
}) {
  const classes = buttonClasses({ variant, size, block, className });
  const Component = as === "a" ? motion.a : motion.button;

  return (
    <Component
      className={classes}
      disabled={as === "button" ? disabled || loading : undefined}
      whileHover={disabled || loading ? {} : { scale: 1.03 }}
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </Component>
  );
}
