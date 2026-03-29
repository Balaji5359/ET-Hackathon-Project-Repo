import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
const OnboardingBanner = ({ step, totalSteps }) => {
    const progress = Math.min((step / totalSteps) * 100, 100);
    const isComplete = step >= totalSteps;
    if (isComplete)
        return null;
    return (_jsx("div", { className: "px-4 md:px-8 py-3 border-b border-border bg-primary/5", children: _jsxs("div", { className: "flex items-center justify-between max-w-3xl mx-auto", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-primary", children: "Onboarding in progress" }), _jsxs("p", { className: "text-[11px] text-muted-foreground", children: ["Step ", step, " of ", totalSteps, " \u2014 Building your financial profile"] })] }), _jsx("div", { className: "w-24 h-1.5 rounded-full bg-muted overflow-hidden", children: _jsx(motion.div, { className: "h-full rounded-full bg-gradient-primary", initial: { width: 0 }, animate: { width: `${progress}%` }, transition: { duration: 0.5 } }) })] }) }));
};
export default OnboardingBanner;
