import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const reviewerFaqs: FaqItem[] = [
  {
    id: "rev-1",
    category: "Getting Started",
    question: "How do I start earning money with reviews?",
    answer:
      "Sign up on AnalyzeG, complete your profile verification, and choose review opportunities. Once verified, submit your 30-second in-hand product video reviews and start earning rewards.",
  },
  {
    id: "rev-2",
    category: "Getting Started",
    question: "What equipment do I need?",
    answer:
      "A smartphone with a decent camera and a stable internet connection is all you need. We provide guidelines for optimal video quality and review submission.",
  },
  {
    id: "rev-3",
    category: "Earnings & Payments",
    question: "How much can I earn per review?",
    answer:
      "Limited-time model: you can get up to ₹40 after authentic verification. When your review is sold, you receive the remaining payout from your 50% revenue share after subtracting that instant payout.",
  },
  {
    id: "rev-4",
    category: "Earnings & Payments",
    question: "When and how do I get paid?",
    answer:
      "You receive up to ₹40 soon after verification. The remaining payout is processed within 24 hours of purchase when your review is sold. Payment options include UPI and bank transfer.",
  },
  {
    id: "rev-5",
    category: "Earnings & Payments",
    question: "Is there a minimum payout threshold?",
    answer:
      "No strict minimum threshold. The instant payout of up to ₹40 is paid after verification, and the rest is transferred automatically upon review sale.",
  },
  {
    id: "rev-6",
    category: "Review Process",
    question: "How long should my video reviews be?",
    answer:
      "Videos are typically 30-second long, in-hand with the product, covering genuine user experience according to our simple checklist.",
  },
  {
    id: "rev-7",
    category: "Review Process",
    question: "How does verification work?",
    answer:
      "Our multi-factor verification system validates your identity and review authenticity through security checks to maintain platform trust and guarantee payout accuracy.",
  },
];

const brandFaqs: FaqItem[] = [
  {
    id: "brand-1",
    category: "Platform Benefits",
    question: "How does AnalyzeG verify review authenticity?",
    answer:
      "We use multi-factor verification to authenticate reviewer identity and product possession. Each review is digitally authenticated, time-stamped, and securely recorded.",
  },
  {
    id: "brand-2",
    category: "Platform Benefits",
    question: "What insights and deliverables do brands receive?",
    answer:
      "You receive 30-second in-hand product videos, a custom Power BI dashboard template, full analyzed sentiment and demographic reports, plus raw CSV/Excel data files.",
  },
  {
    id: "brand-3",
    category: "Review Management",
    question: "How quickly can we receive verified reviews?",
    answer:
      "Review intelligence is delivered rapidly — from 2 minutes for pre-verified category data up to 24 hours for custom requested product campaigns.",
  },
  {
    id: "brand-4",
    category: "Review Management",
    question: "Can we specify reviewer demographics and filters?",
    answer:
      "Yes, target specific consumer demographics including state/region, age bracket, and gender to match your exact market research criteria.",
  },
  {
    id: "brand-5",
    category: "Data & Licensing",
    question: "Can we use reviewer videos for advertising?",
    answer:
      "Yes. Main brand purchasers receive video licensing rights allowing you to use raw authentic customer videos directly in your advertising campaigns.",
  },
  {
    id: "brand-6",
    category: "Data & Licensing",
    question: "How is our business data protected?",
    answer:
      "All platform data is encrypted in transit and at rest. Access controls and audit logging ensure complete enterprise data privacy and security.",
  },
];

export function FaqAccordion({ audience = "reviewer" }: { audience?: "reviewer" | "brand" }) {
  const [query, setQuery] = React.useState("");
  const faqs = audience === "reviewer" ? reviewerFaqs : brandFaqs;
  const filtered = faqs.filter(
    (f) =>
      !query ||
      f.question.toLowerCase().includes(query.toLowerCase()) ||
      f.answer.toLowerCase().includes(query.toLowerCase()) ||
      f.category.toLowerCase().includes(query.toLowerCase())
  );
  const categories = Array.from(new Set(filtered.map((f) => f.category)));

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
        <input
          type="search"
          placeholder="Search FAQs (e.g. payout, verification, Power BI)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search FAQs"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm">Clear</button>
        )}
      </div>
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm text-center">
          <p className="text-slate-700 font-medium">No results for “{query}”.</p>
          <p className="text-sm text-slate-600 mt-2">Try different keywords or contact our support team.</p>
          <a href="mailto:support@analyzeg.co.in" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Contact Support — support@analyzeg.co.in</a>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                {cat}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {filtered
                  .filter((f) => f.category === cat)
                  .map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>
                        <p>{item.answer}</p>
                        <p className="mt-3 text-xs text-slate-500">Still stuck? <a href="mailto:support@analyzeg.co.in" className="text-blue-600 underline hover:text-blue-700">Contact Support</a> — we reply within 48h.</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
