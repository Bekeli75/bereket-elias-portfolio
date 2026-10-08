"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

export function Reveal({ children, className, delay = 0, y = 24 }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setRevealed(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      className={className ? `reveal ${className}` : "reveal"}
      data-revealed={revealed || undefined}
      style={{
        "--reveal-delay": `${delay * 1000}ms`,
        "--reveal-y": `${y}px`,
      }}
    >
      {children}
    </div>
  );
}