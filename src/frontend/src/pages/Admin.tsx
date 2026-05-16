import type { MemberStats } from "@/backend";
import ChhatraLogo from "@/components/ChhatraLogo";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlignJustify,
  Award,
  Bell,
  GalleryHorizontalEnd,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Settings,
  Shield,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Toast, useToast } from "./admin/AdminShared";
import { AlumniAchievementsSection } from "./admin/AlumniAchievementsSection";
import { ChatModerationSection } from "./admin/ChatModerationSection";
import { DashboardSection } from "./admin/DashboardSection";
import { DesignationRankSection } from "./admin/DesignationRankSection";
import { GallerySection } from "./admin/GallerySection";
import { MemberManagementSection } from "./admin/MemberManagementSection";
import { NoticesSection } from "./admin/NoticesSection";
import { RegistrationRequestsSection } from "./admin/RegistrationRequestsSection";
import { SiteSettingsSection } from "./admin/SiteSettingsSection";

const NAV_ITEMS = [
  { id: 0, label: "ড্যাশবোর্ড", icon: LayoutDashboard, cat: "overview" },
  {
    id: 1,
    label: "নিবন্ধন অনুরোধ",
    icon: UserCheck,
    cat: "members",
    badge: true,
  },
  { id: 2, label: "সদস্য ব্যবস্থাপনা", icon: Users, cat: "members" },
  { id: 3, label: "পদবী ও র‍্যাংক", icon: Shield, cat: "members" },
  { id: 4, label: "সাইট সেটিংস", icon: Settings, cat: "settings" },
  { id: 5, label: "গ্যালারি", icon: GalleryHorizontalEnd, cat: "content" },
  { id: 6, label: "নোটিশ বোর্ড", icon: Bell, cat: "content" },
  { id: 7, label: "চ্যাট মডারেশন", icon: MessageCircle, cat: "content" },
  { id: 8, label: "অ্যালামনাই ও কৃতিত্ব", icon: Award, cat: "content" },
];

const CAT_LABELS: Record<string, string> = {
  overview: "সামগ্রিক দৃশ্য",
  members: "সদস্য বিভাগ",
  settings: "সেটিংস",
  content: "কন্টেন্ট বিভাগ",
};

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin, clearAdminSession } = useAuth();
  const { actor } = useBackend();
  const { toast, show } = useToast();
  const [activeSection, setActiveSection] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: stats } = useQuery<MemberStats>({
    queryKey: ["memberStats"],
    queryFn: async () => {
      if (!actor)
        return {
          pendingCount: 0n,
          total: 0n,
          joinedYesterday: 0n,
          joinedToday: 0n,
        };
      return actor.getMemberStats();
    },
    enabled: !!actor,
    refetchInterval: 15000,
  });

  const pendingCount = stats ? Number(stats.pendingCount) : 0;

  useEffect(() => {
    if (!isAdmin) void navigate({ to: "/admin/login" });
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const handleLogout = () => {
    clearAdminSession();
    void navigate({ to: "/" });
  };

  const handleNav = (id: number) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  // Group nav items by category for rendering
  const categories = Array.from(new Set(NAV_ITEMS.map((n) => n.cat)));

  return (
    <div className="min-h-screen flex" style={{ background: "#f0f4f0" }}>
      <Toast toast={toast} />

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          role="presentation"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "#0e2415", minHeight: "100vh" }}
      >
        {/* Sidebar header */}
        <div
          className="flex items-center gap-3 px-4 py-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <ChhatraLogo size={38} />
          <div className="min-w-0">
            <p className="text-white font-bold text-xs leading-tight font-display truncate">
              ২নং কপিলমুনি ইউনিয়ন
            </p>
            <p className="text-green-400 text-xs">ছাত্রদল — প্রশাসন</p>
          </div>
          <button
            type="button"
            className="ml-auto text-white/50 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <p
                className="text-xs font-semibold uppercase tracking-wider px-3 mb-1"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {CAT_LABELS[cat]}
              </p>
              {NAV_ITEMS.filter((n) => n.cat === cat).map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-ocid={`admin.nav.${item.id}`}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all mb-0.5 ${
                      isActive
                        ? "text-white"
                        : "text-green-300/70 hover:text-white hover:bg-white/5"
                    }`}
                    style={isActive ? { background: "#DC143C" } : {}}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-left truncate">
                      {item.label}
                    </span>
                    {item.badge && pendingCount > 0 && (
                      <span className="w-5 h-5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                        {pendingCount > 9 ? "9+" : pendingCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div
          className="p-3 border-t"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <button
            type="button"
            data-ocid="admin.logout_button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="w-4 h-4" />
            লগ আউট
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header
          className="lg:hidden flex items-center justify-between px-4 py-3 border-b shadow-sm"
          style={{
            background: "#0e2415",
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-white p-1"
            aria-label="মেনু খুলুন"
          >
            <AlignJustify className="w-5 h-5" />
          </button>
          <p className="text-white font-bold text-sm">
            {NAV_ITEMS.find((n) => n.id === activeSection)?.label}
          </p>
          <button
            type="button"
            data-ocid="admin.logout_button_mobile"
            onClick={handleLogout}
            className="text-red-400 text-xs font-semibold"
          >
            লগআউট
          </button>
        </header>

        {/* Desktop top bar */}
        <div
          className="hidden lg:flex items-center justify-between px-6 py-3 border-b bg-card shadow-sm"
          style={{ borderColor: "#e2e8e2" }}
        >
          <div>
            <h1 className="font-display font-bold text-[#1a2e1a] text-lg">
              {NAV_ITEMS.find((n) => n.id === activeSection)?.label}
            </h1>
            <p className="text-xs text-muted-foreground">
              ২নং কপিলমুনি ইউনিয়ন ছাত্রদল — প্রশাসন প্যানেল
            </p>
          </div>
          <div className="flex items-center gap-4">
            {pendingCount > 0 && (
              <button
                type="button"
                onClick={() => handleNav(1)}
                className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-yellow-100 transition-colors"
              >
                <Bell className="w-3.5 h-3.5" />
                {pendingCount} প্রার্থী অপেক্ষায়
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#DC143C] flex items-center justify-center text-white text-xs font-bold">
                প
              </div>
              <span className="text-sm font-semibold text-[#1a2e1a]">
                প্রশাসক
              </span>
            </div>
          </div>
        </div>

        {/* Section content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {activeSection === 0 && <DashboardSection />}
          {activeSection === 1 && <RegistrationRequestsSection show={show} />}
          {activeSection === 2 && <MemberManagementSection show={show} />}
          {activeSection === 3 && <DesignationRankSection show={show} />}
          {activeSection === 4 && <SiteSettingsSection show={show} />}
          {activeSection === 5 && <GallerySection show={show} />}
          {activeSection === 6 && <NoticesSection show={show} />}
          {activeSection === 7 && <ChatModerationSection show={show} />}
          {activeSection === 8 && <AlumniAchievementsSection show={show} />}
        </main>

        {/* Footer */}
        <footer
          className="text-center py-3 text-xs"
          style={{ color: "#9aab9a", borderTop: "1px solid #e0e8e0" }}
        >
          © {new Date().getFullYear()} ২নং কপিলমুনি ইউনিয়ন ছাত্রদল — প্রশাসন প্যানেল
        </footer>
      </div>
    </div>
  );
}
