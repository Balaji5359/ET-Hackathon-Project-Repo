import { motion } from "framer-motion";
import { Mail, Shield, Bell, LogOut, User, TrendingUp, Target, CheckCircle2, RefreshCw } from "lucide-react";
import { type ProfileResponse } from "@/lib/api";
import aiAvatar from "@/assets/ai-avatar.png";

interface ProfilePageProps {
  email: string;
  profile: ProfileResponse | null;
  onSignOut: () => void;
  onRefresh: () => void;
}

export default function ProfilePage({ email, profile, onSignOut, onRefresh }: ProfilePageProps) {
  const p = profile?.profile;
  const displayName = email.split("@")[0] || "User";
  const userType = p?.userType || "New User";
  const onboardingComplete = profile?.onboardingComplete ?? false;

  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-6">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Avatar + name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/40 shadow-glow">
              <img src={aiAvatar} alt="ET AI" className="w-full h-full object-cover" />
            </div>
            {onboardingComplete && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
          <h2 className="font-display text-2xl font-bold mt-4 capitalize">{displayName}</h2>
          <p className="text-sm text-muted-foreground">{email}</p>
          <span className="mt-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {userType}
          </span>
          {onboardingComplete && (
            <span className="mt-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              ✓ Profile Complete
            </span>
          )}
        </motion.div>

        {/* Profile details */}
        {p && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card border border-border rounded-2xl p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-semibold">Financial Profile</h3>
              <button onClick={onRefresh} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { icon: User, label: "Profession", value: p.profession },
                { icon: TrendingUp, label: "Experience", value: p.investmentExperience },
                { icon: Target, label: "Risk Appetite", value: p.riskAppetite },
                { icon: Shield, label: "Income Range", value: p.incomeRange },
              ].filter(x => x.value).map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-semibold capitalize">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {p.financialGoals && p.financialGoals.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-2">Financial Goals</p>
                <div className="flex flex-wrap gap-2">
                  {p.financialGoals.map((goal, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {!p && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card border border-border rounded-2xl p-6 text-center shadow-card"
          >
            <p className="text-sm text-muted-foreground">Complete the AI onboarding chat to build your profile.</p>
          </motion.div>
        )}

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl divide-y divide-border shadow-card"
        >
          {[
            { icon: Mail, label: "Email Notifications", desc: "Receive daily market updates" },
            { icon: Shield, label: "Privacy & Security", desc: "Manage your data preferences" },
            { icon: Bell, label: "Push Notifications", desc: "Get alerts on price changes" },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors text-left">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                <item.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Sign out */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </motion.button>
      </div>
    </div>
  );
}
