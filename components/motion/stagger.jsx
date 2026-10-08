"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

export function Stagger({ children, className, delay = 0, stagger = 0.06 }) {
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

  const items = Children.map(children, (child, index) =>
    isValidElement(child)
      ? cloneElement(child, {
          style: {
            ...(child.props.style ?? {}),
            "--stagger-index": index,
          },
        })
      : child,
  );

  return (
    <div
      ref={ref}
      className={className ? `stagger ${className}` : "stagger"}
      data-revealed={revealed || undefined}
      style={{
        "--stagger-delay": `${delay * 1000}ms`,
        "--stagger-gap": `${stagger * 1000}ms`,
      }}
    >
      {items}
    </div>
  );
}

export function StaggerItem({ children, className, style }) {
  return (
    <div
      className={className ? `stagger-item ${className}` : "stagger-item"}
      style={style}
    >
      {children}
    </div>
  );
}