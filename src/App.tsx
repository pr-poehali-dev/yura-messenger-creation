import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatsPage from "./pages/ChatsPage";
import SearchPage from "./pages/SearchPage";
import GalleryPage from "./pages/GalleryPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

const queryClient = new QueryClient();

type Tab = "chats" | "search" | "gallery" | "notifications" | "settings" | "profile";

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: "chats", icon: "MessageCircle", label: "Чаты" },
  { id: "search", icon: "Search", label: "Поиск" },
  { id: "gallery", icon: "Image", label: "Галерея" },
  { id: "notifications", icon: "Bell", label: "Уведомления" },
  { id: "settings", icon: "Settings", label: "Настройки" },
  { id: "profile", icon: "User", label: "Профиль" },
];

function Messenger() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [userName, setUserName] = useState("Алексей");
  const [userAvatar, setUserAvatar] = useState("А");

  useEffect(() => {
    api.getNotifications().then((d) => {
      const unread = (d.notifications || []).filter((n: { is_read: boolean }) => !n.is_read).length;
      setUnreadNotifications(unread);
    });
    api.getProfile().then((d) => {
      if (d.user) {
        setUserName(d.user.display_name || "Алексей");
        setUserAvatar(d.user.avatar_letter || "А");
      }
    });
  }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "notifications") {
      setTimeout(() => setUnreadNotifications(0), 500);
    }
  };

  const renderPage = () => {
    switch (activeTab) {
      case "chats": return <ChatsPage />;
      case "search": return <SearchPage />;
      case "gallery": return <GalleryPage />;
      case "notifications": return <NotificationsPage />;
      case "settings": return <SettingsPage />;
      case "profile": return <ProfilePage />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "'Golos Text', sans-serif" }}>
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border bg-white h-full shrink-0">
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-foreground flex items-center justify-center shrink-0">
              <span className="text-background text-sm font-bold">С</span>
            </div>
            <span className="font-semibold text-foreground tracking-tight text-base">Сигнал</span>
            <div className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              <Icon name="Lock" size={9} />
              <span>e2e</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
              {tab.id === "notifications" && unreadNotifications > 0 && (
                <span className="ml-auto bg-foreground text-background text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-tight">
                  {unreadNotifications}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-border">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-sm font-semibold text-foreground shrink-0">
              {userAvatar}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium leading-tight truncate">{userName}</div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                В сети
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-hidden animate-fade-in key-{activeTab}">
          {renderPage()}
        </div>

        {/* Bottom nav — mobile */}
        <nav className="md:hidden flex border-t border-border bg-white">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 relative transition-colors ${
                activeTab === tab.id ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <Icon name={tab.icon} size={19} />
                {tab.id === "notifications" && unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-foreground text-background text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-foreground"></span>
              )}
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Messenger />
      </TooltipProvider>
    </QueryClientProvider>
  );
}