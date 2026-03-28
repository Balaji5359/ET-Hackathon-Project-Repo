import { motion } from "framer-motion";
import { Star, CheckCircle2, ExternalLink, BookOpen, TrendingUp, Users } from "lucide-react";

const articles = [
  { tag: "EXCLUSIVE", title: "Why FIIs are betting big on Indian midcaps in 2026", time: "2h ago", read: "5 min" },
  { tag: "ANALYSIS", title: "Budget 2026: What it means for your mutual fund portfolio", time: "4h ago", read: "8 min" },
  { tag: "INTERVIEW", title: "Nilesh Shah on where to invest the next ₹1 lakh", time: "6h ago", read: "6 min" },
  { tag: "DEEP DIVE", title: "The complete guide to NPS vs PPF vs ELSS for tax saving", time: "1d ago", read: "12 min" },
];

const benefits = [
  "Unlimited access to premium articles",
  "Expert columns from top fund managers",
  "Exclusive market intelligence reports",
  "Ad-free reading experience",
  "Early access to ET events",
];

export default function PrimePage() {
  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2">
              <Star className="w-6 h-6 text-accent" /> ET Prime
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Premium financial intelligence</p>
          </div>
          <a href="https://prime.economictimes.indiatimes.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-all">
            Start Free Trial <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* Hero banner */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-gradient-primary rounded-2xl p-6 text-primary-foreground">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold opacity-80">LIMITED OFFER</p>
              <h3 className="font-display text-2xl font-bold mt-1">3 Months Free</h3>
              <p className="text-sm opacity-80 mt-1">Then ₹299/month. Cancel anytime.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {benefits.slice(0, 3).map((b, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs bg-white/20 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> {b}
                  </span>
                ))}
              </div>
            </div>
            <Star className="w-16 h-16 opacity-20 flex-shrink-0" />
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: BookOpen, label: "Articles/month", value: "500+" },
            { icon: Users, label: "Prime members", value: "2M+" },
            { icon: TrendingUp, label: "Expert analysts", value: "50+" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-4 text-center shadow-card">
              <s.icon className="w-5 h-5 text-accent mx-auto mb-2" />
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Latest articles */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-display text-base font-semibold">Latest Premium Articles</h3>
          </div>
          <div className="divide-y divide-border">
            {articles.map((a, i) => (
              <div key={i} className="px-5 py-4 hover:bg-muted/40 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{a.tag}</span>
                  <span className="text-[10px] text-muted-foreground">{a.time} · {a.read} read</span>
                </div>
                <p className="text-sm font-semibold group-hover:text-primary transition-colors">{a.title}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-2xl p-5 shadow-card">
          <h3 className="font-display text-base font-semibold mb-3">What you get with ET Prime</h3>
          <div className="space-y-2">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <p className="text-sm">{b}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
