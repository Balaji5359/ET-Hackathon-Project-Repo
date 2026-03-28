import { motion } from "framer-motion";
import { Shield, CreditCard, Home, Umbrella, TrendingUp, ExternalLink, CheckCircle2 } from "lucide-react";

const services = [
  {
    id: "loans",
    icon: Home,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    title: "Personal & Home Loans",
    desc: "Compare rates from 20+ lenders. Get pre-approved in minutes.",
    features: ["Rates from 8.5% p.a.", "Up to ₹5 Cr loan amount", "Instant approval"],
    cta: "Check Eligibility",
    url: "https://economictimes.indiatimes.com/wealth/borrow",
  },
  {
    id: "insurance",
    icon: Umbrella,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    title: "Term & Health Insurance",
    desc: "Protect your family with the right coverage at the best price.",
    features: ["Cover up to ₹10 Cr", "Cashless hospitals 10,000+", "ET reader discount 15%"],
    cta: "Get Quote",
    url: "https://economictimes.indiatimes.com/wealth/insure",
  },
  {
    id: "credit_cards",
    icon: CreditCard,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    title: "Credit Cards",
    desc: "Find the best rewards card for your spending pattern.",
    features: ["5% cashback on fuel", "Airport lounge access", "Zero annual fee options"],
    cta: "Compare Cards",
    url: "https://economictimes.indiatimes.com/wealth/spend",
  },
  {
    id: "wealth_management",
    icon: TrendingUp,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    title: "Wealth Management",
    desc: "Dedicated advisors for HNI portfolios above ₹50 Lakhs.",
    features: ["SEBI-registered advisors", "Personalized portfolio", "Tax-optimized returns"],
    cta: "Book Consultation",
    url: "https://economictimes.indiatimes.com/wealth",
  },
];

export default function FinancialServicesPage() {
  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-400" /> ET Financial Services
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Loans, insurance, credit cards & wealth management</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {services.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
              </div>
              <div className="space-y-1.5 mb-4">
                {s.features.map((f, fi) => (
                  <div key={fi} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">{f}</p>
                  </div>
                ))}
              </div>
              <a href={s.url} target="_blank" rel="noopener noreferrer"
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 ${s.bg} ${s.color} border border-current/20`}>
                {s.cta} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Trust bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <p className="text-xs text-center text-muted-foreground font-medium uppercase tracking-wider mb-3">Trusted Partners</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-muted-foreground">
            {["HDFC Bank", "ICICI Bank", "SBI", "Bajaj Finance", "LIC", "HDFC Life", "Axis Bank", "Kotak"].map((p, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-muted">{p}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
