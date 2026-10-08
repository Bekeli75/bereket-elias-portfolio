"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

export function Magnetic({ children, className, strength = 0.25 }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: "transform 220ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setOffset({
          x: (event.clientX - rect.left - rect.width / 2) * strength,
          y: (event.clientY - rect.top - rect.height / 2) * strength,
        });
      }}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
    >
      {children}
    </div>
  );
}