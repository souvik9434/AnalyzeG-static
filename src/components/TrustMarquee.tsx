import React from "react";
import { Marquee } from "@/components/ui/marquee";

const reviewerChips = [
  "Paid Category Opportunities",
  "Rates Shown in Reviewer Account",
  "Payouts Within 24 Hours of Eligible Sale",
  "UPI & Bank Transfer",
  "Smartphone-Only Setup",
  "100% Free to Join",
  "Earnings Dashboard",
  "Verified Review Guidelines",
];

const brandChips = [
  "5-Point Verified Reviews",
  "30-Second In-Hand Videos",
  "Power BI Dashboards",
  "State + Age Filtering",
  "Raw Data Export (CSV/Excel)",
  "Ad Licensing Where Reviewers Opt In",
  "One-Time Dataset Licensing",
  "In-Stock Delivery May Be Available in Minutes",
];

const Chip = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#16a34a"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
    {label}
  </div>
);

export function TrustMarquee({
  audience = "reviewer",
}: {
  audience?: "reviewer" | "brand";
}) {
  const chips = audience === "reviewer" ? reviewerChips : brandChips;
  return (
    <div className="relative w-full overflow-hidden border-y border-slate-200/60 bg-slate-50/80 py-4">
      <Marquee pauseOnHover className="[--duration:25s]">
        {chips.map((c) => (
          <Chip key={c} label={c} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-50 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-slate-50 to-transparent" />
    </div>
  );
}
