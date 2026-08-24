import React, { useEffect, useRef, useState, useId } from "react";
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export const AnimatedTimeline = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fallback for SSR and Reduced Motion
  if (!isMounted || shouldReduceMotion) {
    return (
      <div className={cn("relative mx-auto w-full max-w-4xl", className)}>
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-slate-200/50" />
        <div className="pl-14 md:pl-20">{children}</div>
      </div>
    );
  }

  return <TracingBeamCore className={className}>{children}</TracingBeamCore>;
};

const TracingBeamCore = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);
  // Unique gradient id per instance — duplicate SVG ids across the two
  // mounted timelines (reviewer + brand) made url(#gradient) resolve to the
  // wrong instance and broke the B2B beam.
  const gradientId = useId().replace(/:/g, "");
  const progress = useMotionValue(0);

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setSvgHeight(contentRef.current.offsetHeight);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => updateHeight());
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    // Manual scroll progress — computed from getBoundingClientRect on every
    // scroll frame. Unlike framer-motion's useScroll (which caches target
    // offsets measured while the audience section was display:none, and only
    // advances after the section top passes the viewport TOP — invisible on
    // desktop), this works identically on desktop, mobile, and immediately
    // after an audience toggle.
    // Progress 0 when section top reaches 85% of viewport height,
    // 1 when section bottom reaches 45% of viewport height.
    let raf = 0;
    const updateProgress = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh =
        window.innerHeight || document.documentElement.clientHeight || 1;
      const startLine = vh * 0.85;
      const endLine = vh * 0.45;
      const total = rect.height - (startLine - endLine);
      if (total <= 0) {
        progress.set(rect.top < startLine ? 1 : 0);
        return;
      }
      const p = (startLine - rect.top) / total;
      progress.set(Math.min(1, Math.max(0, p)));
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        updateProgress();
      });
    };

    updateProgress();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Re-measure height + progress when toggled visible (display:none reports 0)
    const visibilityObserver = new IntersectionObserver(() => {
      updateHeight();
      updateProgress();
    });
    if (ref.current) {
      visibilityObserver.observe(ref.current);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [progress]);

  const springConfig = { stiffness: 500, damping: 90 };
  const y1 = useSpring(
    useTransform(progress, [0, 0.8], [50, svgHeight]),
    springConfig
  );
  const y2 = useSpring(
    useTransform(progress, [0, 1], [50, svgHeight - 200]),
    springConfig
  );
  const dotFill = useTransform(progress, (v) => (v > 0 ? "#ffffff" : "#3b82f6"));
  const dotStroke = useTransform(progress, (v) => (v > 0 ? "#ffffff" : "#2563eb"));

  return (
    <motion.div
      ref={ref}
      className={cn("relative mx-auto w-full max-w-4xl h-full", className)}
    >
      <div className="absolute left-6 md:left-8 top-2 flex flex-col items-center">
        <motion.div
          className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm z-10"
          style={{ borderColor: dotStroke }}
        >
          <motion.div
            className="h-2 w-2 rounded-full border border-slate-300 bg-white"
            style={{ backgroundColor: dotFill, borderColor: dotStroke }}
          />
        </motion.div>

        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="block -mt-4"
          aria-hidden="true"
        >
          <motion.path
            d={`M 10 0 V ${svgHeight}`}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="2"
          />
          <motion.path
            d={`M 10 0 V ${svgHeight}`}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
            className="motion-reduce:hidden"
          />
          <defs>
            <motion.linearGradient
              id={gradientId}
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1}
              y2={y2}
            >
              <stop stopColor="#3b82f6" stopOpacity="0" />
              <stop stopColor="#3b82f6" />
              <stop offset="0.5" stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#d946ef" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
      </div>

      <div ref={contentRef} className="pl-14 md:pl-20 relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
