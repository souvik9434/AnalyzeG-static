import React from "react";
import { HoverEffect } from "@/components/ui/card-hover-effect";

const items = [
  {
    title: "Secure Verification System",
    description:
      "Every review on AnalyzeG is digitally authenticated and securely recorded for maximum trust.",
    link: "/features.html",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2563EB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Dual-Stage Payout",
    description:
      "Limited-time flow: get up to Rs 40 after authentic verification, then get the remaining payout from your 50% share when your review is sold.",
    link: "/earn-money-reviews.html",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2563EB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8l-8 8" />
        <path d="M8 8l8 8" />
      </svg>
    ),
  },
  {
    title: "Consumer Intelligence",
    description:
      "Advanced insights, key theme extraction, and sentiment analysis for data-driven decisions.",
    link: "/features.html",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2563EB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.29 7 12 12 20.71 7" />
        <line x1="12" y1="22" x2="12" y2="12" />
      </svg>
    ),
  },
];

export function FeatureHoverGrid() {
  return <HoverEffect items={items} className="md:grid-cols-3" />;
}
