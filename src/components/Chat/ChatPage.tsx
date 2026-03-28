import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Square, Volume2, VolumeX, Loader2, ArrowRight, ExternalLink } from "lucide-react";
import { v4 as uuid } from "uuid";
import aiAvatar from "@/assets/ai-avatar.png";
import { sendChat, TARGET_TO_TAB, type Action, type ProfileResponse } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: Action[];
  userType?: string;
  timestamp: Date;
}

interface ChatPageProps {
  userId: string;
  email: string;
  profile: ProfileResponse | null;
  onOnboardingComplete: () => void;
  onNavigate: (target: string) => void;
}

const ONBOARDING_GREETING =
  "Hi 👋 I'm your ET AI Concierge! I'm here to understand your financial goals and guide you to the right ET products. Let's start — what's your profession? (Student / Working Professional / Business Owner)";

const RETURNING_GREETING =
  "Welcome back! 👋 I remember your profile. How can I help you today? Ask me about markets, investments, or any ET product.";

// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function ChatPage({ userId, email, profile, onOnboardingComplete, onNavigate }: ChatPageProps) {
  const isOnboarding = !profile?.onboardingComplete;
  const [messages, setMessages] = useState<Message[]>([{
    id: "greeting",
    role: "assistant",
    content: isOnboarding ? ONBOARDING_GREETING : RETURNING_GREETING,
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  // TTS on by default; STT starts when we successfully start recognition.
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  // STT off by default; user taps mic to start.
  const [isListening, setIsListening] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [conversationId] = useState(() => uuid());

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Check STT support
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSttSupported(!!SR);
    if (SR) {
      const rec = new SR();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-IN";
      rec.onresult = (e: any) => {
        const transcript = Array.from(e.results)
          .map((r: any) => r[0].transcript)
          .join("");
        setInput(transcript);
      };
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const toggleMic = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;
    if (isListening) {
      rec.stop();
      setIsListening(false);
    } else {
      setInput("");
      try {
        rec.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  }, [isListening]);

  const playAudio = useCallback((url: string) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play().catch(() => {});
  }, []);

  const speakText = useCallback((text: string) => {
    if (!voiceEnabled || !text) return;
    // Use browser TTS as fallback when no audioUrl
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = "en-IN";
      utt.rate = 0.95;
      window.speechSynthesis.speak(utt);
    }
  }, [voiceEnabled]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    // Stop mic if active
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); }

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const data = await sendChat(text, conversationId, voiceEnabled);
      const reply = data.reply || data.response || "I'm here to help!";

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        actions: data.actions || [],
        userType: data.user_type,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setOnboardingStep(s => s + 1);

      // TTS
      if (data.audioUrl && voiceEnabled) {
        playAudio(data.audioUrl);
      } else if (voiceEnabled) {
        speakText(reply);
      }

      if (data.onboardingComplete && isOnboarding) {
        setTimeout(() => onOnboardingComplete(), 1800);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${err.message}. Please try again.`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }, [input, isTyping, isListening, conversationId, voiceEnabled, isOnboarding, onOnboardingComplete, playAudio, speakText]);

  const handleAction = (action: Action) => {
    const tab = TARGET_TO_TAB[action.target];
    if (tab) {
      onNavigate(tab);
    } else {
      window.open(action.url, "_blank");
    }
  };

  const totalSteps = 4;
  const progress = Math.min((onboardingStep / totalSteps) * 100, 100);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Onboarding progress */}
      {isOnboarding && onboardingStep < totalSteps && (
        <div className="px-4 md:px-8 py-2.5 border-b border-border bg-primary/5">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <div>
              <p className="text-xs font-semibold text-primary">Building your profile</p>
              <p className="text-[11px] text-muted-foreground">Step {onboardingStep + 1} of {totalSteps}</p>
            </div>
            <div className="w-28 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-5 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse ml-auto max-w-[78%]" : "max-w-[88%]"}`}>

              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30 flex-shrink-0 shadow-glow mt-0.5">
                  <img src={aiAvatar} alt="ET AI" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                {msg.userType && msg.role === "assistant" && (
                  <span className="text-[10px] font-semibold text-primary/60 px-1">
                    Identified as: {msg.userType}
                  </span>
                )}

                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border rounded-bl-sm shadow-card"
                }`}>
                  {msg.content}
                </div>

                {/* Action buttons — navigate to pages */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-col gap-1.5 mt-0.5">
                    {msg.actions.map((action, ai) => (
                      <motion.button key={ai} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ai * 0.08 }}
                        onClick={() => handleAction(action)}
                        className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-primary/8 border border-primary/20 hover:bg-primary/15 hover:border-primary/40 transition-all group text-left w-full">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">{action.title}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{action.description}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-[11px] font-semibold text-primary whitespace-nowrap">{action.cta}</span>
                          {TARGET_TO_TAB[action.target]
                            ? <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-0.5 transition-transform" />
                            : <ExternalLink className="w-3 h-3 text-primary" />
                          }
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                <p className={`text-[10px] text-muted-foreground ${msg.role === "user" ? "text-right" : ""}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30 flex-shrink-0">
              <img src={aiAvatar} alt="ET AI" className="w-full h-full object-cover" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-card">
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-2 h-2 rounded-full bg-primary/60"
                    animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.12 }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-border bg-card px-4 md:px-8 py-3">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          {/* TTS toggle */}
          <button onClick={() => { setVoiceEnabled(!voiceEnabled); if (voiceEnabled) window.speechSynthesis?.cancel(); }}
            className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex-shrink-0"
            title={voiceEnabled ? "Disable voice output" : "Enable voice output"}>
            {voiceEnabled ? <Volume2 className="w-5 h-5 text-primary" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* STT mic */}
          {sttSupported && (
            <button onClick={toggleMic}
              className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${isListening ? "bg-red-500/20 text-red-500 animate-pulse" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
              title={isListening ? "Stop listening" : "Start listening"}>
              {isListening ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={isListening ? "Listening..." : isOnboarding ? "Tell me about yourself..." : "Ask me anything..."}
            className="flex-1 px-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all" />

          <motion.button whileTap={{ scale: 0.95 }} onClick={handleSend} disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-glow flex-shrink-0">
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </motion.button>
        </div>

        {isListening && (
          <p className="text-center text-xs text-red-500 mt-1.5 animate-pulse">🎤 Listening... speak now</p>
        )}
      </div>
    </div>
  );
}
