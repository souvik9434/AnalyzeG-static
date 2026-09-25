import React from "react";

type Spec = { headline: string; sub: string };

const reviewerSpecs: Spec[] = [
  { headline: "5-point", sub: "Screening before moderation" },
  { headline: "30s", sub: "Standard review format" },
  { headline: "24h", sub: "Eligible-sale payout target" },
  { headline: "0₹", sub: "Cost to join — ever" },
];

const brandSpecs: Spec[] = [
  { headline: "5-point", sub: "Screening per review" },
  { headline: "30s", sub: "In-hand product videos" },
  { headline: "24h", sub: "In-stock delivery target" },
  { headline: "Raw", sub: "CSV/Excel — you verify us" },
];

export function StatsRow({ audience = "brand" }: { audience?: "reviewer" | "platform" | "brand" }) {
  const specs = audience === "reviewer" ? reviewerSpecs : brandSpecs;
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 py-8 md:grid-cols-4 mb-4">
      {specs.map((s) => (
        <div key={s.sub} className="flex flex-col items-center text-center">
          <div className="text-4xl font-bold tracking-tighter text-slate-900 md:text-5xl">
            {s.headline}
          </div>
          <p className="mt-2 text-sm text-slate-600 font-medium">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
