import React from "react";
import { NumberTicker } from "@/components/ui/number-ticker";

type Stat = { value: number; prefix?: string; suffix: string; label: string };

const reviewerStats: Stat[] = [
  { value: 5, suffix: "-point", label: "Screening before moderation" },
  { value: 30, suffix: "s", label: "Standard review format" },
  { value: 24, suffix: "h", label: "Eligible-sale payout target" },
  { value: 100, suffix: "%", label: "Free to join" },
];

const brandStats: Stat[] = [
  { value: 5, suffix: "-point", label: "Screening per review" },
  { value: 30, suffix: "s", label: "In-hand product videos" },
  { value: 24, suffix: "h", label: "In-stock delivery target" },
  { value: 1, suffix: "-time", label: "Dataset licence model" },
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
