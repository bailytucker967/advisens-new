/**
 * The Titan concentric-arcs motif (white + Empowered Purple) sweeping from the
 * bottom-right corner, echoing the logo's circle. Designed to sit on a
 * deep-purple background. Mirrors the motif used in the real report SlideDeck.
 */
export function TitanArcs({
  className = "h-full w-[65%]",
  opacity = 0.9,
}: {
  className?: string;
  opacity?: number;
}) {
  const colors = ["#8a3ffc", "#ffffff", "#8a3ffc", "#ffffff", "#8a3ffc", "#ffffff"];
  return (
    <svg
      className={`pointer-events-none absolute bottom-0 right-0 ${className}`}
      viewBox="0 0 400 400"
      preserveAspectRatio="xMaxYMax slice"
      fill="none"
      aria-hidden
    >
      {[110, 162, 214, 266, 318, 370].map((r, i) => (
        <circle
          key={r}
          cx="400"
          cy="400"
          r={r}
          stroke={colors[i % colors.length]}
          strokeWidth="13"
          opacity={opacity}
        />
      ))}
    </svg>
  );
}
