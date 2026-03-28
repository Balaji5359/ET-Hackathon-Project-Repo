import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, LayoutDashboard, User, Menu, X, LogOut,
  TrendingUp, Star, Target, Briefcase, Shield, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppTab } from "@/pages/MainApp";
import aiAvatar from "@/assets/ai-avatar.png";

interface AppShellProps {
  children: React.ReactNode;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  email: string;
  userType?: string;
  onboardingComplete: boolean;
  onSignOut: () => void;
}

const mainNav = [
  { id: "chat" as AppTab, label: "AI Chat", icon: MessageSquare },
  { id: "dashboard" as AppTab, label: "Dashboard", icon: LayoutDashboard },
];

const serviceNav = [
  { id: "markets" as AppTab, label: "ET Markets", icon: TrendingUp },
  { id: "prime" as AppTab, label: "ET Prime", icon: Star },
  { id: "masterclass" as AppTab, label: "Masterclasses", icon: Target },
  { id: "wealth_summit" as AppTab, label: "Wealth Summit", icon: Briefcase },
  { id: "financial_services" as AppTab, label: "Financial Services", icon: Shield },
];

const bottomNav = [
  { id: "profile" as AppTab, label: "Profile", icon: User },
];

const mobileNav = [
  { id: "chat" as AppTab, label: "Chat", icon: MessageSquare },
  { id: "dashboard" as AppTab, label: "Dashboard", icon: LayoutDashboard },
  { id: "markets" as AppTab, label: "Markets", icon: TrendingUp },
  { id: "prime" as AppTab, label: "Prime", icon: Star },
  { id: "profile" as AppTab, label: "Profile", icon: User },
];

function NavBtn({ item, active, onClick }: { item: { id: AppTab; label: string; icon: any }; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
        active
          ? "bg-sidebar-accent text-sidebar-primary"
          : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/40"
      )}
    >
      <item.icon className="w-4 h-4 flex-shrink-0" />
      <span className="truncate">{item.label}</span>
      {active && <motion.div layoutId="nav-dot" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
    </button>
  );
}

export default function AppShell({ children, activeTab, onTabChange, email, userType, onboardingComplete, onSignOut }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const displayName = email.split("@")[0] || "User";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-56 bg-sidebar border-r border-sidebar-border flex-shrink-0">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/40 shadow-glow flex-shrink-0">
              <img src={aiAvatar} alt="ET AI" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-display text-sm font-bold text-sidebar-foreground leading-tight">
                <span className="text-gradient-primary">ET</span> Concierge
              </h1>
              <p className="text-[9px] text-muted-foreground">AI Financial Guide</p>
            </div>
          </div>
        </div>

        {/* User chip */}
        <div className="px-3 py-2.5 border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-sidebar-accent/40">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold flex-shrink-0">
              {displayName[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-sidebar-foreground truncate">{displayName}</p>
              {userType && <p className="text-[9px] text-primary truncate">{userType}</p>}
            </div>
            {onboardingComplete && <Sparkles className="w-3 h-3 text-accent flex-shrink-0" />}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {mainNav.map(item => <NavBtn key={item.id} item={item} active={activeTab === item.id} onClick={() => onTabChange(item.id)} />)}

          <div className="pt-3 pb-1 px-1">
            <p className="text-[9px] font-semibold text-sidebar-foreground/30 uppercase tracking-widest">Services</p>
          </div>
          {serviceNav.map(item => <NavBtn key={item.id} item={item} active={activeTab === item.id} onClick={() => onTabChange(item.id)} />)}

          <div className="pt-3 pb-1 px-1">
            <p className="text-[9px] font-semibold text-sidebar-foreground/30 uppercase tracking-widest">Account</p>
          </div>
          {bottomNav.map(item => <NavBtn key={item.id} item={item} active={activeTab === item.id} onClick={() => onTabChange(item.id)} />)}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-sidebar-border space-y-1">
          <div className="px-3 py-2 rounded-lg bg-sidebar-accent/30">
            <p className="text-[9px] text-sidebar-foreground/40">Powered by</p>
            <p className="text-[10px] font-semibold text-sidebar-foreground">Amazon Nova AI</p>
          </div>
          <button onClick={onSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile layout ── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-primary/40">
              <img src={aiAvatar} alt="ET AI" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-display text-base font-bold">
              <span className="text-gradient-primary">ET</span> Concierge
            </h1>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-muted transition-colors">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="md:hidden absolute top-14 left-0 right-0 z-50 bg-card border-b border-border shadow-elevated p-3 space-y-1">
              {[...mainNav, ...serviceNav, ...bottomNav].map(item => (
                <button key={item.id} onClick={() => { onTabChange(item.id); setMobileOpen(false); }}
                  className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                    activeTab === item.id ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted")}>
                  <item.icon className="w-4 h-4" />{item.label}
                </button>
              ))}
              <button onClick={onSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-all">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <main className="flex-1 overflow-hidden">{children}</main>

        {/* Mobile bottom tabs */}
        <nav className="md:hidden flex border-t border-border bg-card">
          {mobileNav.map(item => (
            <button key={item.id} onClick={() => onTabChange(item.id)}
              className={cn("flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors",
                activeTab === item.id ? "text-primary" : "text-muted-foreground")}>
              <item.icon className="w-4 h-4" />
              <span className="text-[9px] font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
