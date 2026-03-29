import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Volume2, VolumeX } from "lucide-react";
import AiAvatar from "./AiAvatar";
import MessageBubble from "./MessageBubble";
import OnboardingBanner from "./OnboardingBanner";
const initialMessages = [
    {
        id: "1",
        role: "assistant",
        content: "Welcome to ET AI Concierge! 👋 I'm your personalized guide to the Economic Times ecosystem. Let me help you discover the perfect ET products and financial services for your needs. To get started, could you tell me about your primary financial goals?",
        timestamp: new Date(),
    },
];
const mockResponses = [
    {
        content: "That's great! Understanding your goals helps me tailor recommendations. You mentioned growth-oriented investments. Could you tell me about your investment experience level? Are you a beginner, intermediate, or experienced investor?",
        actions: [],
    },
    {
        content: "Excellent! Based on what you've shared, I can see you'd benefit from real-time market insights. Let me ask — what's your approximate annual income range? This helps me suggest appropriate financial products.",
        actions: [{ label: "Explore ET Markets", url: "#" }],
    },
    {
        content: "Perfect! I'm building your financial profile. You seem like someone who values informed decision-making. One last question — are you currently using any ET products like ET Prime, ET Markets, or have you attended any ET masterclasses?",
        actions: [
            { label: "ET Prime", url: "#" },
            { label: "ET Masterclass", url: "#" },
        ],
    },
];
const ChatWindow = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [onboardingStep, setOnboardingStep] = useState(1);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, isTyping]);
    const handleSend = () => {
        if (!input.trim())
            return;
        const userMsg = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);
        const responseIdx = Math.min(onboardingStep - 1, mockResponses.length - 1);
        setTimeout(() => {
            const mock = mockResponses[responseIdx];
            const aiMsg = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: mock.content,
                actions: mock.actions,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
            setOnboardingStep((s) => Math.min(s + 1, 5));
        }, 1500);
    };
    return (_jsxs("div", { className: "flex flex-col h-full", children: [_jsx(OnboardingBanner, { step: onboardingStep, totalSteps: 5 }), _jsxs("div", { ref: scrollRef, className: "flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5", children: [_jsx(AnimatePresence, { children: messages.map((msg, i) => (_jsx(MessageBubble, { message: msg, index: i }, msg.id))) }), isTyping && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "flex items-center gap-3", children: [_jsx(AiAvatar, { size: "sm", isTyping: true }), _jsx("div", { className: "bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-card", children: _jsx("div", { className: "flex gap-1.5", children: [0, 1, 2].map((i) => (_jsx(motion.div, { className: "w-2 h-2 rounded-full bg-primary/60", animate: { y: [0, -6, 0] }, transition: { repeat: Infinity, duration: 0.6, delay: i * 0.15 } }, i))) }) })] }))] }), _jsx("div", { className: "border-t border-border bg-card px-4 md:px-8 py-4", children: _jsxs("div", { className: "flex items-center gap-2 max-w-3xl mx-auto", children: [_jsx("button", { onClick: () => setVoiceEnabled(!voiceEnabled), className: "p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all", title: voiceEnabled ? "Disable voice output" : "Enable voice output", children: voiceEnabled ? _jsx(Volume2, { className: "w-5 h-5 text-primary" }) : _jsx(VolumeX, { className: "w-5 h-5" }) }), _jsx("button", { className: "p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all", title: "Voice input", children: _jsx(Mic, { className: "w-5 h-5" }) }), _jsx("div", { className: "flex-1 relative", children: _jsx("input", { ref: inputRef, value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleSend(), placeholder: "Type your message...", className: "w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all" }) }), _jsx(motion.button, { whileTap: { scale: 0.95 }, onClick: handleSend, disabled: !input.trim(), className: "p-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-glow", children: _jsx(Send, { className: "w-5 h-5" }) })] }) })] }));
};
export default ChatWindow;
