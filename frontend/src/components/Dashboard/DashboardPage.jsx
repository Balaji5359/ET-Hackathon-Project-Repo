import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target, Shield, Star, Briefcase, RefreshCw, Loader2, ExternalLink, Zap } from "lucide-react";
import { getRecommendations, refreshRecommendations } from "@/lib/api";
import aiAvatar from "@/assets/ai-avatar.png";
const CATEGORY_ICONS = {
    "ET Prime": Star,
    "ET Markets": TrendingUp,
    "Masterclasses": Target,
    "Wealth Summits": Briefcase,
    "Corporate Events": Briefcase,
    "Financial Services": Shield,
};
const CATEGORY_COLORS = {
    "ET Prime": { text: "text-accent", bg: "bg-accent/10" },
    "ET Markets": { text: "text-primary", bg: "bg-primary/10" },
    "Masterclasses": { text: "text-violet-400", bg: "bg-violet-400/10" },
    "Wealth Summits": { text: "text-amber-400", bg: "bg-amber-400/10" },
    "Corporate Events": { text: "text-blue-400", bg: "bg-blue-400/10" },
    "Financial Services": { text: "text-emerald-400", bg: "bg-emerald-400/10" },
};
export default function DashboardPage({ profile, onNavigate, onRefresh }) {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        loadRecommendations();
    }, []);
    const loadRecommendations = async () => {
        try {
            const data = await getRecommendations();
            setRecommendations(data.recommendations || []);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    };
    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const data = await refreshRecommendations();
            setRecommendations(data.recommendations || []);
            onRefresh();
        }
        catch (e) {
            console.error(e);
        }
        finally {
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
    return (_jsx("div", { className: "h-full overflow-y-auto px-4 md:px-8 py-6", children: _jsxs("div", { className: "max-w-5xl mx-auto space-y-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "flex items-center gap-4", children: [_jsx("div", { className: "w-14 h-14 rounded-full overflow-hidden border-2 border-primary/40 shadow-glow flex-shrink-0", children: _jsx("img", { src: aiAvatar, alt: "ET AI", className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("h2", { className: "font-display text-xl md:text-2xl font-bold", children: ["Welcome back, ", _jsx("span", { className: "text-gradient-primary", children: displayName })] }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Your personalized ET ecosystem map" })] }), _jsxs("button", { onClick: handleRefresh, disabled: refreshing, className: "flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-all disabled:opacity-50", children: [_jsx(RefreshCw, { className: `w-4 h-4 ${refreshing ? "animate-spin" : ""}` }), _jsx("span", { className: "hidden sm:inline", children: "Refresh AI" })] })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.05 }, className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
                        { label: "User Type", value: userType, icon: Zap, color: "text-primary" },
                        { label: "Financial Score", value: `${financialScore}/100`, icon: TrendingUp, color: "text-emerald-400" },
                        { label: "Experience", value: p?.investmentExperience || "—", icon: Target, color: "text-accent" },
                        { label: "Risk Level", value: p?.riskAppetite || "—", icon: Shield, color: "text-violet-400" },
                    ].map((stat, i) => (_jsxs("div", { className: "bg-card border border-border rounded-2xl p-4 shadow-card", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(stat.icon, { className: `w-4 h-4 ${stat.color}` }), _jsx("p", { className: "text-[10px] font-medium text-muted-foreground uppercase tracking-wider", children: stat.label })] }), _jsx("p", { className: "text-sm font-bold capitalize", children: stat.value })] }, i))) }), p && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "bg-card border border-border rounded-2xl p-5 shadow-card", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "font-display text-base font-semibold", children: "Your Financial Profile" }), _jsx("button", { onClick: () => onNavigate("chat"), className: "text-xs text-primary hover:underline", children: "Update via Chat \u2192" })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3 mb-4", children: [
                                { label: "Profession", value: p.profession },
                                { label: "Income Range", value: p.incomeRange },
                                { label: "Experience", value: p.investmentExperience },
                            ].filter(x => x.value).map((item, i) => (_jsxs("div", { className: "p-3 rounded-xl bg-muted", children: [_jsx("p", { className: "text-[10px] text-muted-foreground font-medium uppercase tracking-wider", children: item.label }), _jsx("p", { className: "text-sm font-semibold mt-0.5 capitalize", children: item.value })] }, i))) }), p.financialGoals && p.financialGoals.length > 0 && (_jsxs("div", { className: "flex flex-wrap gap-2", children: [p.financialGoals.map((goal, i) => (_jsx("span", { className: "px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20", children: goal }, i))), p.needs?.map((need, i) => (_jsx("span", { className: "px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent-foreground border border-accent/20", children: need }, `n${i}`)))] }))] })), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "font-display text-base font-semibold", children: "AI Recommendations for You" }), loading && _jsx(Loader2, { className: "w-4 h-4 animate-spin text-muted-foreground" })] }), loading ? (_jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: Array.from({ length: 4 }).map((_, i) => (_jsx("div", { className: "bg-card border border-border rounded-2xl p-5 h-36 animate-pulse" }, i))) })) : (_jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: recommendations.map((rec, i) => {
                                const Icon = CATEGORY_ICONS[rec.category] || Star;
                                const colors = CATEGORY_COLORS[rec.category] || { text: "text-primary", bg: "bg-primary/10" };
                                return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 + i * 0.05 }, whileHover: { y: -3 }, className: "bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-elevated transition-all group cursor-pointer", onClick: () => window.open(rec.url, "_blank"), children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsx("div", { className: `w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center`, children: _jsx(Icon, { className: `w-4 h-4 ${colors.text}` }) }), rec.relevanceScore && (_jsxs("span", { className: "text-[10px] font-semibold text-muted-foreground", children: [Math.round(rec.relevanceScore * 100), "% match"] }))] }), _jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: rec.category }), _jsx("h4", { className: "text-sm font-bold mt-1 group-hover:text-primary transition-colors", children: rec.title }), _jsx("p", { className: "text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2", children: rec.description }), _jsxs("div", { className: "mt-3 flex items-center gap-1 text-xs font-medium text-primary", children: [rec.cta, " ", _jsx(ExternalLink, { className: "w-3 h-3" })] })] }, i));
                            }) }))] }), _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.4 }, className: "bg-gradient-primary rounded-2xl p-6 text-primary-foreground", children: [_jsx("h3", { className: "font-display text-lg font-bold", children: "Want more personalized guidance?" }), _jsx("p", { className: "text-sm opacity-80 mt-1", children: "Chat with your AI Concierge to refine your profile and get better recommendations." }), _jsx("button", { onClick: () => onNavigate("chat"), className: "mt-4 px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-semibold transition-all", children: "Open AI Chat \u2192" })] })] }) }));
}
