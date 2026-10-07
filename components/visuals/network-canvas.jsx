"use client";

import { useEffect, useRef } from "react";

function readPalette() {
  const styles = getComputedStyle(document.documentElement);
  return {
    accent: styles.getPropertyValue("--accent").trim() || "#4F8CFF",
    accent2: styles.getPropertyValue("--accent-2").trim() || "#22D3A6",
    muted: styles.getPropertyValue("--muted").trim() || "#8B95A8",
    border: styles.getPropertyValue("--border").trim() || "rgba(255,255,255,.08)",
  };
}

function buildGraph(width, height) {
  const count = width < 480 ? 18 : width < 900 ? 24 : 30;
  const nodes = [];
  const rand = Math.random;

  for (let i = 0; i < count; i++) {
    nodes.push({
      x: 0.08 + rand() * 0.84,
      y: 0.08 + rand() * 0.84,
      r: rand() < 0.18 ? 4.5 : 2.5,
      hub: rand() < 0.18,
      phase: rand() * Math.PI * 2,
    });
  }

  const linkDistance = Math.min(width, height) * 0.3;
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = (nodes[i].x - nodes[j].x) * width;
      const dy = (nodes[i].y - nodes[j].y) * height;
      if (Math.hypot(dx, dy) < linkDistance) {
        edges.push({ a: i, b: j });
      }
    }
  }

  // Ensure every node participates in the graph.
  for (let i = 0; i < nodes.length; i++) {
    const connected = edges.some((edge) => edge.a === i || edge.b === i);
    if (!connected && edges.length > 0) {
      edges.push({ a: i, b: Math.floor(rand() * nodes.length) });
    }
  }

  return { nodes, edges };
}

export default function NetworkCanvas({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let reduced = motionQuery.matches;

    let palette = readPalette();
    let nodes = [];
    let edges = [];
    let packets = [];
    let width = 0;
    let height = 0;
    let rafId = 0;
    let running = false;
    let visible = true;
    let lastTime = performance.now();
    const pointer = { x: -1000, y: -1000 };

    const makePackets = () => {
      packets = Array.from(
        { length: Math.min(10, Math.ceil(edges.length / 3)) },
        () => ({
          edge: Math.floor(Math.random() * Math.max(edges.length, 1)),
          t: Math.random(),
          speed: 0.12 + Math.random() * 0.22,
          colorIndex: Math.random() < 0.5 ? 0 : 1,
        }),
      );
    };

    const draw = (now, dt) => {
      context.clearRect(0, 0, width, height);

      const point = (node) => ({
        x: node.x * width,
        y: node.y * height,
      });

      // Edges
      context.strokeStyle = palette.border;
      context.lineWidth = 1;
      context.beginPath();
      for (const edge of edges) {
        const pa = point(nodes[edge.a]);
        const pb = point(nodes[edge.b]);
        context.moveTo(pa.x, pa.y);
        context.lineTo(pb.x, pb.y);
      }
      context.stroke();

      // Nodes
      for (const node of nodes) {
        const p = point(node);
        const pulse = reduced
          ? 0
          : Math.sin(now / 900 + node.phase) * 0.5 + 0.5;

        const distance = Math.hypot(pointer.x - p.x, pointer.y - p.y);
        const hovered = distance < 90;

        if (node.hub || hovered) {
          context.beginPath();
          context.arc(p.x, p.y, node.r + 5 + pulse * 2, 0, Math.PI * 2);
          context.fillStyle = palette.accent;
          context.globalAlpha = hovered ? 0.22 : 0.12;
          context.fill();
          context.globalAlpha = 1;
        }

        context.beginPath();
        context.arc(p.x, p.y, node.r, 0, Math.PI * 2);
        context.fillStyle = node.hub ? palette.accent : palette.muted;
        context.globalAlpha = node.hub ? 0.95 : 0.55;
        context.fill();
        context.globalAlpha = 1;
      }

      // Packets traveling along links
      if (!reduced && edges.length > 0) {
        for (const packet of packets) {
          packet.t += packet.speed * dt;
          if (packet.t > 1) {
            packet.edge = Math.floor(Math.random() * edges.length);
            packet.t = 0;
          }
          const edge = edges[packet.edge];
          if (!edge) continue;
          const pa = point(nodes[edge.a]);
          const pb = point(nodes[edge.b]);
          const tail = Math.max(packet.t - 0.06, 0);
          const tx = pa.x + (pb.x - pa.x) * tail;
          const ty = pa.y + (pb.y - pa.y) * tail;
          const hx = pa.x + (pb.x - pa.x) * packet.t;
          const hy = pa.y + (pb.y - pa.y) * packet.t;

          const color =
            packet.colorIndex === 0 ? palette.accent : palette.accent2;
          const gradient = context.createLinearGradient(tx, ty, hx, hy);
          gradient.addColorStop(0, "transparent");
          gradient.addColorStop(1, color);
          context.strokeStyle = gradient;
          context.lineWidth = 2;
          context.lineCap = "round";
          context.stroke();

          context.beginPath();
          context.arc(hx, hy, 2.5, 0, Math.PI * 2);
          context.fillStyle = color;
          context.fill();
        }
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const graph = buildGraph(width, height);
      nodes = graph.nodes;
      edges = graph.edges;
      makePackets();
      draw(performance.now(), 0);
    };

    const frame = (now) => {
      if (!running) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      draw(now, dt);
      rafId = window.requestAnimationFrame(frame);
    };

    const start = () => {
      if (reduced || running || !visible || document.hidden) return;
      running = true;
      lastTime = performance.now();
      rafId = window.requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(rafId);
    };

    const parent = canvas.parentElement;
    const resizeObserver = new ResizeObserver(resize);
    if (parent) resizeObserver.observe(parent);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.05 },
    );
    intersectionObserver.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    const themeObserver = new MutationObserver(() => {
      palette = readPalette();
      draw(performance.now(), 0);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const onMotionChange = (event) => {
      reduced = event.matches;
      if (reduced) {
        stop();
        draw(performance.now(), 0);
      } else {
        start();
      }
    };
    motionQuery.addEventListener("change", onMotionChange);

    resize();
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: "block" }}
    />
  );
}
