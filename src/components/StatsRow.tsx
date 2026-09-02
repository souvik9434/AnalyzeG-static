import React from "react";
import { NumberTicker } from "@/components/ui/number-ticker";

const reviewerStats = [
  { value: 40, prefix: "₹", suffix: "", label: "Instant payout per review" },
  { value: 50, suffix: "%", label: "Revenue share when sold" },
  { value: 24, suffix: "h", label: "Max payout window" },
  { value: 100, suffix: "%", label: "Free to join" },
];

const brandStats = [
  { value: 100, suffix: "%", label: "Verified reviewers" },
  { value: 30, suffix: "s", label: "In-hand product videos" },
  { value: 50, suffix: "%", label: "Revenue share payout" },
  { value: 24, suffix: "h", label: "Max delivery window" },
];

export function StatsRow({
  audience = "reviewer",
}: {
  audience?: "reviewer" | "brand";
}) {
  const stats = audience === "reviewer" ? reviewerStats : brandStats;
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 py-8 md:grid-cols-4 mb-4">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col items-center text-center">
          <div className="text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl">
            {s.prefix && <span className="text-slate-900 text-2xl md:text-3xl">{s.prefix}</span>}
            <NumberTicker value={s.value} className="text-slate-900" />
            {s.suffix && <span className="text-blue-600">{s.suffix}</span>}
          </div>
          <p className="mt-2 text-sm text-slate-600 font-medium">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
