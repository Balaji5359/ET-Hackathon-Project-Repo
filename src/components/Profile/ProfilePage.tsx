import { motion } from "framer-motion";
import { Mail, Shield, Bell, LogOut } from "lucide-react";
import AiAvatar from "../Chat/AiAvatar";

const ProfilePage = () => {
  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          <div className="animate-float">
            <AiAvatar size="lg" />
          </div>
          <h2 className="font-display text-2xl font-bold mt-4">Alex Johnson</h2>
          <p className="text-sm text-muted-foreground">alex.johnson@email.com</p>
          <span className="mt-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            ET Prime Member
          </span>
        </motion.div>

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
            <button
              key={i}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </button>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </motion.button>
      </div>
    </div>
  );
};

export default ProfilePage;
