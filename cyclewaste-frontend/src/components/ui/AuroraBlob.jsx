/**
 * A soft, slowly-drifting blurred gradient — the "aurora" effect, adapted
 * to this project's own Tailwind + CSS-variable color system rather than
 * pulling in shadcn's CLI/`cn()` utility/`@/lib/utils` for one background
 * effect. Uses the same --color-* variables as the rest of the design
 * system, so it automatically shifts with light/dark mode.
 *
 * Purely decorative — always aria-hidden. Pointer-events disabled so it
 * never blocks clicks on content placed above it.
 */
export default function AuroraBlob({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="absolute -inset-[15%] opacity-60 dark:opacity-40 blur-3xl animate-aurora-drift"
        style={{
          backgroundImage: [
            "radial-gradient(circle at 20% 30%, rgb(var(--color-signal) / 0.55), transparent 55%)",
            "radial-gradient(circle at 75% 25%, rgb(var(--color-copper) / 0.45), transparent 50%)",
            "radial-gradient(circle at 50% 80%, rgb(var(--color-moss) / 0.5), transparent 55%)",
          ].join(", "),
        }}
      />
    </div>
  );
}
