import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import AppShell from "@/components/Layout/AppShell";
import ChatPage from "@/components/Chat/ChatPage";
import DashboardPage from "@/components/Dashboard/DashboardPage";
import ProfilePage from "@/components/Profile/ProfilePage";
import MarketsPage from "@/components/pages/MarketsPage";
import PrimePage from "@/components/pages/PrimePage";
import MasterclassPage from "@/components/pages/MasterclassPage";
import WealthSummitPage from "@/components/pages/WealthSummitPage";
import FinancialServicesPage from "@/components/pages/FinancialServicesPage";
import { getProfile, type ProfileResponse } from "@/lib/api";

export type AppTab =
  | "chat" | "dashboard" | "profile"
  | "markets" | "prime" | "masterclass"
  | "wealth_summit" | "corporate_events" | "financial_services";

interface MainAppProps {
  userId: string;
  email: string;
  onSignOut: () => void;
}

export default function MainApp({ userId, email, onSignOut }: MainAppProps) {
  const [activeTab, setActiveTab] = useState<AppTab>("chat");
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const p = await getProfile();
      setProfileData(p);
    } catch (e) {
      console.error("Profile load failed:", e);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleOnboardingComplete = () => {
    loadProfile();
    setActiveTab("dashboard");
  };

  // Allow AI chat actions to navigate to service pages
  const handleNavigate = (target: string) => {
    const validTabs: AppTab[] = ["chat","dashboard","profile","markets","prime","masterclass","wealth_summit","corporate_events","financial_services"];
    if (validTabs.includes(target as AppTab)) {
      setActiveTab(target as AppTab);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      email={email}
      userType={profileData?.profile?.userType}
      onboardingComplete={profileData?.onboardingComplete ?? false}
      onSignOut={onSignOut}
    >
      {activeTab === "chat" && (
        <ChatPage
          userId={userId}
          email={email}
          profile={profileData}
          onOnboardingComplete={handleOnboardingComplete}
          onNavigate={handleNavigate}
        />
      )}
      {activeTab === "dashboard" && (
        <DashboardPage profile={profileData} onNavigate={handleNavigate} onRefresh={loadProfile} />
      )}
      {activeTab === "profile" && (
        <ProfilePage email={email} profile={profileData} onSignOut={onSignOut} onRefresh={loadProfile} />
      )}
      {activeTab === "markets" && <MarketsPage />}
      {activeTab === "prime" && <PrimePage />}
      {activeTab === "masterclass" && <MasterclassPage />}
      {activeTab === "wealth_summit" && <WealthSummitPage />}
      {(activeTab === "financial_services" || activeTab === "corporate_events") && <FinancialServicesPage />}
    </AppShell>
  );
}
