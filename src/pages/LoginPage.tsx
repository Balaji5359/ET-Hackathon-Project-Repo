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

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/8"
            style={{
              width: Math.random() * 10 + 4,
              height: Math.random() * 10 + 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, -50, 0], opacity: [0.1, 0.4, 0.1] }}
            transition={{
              duration: Math.random() * 6 + 5,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* Left — branding */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            {/* Avatar */}
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/50 shadow-glow mx-auto md:mx-0">
                  <img src={aiAvatar} alt="ET AI Concierge" className="w-full h-full object-cover" />
                </div>
                <motion.div
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary border-2 border-background flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Zap className="w-3.5 h-3.5 text-primary-foreground" />
                </motion.div>
              </div>
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
              <span className="text-gradient-primary">ET</span> AI
              <br />Concierge
            </h1>
            <p className="text-muted-foreground mt-3 text-base leading-relaxed max-w-sm mx-auto md:mx-0">
              Your personalized AI guide to the Economic Times ecosystem. Understand your goals, build your profile, and navigate to the right products.
            </p>

            {/* Features */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-start gap-2 p-3 rounded-xl bg-card/40 border border-border/50 backdrop-blur-sm"
                >
                  <f.icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{f.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — login card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-card border border-border rounded-2xl p-8 shadow-elevated backdrop-blur-sm">
              <div className="text-center mb-6">
                <h2 className="font-display text-2xl font-bold">Get Started</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Sign in with your Amazon Cognito account
                </p>
              </div>

              {/* Sign in button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSignIn}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60 transition-all shadow-glow"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Sign in with Cognito
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                New user? You can create an account on the next screen.
              </p>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">secured by</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Amazon Cognito", sub: "Authentication" },
                  { label: "Amazon Bedrock", sub: "AI Engine" },
                  { label: "AWS Lambda", sub: "Backend" },
                ].map((b, i) => (
                  <div key={i} className="p-2 rounded-lg bg-muted">
                    <p className="text-[10px] font-semibold text-foreground">{b.label}</p>
                    <p className="text-[9px] text-muted-foreground">{b.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
