import React, { useEffect, useRef, useState } from "react";
import { motion, useTransform, useScroll, useSpring, useReducedMotion } from "framer-motion";
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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setSvgHeight(contentRef.current.offsetHeight);
      }
    };
    
    // Initial update
    updateHeight();
    
    // Use ResizeObserver for more accurate height tracking
    const resizeObserver = new ResizeObserver(() => updateHeight());
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    // Re-measure when the section becomes visible. The audience toggle uses
    // display:none, which reports height 0 and collapses the beam for the
    // hidden timeline until this observer fires.
    const visibilityObserver = new IntersectionObserver(() => updateHeight());
    if (ref.current) {
      visibilityObserver.observe(ref.current);
    }

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]),
    { stiffness: 500, damping: 90 }
  );
  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]),
    { stiffness: 500, damping: 90 }
  );

  return (
    <motion.div
      ref={ref}
      className={cn("relative mx-auto w-full max-w-4xl h-full", className)}
    >
      <div className="absolute left-6 md:left-8 top-2 flex flex-col items-center">
        <motion.div
          transition={{ duration: 0.2, delay: 0.5 }}
          animate={{
            boxShadow: scrollYProgress.get() > 0 ? "none" : "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
          className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm z-10"
        >
          <motion.div
            transition={{ duration: 0.2, delay: 0.5 }}
            animate={{
              backgroundColor: scrollYProgress.get() > 0 ? "white" : "#3b82f6",
              borderColor: scrollYProgress.get() > 0 ? "white" : "#2563eb",
            }}
            className="h-2 w-2 rounded-full border border-slate-300 bg-white"
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
            stroke="url(#gradient)"
            strokeWidth="3"
            className="motion-reduce:hidden"
          />
          <defs>
            <motion.linearGradient
              id="gradient"
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