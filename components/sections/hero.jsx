"use client";

import dynamic from "next/dynamic";
import { ArrowDown, Download } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { profile } from "@/content/profile";

const NetworkCanvas = dynamic(
  () => import("@/components/visuals/network-canvas"),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="h-full w-full min-h-[320px] animate-pulse bg-surface-2"
      />
    ),
  },
);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-[88svh] scroll-mt-20 items-center overflow-hidden pb-20 pt-32 md:pt-40"
    >
      <div
        aria-hidden="true"
        className="grid-backdrop pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-15%] size-[540px] rounded-full bg-accent/15 blur-[130px]"
      />

      <div className="container-page relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <motion.div
            initial={reduceMotion ? "show" : "hidden"}
            animate="show"
            variants={container}
          >
            <motion.div variants={fadeUp}>
              <Badge tone="success" dot>
                {profile.availability.label}
              </Badge>
            </motion.div>

            <motion.h1 variants={fadeUp} className="mt-6">
              Bereket Elias
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 font-mono text-sm uppercase tracking-[0.18em] text-accent md:text-base"
            >
              {profile.title}
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-xl text-lg text-muted md:text-xl"
            >
              Computer engineering student building reliable networks and
              connected systems — from Cisco Packet Tracer labs to working
              software.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-4">
              <Magnetic>
                <ButtonLink href="/#projects" size="lg">
                  View Projects
                </ButtonLink>
              </Magnetic>
              <ButtonLink
                href="/api/resume/download?source=hero"
                variant="secondary"
                size="lg"
                download
              >
                <Download aria-hidden="true" size={17} />
                Download CV
              </ButtonLink>
            </motion.div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? "show" : "hidden"}
            animate="show"
            variants={container}
            transition={{ delayChildren: 0.25 }}
            className="glass relative h-[320px] overflow-hidden md:h-[440px] lg:h-[520px]"
          >
            <div
              aria-hidden="true"
              className="grid-backdrop pointer-events-none absolute inset-0"
            />
            <NetworkCanvas className="absolute inset-0 h-full w-full" />
            <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[0.7rem] uppercase tracking-widest text-muted">
              netgraph · live
            </div>
          </motion.div>
        </div>

        <a
          href="#about"
          aria-label="Scroll to about section"
          className="absolute -bottom-4 left-1/2 hidden -translate-x-1/2 text-muted transition-colors hover:text-accent lg:block"
        >
          <ArrowDown aria-hidden="true" size={20} className="animate-bounce" />
        </a>
      </div>
    </section>
  );
}
