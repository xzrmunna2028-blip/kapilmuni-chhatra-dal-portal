import { Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Image,
  LayoutDashboard,
  MessageCircle,
  ScrollText,
  Trophy,
  Users,
} from "lucide-react";

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  dataOcid: string;
}

const navItems: SidebarItem[] = [
  {
    href: "/dashboard",
    label: "ড্যাশবোর্ড",
    icon: LayoutDashboard,
    dataOcid: "sidebar.dashboard_link",
  },
  {
    href: "/committee",
    label: "কমিটি",
    icon: Users,
    dataOcid: "sidebar.committee_link",
  },
  {
    href: "/chat",
    label: "গ্রুপ চ্যাট",
    icon: MessageCircle,
    dataOcid: "sidebar.chat_link",
  },
  {
    href: "/notices",
    label: "নোটিশ বোর্ড",
    icon: ScrollText,
    dataOcid: "sidebar.notices_link",
  },
  {
    href: "/gallery",
    label: "ফটো গ্যালারি",
    icon: Image,
    dataOcid: "sidebar.gallery_link",
  },
  {
    href: "/alumni",
    label: "প্রাক্তন সদস্য",
    icon: Award,
    dataOcid: "sidebar.alumni_link",
  },
  {
    href: "/achievements",
    label: "সাফল্য",
    icon: Trophy,
    dataOcid: "sidebar.achievements_link",
  },
  {
    href: "/library",
    label: "তথ্য ভান্ডার",
    icon: BookOpen,
    dataOcid: "sidebar.library_link",
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-20 md:hidden"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          aria-hidden="true"
          role="presentation"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed top-0 left-0 h-full z-30 w-64 bg-card border-r border-border shadow-lg",
          "flex flex-col pt-20 pb-6",
          "transition-transform duration-300 ease-in-out",
          "md:static md:translate-x-0 md:z-auto md:shadow-none md:flex md:w-56 md:shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="প্রধান নেভিগেশন"
        data-ocid="sidebar.panel"
      >
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent/10 hover:text-accent transition-smooth group"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              onClick={onClose}
              data-ocid={item.dataOcid}
            >
              <item.icon
                size={18}
                className="shrink-0 text-muted-foreground group-hover:text-accent group-[.active]:text-accent-foreground"
              />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-3 mt-4 border-t border-border pt-4">
          <Link
            to="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-smooth"
            data-ocid="sidebar.admin_link"
            onClick={onClose}
          >
            <LayoutDashboard size={18} />
            <span>Admin Panel</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
