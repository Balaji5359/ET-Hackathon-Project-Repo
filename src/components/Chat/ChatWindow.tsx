import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Volume2, VolumeX } from "lucide-react";
import AiAvatar from "./AiAvatar";
import MessageBubble, { type Message } from "./MessageBubble";
import OnboardingBanner from "./OnboardingBanner";

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Welcome to ET AI Concierge! 👋 I'm your personalized guide to the Economic Times ecosystem. Let me help you discover the perfect ET products and financial services for your needs. To get started, could you tell me about your primary financial goals?",
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
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
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
      const aiMsg: Message = {
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

  return (
    <div className="flex flex-col h-full">
      <OnboardingBanner step={onboardingStep} totalSteps={5} />

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <MessageBubble key={msg.id} message={msg} index={i} />
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <AiAvatar size="sm" isTyping />
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-card">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary/60"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-border bg-card px-4 md:px-8 py-4">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            title={voiceEnabled ? "Disable voice output" : "Enable voice output"}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5 text-primary" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            title="Voice input"
          >
            <Mic className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-glow"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
