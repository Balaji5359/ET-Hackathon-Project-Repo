import { useState } from "react";
import AppShell from "@/components/Layout/AppShell";
import AvatarScene from "@/components/Avatar/AvatarScene";
import DashboardPage from "@/components/Dashboard/DashboardPage";
import ProfilePage from "@/components/Profile/ProfilePage";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"chat" | "dashboard" | "profile">("chat");

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "chat" && <AvatarScene />}
      {activeTab === "dashboard" && <DashboardPage />}
      {activeTab === "profile" && <ProfilePage />}
    </AppShell>
  );
};

export default Index;
