import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useAuth } from "react-oidc-context";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Zap, Star, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import aiAvatar from "@/assets/ai-avatar.png";
const features = [
    { icon: Zap, title: "AI-Powered Onboarding", desc: "Smart profiling in under 3 minutes" },
    { icon: TrendingUp, title: "Personalized Recommendations", desc: "ET products matched to your goals" },
    { icon: Shield, title: "Intelligent Navigation", desc: "AI guides you to the right pages" },
    { icon: Star, title: "Dynamic Dashboard", desc: "Your financial ecosystem at a glance" },
];
export default function LoginPage() {
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const handleSignIn = () => {
        setLoading(true);
        auth.signinRedirect();
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-dark flex flex-col items-center justify-center p-4 relative overflow-hidden", children: [_jsxs("div", { className: "fixed inset-0 overflow-hidden pointer-events-none", children: [Array.from({ length: 18 }).map((_, i) => (_jsx(motion.div, { className: "absolute rounded-full bg-primary/8", style: {
                            width: Math.random() * 10 + 4,
                            height: Math.random() * 10 + 4,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }, animate: { y: [0, -50, 0], opacity: [0.1, 0.4, 0.1] }, transition: {
                            duration: Math.random() * 6 + 5,
                            repeat: Infinity,
                            delay: Math.random() * 4,
                        } }, i))), _jsx("div", { className: "absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" }), _jsx("div", { className: "absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl" })] }), _jsx("div", { className: "w-full max-w-4xl relative z-10", children: _jsxs("div", { className: "grid md:grid-cols-2 gap-8 items-center", children: [_jsxs(motion.div, { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.5 }, className: "text-center md:text-left", children: [_jsx(motion.div, { animate: { scale: [1, 1.04, 1] }, transition: { repeat: Infinity, duration: 3, ease: "easeInOut" }, className: "inline-block mb-6", children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-24 h-24 rounded-full overflow-hidden border-2 border-primary/50 shadow-glow mx-auto md:mx-0", children: _jsx("img", { src: aiAvatar, alt: "ET AI Concierge", className: "w-full h-full object-cover" }) }), _jsx(motion.div, { className: "absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary border-2 border-background flex items-center justify-center", animate: { scale: [1, 1.2, 1] }, transition: { repeat: Infinity, duration: 1.5 }, children: _jsx(Zap, { className: "w-3.5 h-3.5 text-primary-foreground" }) })] }) }), _jsxs("h1", { className: "font-display text-4xl md:text-5xl font-bold text-foreground leading-tight", children: [_jsx("span", { className: "text-gradient-primary", children: "ET" }), " AI", _jsx("br", {}), "Concierge"] }), _jsx("p", { className: "text-muted-foreground mt-3 text-base leading-relaxed max-w-sm mx-auto md:mx-0", children: "Your personalized AI guide to the Economic Times ecosystem. Understand your goals, build your profile, and navigate to the right products." }), _jsx("div", { className: "mt-6 grid grid-cols-2 gap-3", children: features.map((f, i) => (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 + i * 0.08 }, className: "flex items-start gap-2 p-3 rounded-xl bg-card/40 border border-border/50 backdrop-blur-sm", children: [_jsx(f.icon, { className: "w-4 h-4 text-primary flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-foreground", children: f.title }), _jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: f.desc })] })] }, i))) })] }), _jsx(motion.div, { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.5, delay: 0.1 }, children: _jsxs("div", { className: "bg-card border border-border rounded-2xl p-8 shadow-elevated backdrop-blur-sm", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("h2", { className: "font-display text-2xl font-bold", children: "Get Started" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Sign in with your Amazon Cognito account" })] }), _jsx(motion.button, { whileTap: { scale: 0.98 }, onClick: handleSignIn, disabled: loading, className: "w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60 transition-all shadow-glow", children: loading ? (_jsx(Loader2, { className: "w-4 h-4 animate-spin" })) : (_jsxs(_Fragment, { children: ["Sign in with Cognito", _jsx(ArrowRight, { className: "w-4 h-4" })] })) }), _jsx("p", { className: "text-center text-xs text-muted-foreground mt-4", children: "New user? You can create an account on the next screen." }), _jsxs("div", { className: "my-5 flex items-center gap-3", children: [_jsx("div", { className: "flex-1 h-px bg-border" }), _jsx("span", { className: "text-xs text-muted-foreground", children: "secured by" }), _jsx("div", { className: "flex-1 h-px bg-border" })] }), _jsx("div", { className: "grid grid-cols-3 gap-2 text-center", children: [
                                            { label: "Amazon Cognito", sub: "Authentication" },
                                            { label: "Amazon Bedrock", sub: "AI Engine" },
                                            { label: "AWS Lambda", sub: "Backend" },
                                        ].map((b, i) => (_jsxs("div", { className: "p-2 rounded-lg bg-muted", children: [_jsx("p", { className: "text-[10px] font-semibold text-foreground", children: b.label }), _jsx("p", { className: "text-[9px] text-muted-foreground", children: b.sub })] }, i))) })] }) })] }) })] }));
}
