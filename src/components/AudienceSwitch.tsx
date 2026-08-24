import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Option = {
  id: string;
  label: string;
};

const options: Option[] = [
  { id: "reviewer", label: "For Reviewers" },
  { id: "brand", label: "For Brands" },
];

const STORAGE_KEY = "selectedAudience";

function syncAudienceSections(audience: string) {
  const reviewerSections = document.querySelectorAll('[data-audience="reviewer"]');
  const brandSections = document.querySelectorAll('[data-audience="brand"]');

  if (audience === "reviewer") {
    reviewerSections.forEach((el) => el.classList.add("active"));
    brandSections.forEach((el) => el.classList.remove("active"));
  } else {
    reviewerSections.forEach((el) => el.classList.remove("active"));
    brandSections.forEach((el) => el.classList.add("active"));
  }

  // CRITICAL: AOS elements inside display:none sections are never registered.
  // Refresh AOS after the newly-shown section is laid out so data-aos
  // animations fire for the Brand timeline/pricing/CTA.
  setTimeout(() => {
    if (typeof (window as any).AOS !== "undefined") {
      (window as any).AOS.refreshHard();
    }
  }, 100);
}

export function AudienceSwitch() {
  const [active, setActive] = useState<string>(options[0].id);
  const [isHydrated, setIsHydrated] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // On mount: read saved preference from localStorage and sync DOM
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "reviewer" || saved === "brand") {
        setActive(saved);
        syncAudienceSections(saved);
      } else {
        // No saved preference — sync DOM with default state
        syncAudienceSections(options[0].id);
      }
    } catch {
      // localStorage unavailable — sync DOM with default state
      syncAudienceSections(options[0].id);
    }
    setIsHydrated(true);
  }, []);

  const handleSwitch = (id: string) => {
    setActive(id);
    syncAudienceSections(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // localStorage unavailable — silently ignore
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Audience selection"
      className="relative mx-auto flex w-fit items-center rounded-full bg-slate-100/80 p-1.5 shadow-inner backdrop-blur-md border border-slate-200/50 mb-12"
    >
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => handleSwitch(option.id)}
          className={cn(
            "relative z-10 flex items-center justify-center px-8 py-3 text-sm font-semibold transition-colors duration-300 outline-none sm:text-base rounded-full",
            active === option.id
              ? "text-blue-700"
              : "text-slate-500 hover:text-slate-700"
          )}
          style={{ WebkitTapHighlightColor: "transparent" }}
          aria-selected={active === option.id}
          role="tab"
        >
          {active === option.id && (
            <motion.div
              layoutId={shouldReduceMotion ? undefined : "active-pill"}
              className="absolute inset-0 -z-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-200/50"
              transition={{ type: "spring", stiffness: 500, damping: 30, duration: shouldReduceMotion ? 0 : undefined }}
            />
          )}
          {option.label}
       </button>
      ))}
   </div>
  );
}