import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target, Shield, DollarSign, Star, Briefcase, RefreshCw, Loader2, ExternalLink, Zap } from "lucide-react";
import { getRecommendations, refreshRecommendations, type ProfileResponse, type Recommendation } from "@/lib/api";
import type { Tab } from "@/pages/MainApp";
import aiAvatar from "@/assets/ai-avatar.png";

interface DashboardPageProps {
  profile: ProfileResponse | null;
  onNavigate: (tab: Tab) => void;
  onRefresh: () => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  "ET Prime": Star,
  "ET Markets": TrendingUp,
  "Masterclasses": Target,
  "Wealth Summits": Briefcase,
  "Corporate Events": Briefcase,
  "Financial Services": Shield,
};

const CATEGORY_COLORS: Record<string, { text: string; bg: string }> = {
  "ET Prime": { text: "text-accent", bg: "bg-accent/10" },
  "ET Markets": { text: "text-primary", bg: "bg-primary/10" },
  "Masterclasses": { text: "text-violet-400", bg: "bg-violet-400/10" },
  "Wealth Summits": { text: "text-amber-400", bg: "bg-amber-400/10" },
  "Corporate Events": { text: "text-blue-400", bg: "bg-blue-400/10" },
  "Financial Services": { text: "text-emerald-400", bg: "bg-emerald-400/10" },
};

export default function DashboardPage({ profile, onNavigate, onRefresh }: DashboardPageProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const data = await getRecommendations();
      setRecommendations(data.recommendations || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await refreshRecommendations();
      setRecommendations(data.recommendations || []);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  const p = profile?.profile;
  const userType = p?.userType || "Financial Explorer";
  const displayName = profile?.email?.split("@")[0] || "User";

  // Financial score based on profile completeness
  const scoreFields = [p?.profession, p?.financialGoals?.length, p?.investmentExperience, p?.incomeRange, p?.riskAppetite];
  const filledFields = scoreFields.filter(Boolean).length;
  const financialScore = Math.round((filledFields / scoreFields.length) * 40 + 40);

  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/40 shadow-glow flex-shrink-0">
            <img src={aiAvatar} alt="ET AI" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-xl md:text-2xl font-bold">
              Welcome back, <span className="text-gradient-primary">{displayName}</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">Your personalized ET ecosystem map</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh AI</span>
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            { label: "User Type", value: userType, icon: Zap, color: "text-primary" },
            { label: "Financial Score", value: `${financialScore}/100`, icon: TrendingUp, color: "text-emerald-400" },
            { label: "Experience", value: p?.investmentExperience || "—", icon: Target, color: "text-accent" },
            { label: "Risk Level", value: p?.riskAppetite || "—", icon: Shield, color: "text-violet-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
              <p className="text-sm font-bold capitalize">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Profile summary */}
        {p && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-semibold">Your Financial Profile</h3>
              <button
                onClick={() => onNavigate("chat")}
                className="text-xs text-primary hover:underline"
              >
                Update via Chat →
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {[
                { label: "Profession", value: p.profession },
                { label: "Income Range", value: p.incomeRange },
                { label: "Experience", value: p.investmentExperience },
              ].filter(x => x.value).map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-muted">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-semibold mt-0.5 capitalize">{item.value}</p>
                </div>
              ))}
            </div>
            {p.financialGoals && p.financialGoals.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {p.financialGoals.map((goal, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {goal}
                  </span>
                ))}
                {p.needs?.map((need, i) => (
                  <span key={`n${i}`} className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent-foreground border border-accent/20">
                    {need}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Recommendations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold">AI Recommendations for You</h3>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-5 h-36 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec, i) => {
                const Icon = CATEGORY_ICONS[rec.category] || Star;
                const colors = CATEGORY_COLORS[rec.category] || { text: "text-primary", bg: "bg-primary/10" };
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    whileHover={{ y: -3 }}
                    className="bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-elevated transition-all group cursor-pointer"
                    onClick={() => window.open(rec.url, "_blank")}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${colors.text}`} />
                      </div>
                      {rec.relevanceScore && (
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          {Math.round(rec.relevanceScore * 100)}% match
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{rec.category}</p>
                    <h4 className="text-sm font-bold mt-1 group-hover:text-primary transition-colors">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">{rec.description}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
                      {rec.cta} <ExternalLink className="w-3 h-3" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA to chat */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-primary rounded-2xl p-6 text-primary-foreground"
        >
          <h3 className="font-display text-lg font-bold">Want more personalized guidance?</h3>
          <p className="text-sm opacity-80 mt-1">Chat with your AI Concierge to refine your profile and get better recommendations.</p>
          <button
            onClick={() => onNavigate("chat")}
            className="mt-4 px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-semibold transition-all"
          >
            Open AI Chat →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
