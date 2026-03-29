import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import AiAvatar from "./AiAvatar";
import { cn } from "@/lib/utils";
const MessageBubble = ({ message, index }) => {
    const isUser = message.role === "user";
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05, duration: 0.3 }, className: cn("flex gap-3 max-w-[85%]", isUser ? "ml-auto flex-row-reverse" : ""), children: [!isUser && _jsx(AiAvatar, { size: "sm" }), _jsxs("div", { children: [_jsx("div", { className: cn("px-4 py-3 rounded-2xl text-sm leading-relaxed", isUser
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-card border border-border rounded-bl-md shadow-card"), children: message.content }), message.actions && message.actions.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: message.actions.map((action, i) => (_jsxs("a", { href: action.url, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-accent/15 text-accent-foreground border border-accent/30 hover:bg-accent/25 transition-colors", children: [action.label, " \u2192"] }, i))) })), _jsx("p", { className: cn("text-[10px] mt-1 text-muted-foreground", isUser ? "text-right" : ""), children: message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })] })] }));
};
export default MessageBubble;
