import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import aiAvatar from "@/assets/ai-avatar.png";

const greetingText =
  "Welcome! I'm your ET AI Concierge — your personalized guide to the Economic Times ecosystem. Tell me about your financial goals and I'll find the perfect products for you.";

const mockResponses = [
  "That's a great goal! Based on your interest in growth investing, I'd recommend exploring ET Markets for real-time insights and ET Prime for expert analysis. Would you like me to walk you through the benefits?",
  "Excellent choice! For someone at your level, I suggest starting with our curated watchlists on ET Markets. Combined with ET Masterclass sessions on portfolio management, you'll have a solid foundation. Shall I set that up?",
  "Perfect! I've noted your preferences. Let me put together a personalized dashboard with the ET products that match your profile. You'll get real-time alerts, expert commentary, and exclusive research reports.",
];

const AvatarScene = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [input, setInput] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [micActive, setMicActive] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(
    Array(24).fill(0)
  );
  const [hasGreeted, setHasGreeted] = useState(false);

  // Simulate audio visualizer when speaking
  useEffect(() => {
    if (!isSpeaking) {
      setVisualizerBars(Array(24).fill(0));
      return;
    }
    const interval = setInterval(() => {
      setVisualizerBars(
        Array(24)
          .fill(0)
          .map(() => Math.random() * 0.6 + 0.15)
      );
    }, 80);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Typewriter effect
  useEffect(() => {
    if (!currentText) return;
    setDisplayedText("");
    setIsSpeaking(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < currentText.length) {
        setDisplayedText(currentText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsSpeaking(false), 600);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [currentText]);

  // Auto-greet on mount
  useEffect(() => {
    if (!hasGreeted) {
      const timer = setTimeout(() => {
        setCurrentText(greetingText);
        setHasGreeted(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [hasGreeted]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    setInput("");
    setDisplayedText("");
    setTimeout(() => {
      const resp = mockResponses[messageIndex % mockResponses.length];
      setCurrentText(resp);
      setMessageIndex((i) => i + 1);
    }, 800);
  }, [input, messageIndex]);

  return (
    <div className="flex flex-col h-full bg-gradient-dark relative overflow-hidden">
      {/* Background ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Main avatar area */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-4">
        {/* Outer pulsing rings */}
        <div className="relative flex items-center justify-center">
          {[180, 220, 260].map((size, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-primary/20"
              style={{ width: size, height: size }}
              animate={
                isSpeaking
                  ? {
                      scale: [1, 1.08 + i * 0.03, 1],
                      opacity: [0.15, 0.35, 0.15],
                    }
                  : {
                      scale: [1, 1.02, 1],
                      opacity: [0.1, 0.2, 0.1],
                    }
              }
              transition={{
                duration: isSpeaking ? 1.2 + i * 0.2 : 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
          ))}

          {/* Audio visualizer ring */}
          <div className="absolute" style={{ width: 200, height: 200 }}>
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              style={{ transform: "rotate(-90deg)" }}
            >
              {visualizerBars.map((val, i) => {
                const angle = (i / 24) * 360;
                const radians = (angle * Math.PI) / 180;
                const innerR = 72;
                const barH = val * 28;
                const x1 = 100 + innerR * Math.cos(radians);
                const y1 = 100 + innerR * Math.sin(radians);
                const x2 = 100 + (innerR + barH) * Math.cos(radians);
                const y2 = 100 + (innerR + barH) * Math.sin(radians);
                return (
                  <motion.line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeOpacity={0.7}
                    initial={false}
                    animate={{ x2, y2 }}
                    transition={{ duration: 0.08 }}
                  />
                );
              })}
            </svg>
          </div>

          {/* Avatar container */}
          <motion.div
            className="relative z-10"
            animate={
              isSpeaking
                ? { scale: [1, 1.04, 1] }
                : {}
            }
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-primary/40 shadow-glow relative">
              <img
                src={aiAvatar}
                alt="ET AI Concierge"
                className="w-full h-full object-cover"
                width={512}
                height={512}
              />
              {/* Speaking glow overlay */}
              <AnimatePresence>
                {isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, hsl(174 72% 40% / 0.15) 0%, transparent 70%)",
                    }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Status indicator */}
            <motion.div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center"
              style={{
                backgroundColor: isSpeaking
                  ? "hsl(var(--primary))"
                  : "hsl(var(--muted-foreground))",
              }}
              animate={
                isSpeaking
                  ? { scale: [1, 1.3, 1] }
                  : {}
              }
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <Volume2 className="w-2.5 h-2.5 text-primary-foreground" />
            </motion.div>
          </motion.div>
        </div>

        {/* Avatar label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <h2 className="font-display text-lg md:text-xl font-bold text-foreground">
            <span className="text-gradient-primary">ET</span> AI Concierge
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {isSpeaking ? "Speaking..." : "Ready to assist"}
          </p>
        </motion.div>

        {/* Speech bubble / transcript */}
        <AnimatePresence mode="wait">
          {displayedText && (
            <motion.div
              key={currentText}
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              className="mt-6 max-w-lg mx-auto"
            >
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl px-5 py-4 shadow-card relative">
                {/* Triangle pointing up */}
                <div
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-card/80 border-l border-t border-border"
                />
                <p className="text-sm md:text-base text-foreground/90 leading-relaxed relative z-10">
                  {displayedText}
                  {isSpeaking && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle"
                    />
                  )}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm px-4 md:px-8 py-4">
        <div className="flex items-center gap-2 max-w-2xl mx-auto">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            title={voiceEnabled ? "Disable voice" : "Enable voice"}
          >
            {voiceEnabled ? (
              <Volume2 className="w-5 h-5 text-primary" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setMicActive(!micActive)}
            className={`p-2.5 rounded-xl transition-all ${
              micActive
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title="Voice input"
          >
            {micActive ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5" />
            )}
          </button>
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything..."
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

export default AvatarScene;
