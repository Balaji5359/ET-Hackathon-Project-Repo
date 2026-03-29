import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { getProfile } from "@/lib/api";
export default function MainApp({ userId, email, onSignOut }) {
    const [activeTab, setActiveTab] = useState("chat");
    const [profileData, setProfileData] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    useEffect(() => { loadProfile(); }, []);
    const loadProfile = async () => {
        try {
            const p = await getProfile();
            setProfileData(p);
        }
        catch (e) {
            console.error("Profile load failed:", e);
        }
        finally {
            setLoadingProfile(false);
        }
    };
    const handleOnboardingComplete = () => {
        loadProfile();
        setActiveTab("dashboard");
    };
    // Allow AI chat actions to navigate to service pages
    const handleNavigate = (target) => {
        const validTabs = ["chat", "dashboard", "profile", "markets", "prime", "masterclass", "wealth_summit", "corporate_events", "financial_services"];
        if (validTabs.includes(target)) {
            setActiveTab(target);
        }
    };
    if (loadingProfile) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-dark flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader2, { className: "w-8 h-8 animate-spin text-primary mx-auto mb-3" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Loading your profile..." })] }) }));
    }
    return (_jsxs(AppShell, { activeTab: activeTab, onTabChange: setActiveTab, email: email, userType: profileData?.profile?.userType, onboardingComplete: profileData?.onboardingComplete ?? false, onSignOut: onSignOut, children: [activeTab === "chat" && (_jsx(ChatPage, { userId: userId, email: email, profile: profileData, onOnboardingComplete: handleOnboardingComplete, onNavigate: handleNavigate })), activeTab === "dashboard" && (_jsx(DashboardPage, { profile: profileData, onNavigate: handleNavigate, onRefresh: loadProfile })), activeTab === "profile" && (_jsx(ProfilePage, { email: email, profile: profileData, onSignOut: onSignOut, onRefresh: loadProfile })), activeTab === "markets" && _jsx(MarketsPage, {}), activeTab === "prime" && _jsx(PrimePage, {}), activeTab === "masterclass" && _jsx(MasterclassPage, {}), activeTab === "wealth_summit" && _jsx(WealthSummitPage, {}), (activeTab === "financial_services" || activeTab === "corporate_events") && _jsx(FinancialServicesPage, {})] }));
}
