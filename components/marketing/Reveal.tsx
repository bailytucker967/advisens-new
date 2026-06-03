"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-reveal wrapper. Fades + lifts children into view once.
 * `delay` 1–5 maps to the staggered reveal-delay classes.
 */
export function Reveal({
  children,
  delay,
  className,
}: {
  children: ReactNode;
  delay?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "reveal",
        delay && `reveal-delay-${delay}`,
        visible && "visible",
        className,
      )}
    >
      {children}
    </div>
  );
}
