import { useState } from "react";
import AppShell from "@/components/Layout/AppShell";
import ChatWindow from "@/components/Chat/ChatWindow";
import DashboardPage from "@/components/Dashboard/DashboardPage";
import ProfilePage from "@/components/Profile/ProfilePage";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"chat" | "dashboard" | "profile">("chat");

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "chat" && <ChatWindow />}
      {activeTab === "dashboard" && <DashboardPage />}
      {activeTab === "profile" && <ProfilePage />}
    </AppShell>
  );
};

export default Index;
