import { motion } from "framer-motion";
import { TrendingUp, Target, Shield, DollarSign, Star, Briefcase } from "lucide-react";
import AiAvatar from "../Chat/AiAvatar";

const profileData = {
  name: "Alex Johnson",
  goals: ["Wealth Building", "Retirement Planning"],
  experience: "Intermediate",
  riskAppetite: "Moderate",
  incomeRange: "₹15L - ₹30L",
  etProducts: ["ET Prime"],
  immediateNeeds: ["Tax Planning", "Equity Research"],
};

const recommendations = [
  {
    category: "ET Prime",
    title: "Premium Financial Insights",
    description: "Unlock deep-dive analysis, expert columns, and exclusive market intelligence.",
    icon: Star,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    category: "ET Markets",
    title: "Real-Time Market Data",
    description: "Track stocks, mutual funds, and commodities with AI-powered alerts.",
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    category: "Masterclass",
    title: "Investment Masterclass",
    description: "Learn equity research and portfolio management from top practitioners.",
    icon: Target,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    category: "Wealth Summit",
    title: "ET Wealth Summit 2026",
    description: "Network with 500+ HNIs and learn from India's top wealth managers.",
    icon: Briefcase,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    category: "Insurance",
    title: "Smart Term Insurance",
    description: "Partner offerings with exclusive ET reader discounts on term plans.",
    icon: Shield,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    category: "Tax Planning",
    title: "Tax-Saving Investments",
    description: "Curated ELSS funds and NPS strategies tailored to your income bracket.",
    icon: DollarSign,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const DashboardPage = () => {
  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <AiAvatar size="lg" />
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Your <span className="text-gradient-primary">ET Ecosystem</span> Map
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Personalized recommendations powered by your financial profile
            </p>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-card"
        >
          <h3 className="font-display text-lg font-semibold mb-4">Financial Profile</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Experience", value: profileData.experience },
              { label: "Risk Appetite", value: profileData.riskAppetite },
              { label: "Income Range", value: profileData.incomeRange },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-muted">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-semibold mt-1">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[...profileData.goals, ...profileData.immediateNeeds].map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Recommendations Grid */}
        <div>
          <h3 className="font-display text-lg font-semibold mb-4">Recommended for You</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-elevated transition-shadow cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-xl ${rec.bgColor} flex items-center justify-center mb-3`}>
                  <rec.icon className={`w-5 h-5 ${rec.color}`} />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{rec.category}</p>
                <h4 className="text-sm font-bold mt-1 group-hover:text-primary transition-colors">{rec.title}</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{rec.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
