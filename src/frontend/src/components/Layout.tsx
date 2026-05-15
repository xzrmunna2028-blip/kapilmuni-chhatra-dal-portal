import ChhatraLogo from "@/components/ChhatraLogo";
import Sidebar from "@/components/Sidebar";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const PORTAL_NAME = "২নং কপিলমুনি ইউনিয়ন ছাত্রদল পোর্টাল";
const FOOTER_COPYRIGHT = "© ২নং কপিলমুনি ইউনিয়ন ছাত্রদল - সর্বস্বত্ব সংরক্ষিত";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = true }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground border-b border-primary/80 shadow-md">
        <div className="flex items-center gap-3 px-4 h-16 max-w-screen-2xl mx-auto">
          {/* Hamburger (mobile) */}
          {showSidebar && (
            <button
              type="button"
              className="md:hidden p-2 rounded-lg hover:bg-primary-foreground/10 transition-smooth"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label={sidebarOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
              data-ocid="header.hamburger_button"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            data-ocid="header.logo_link"
          >
            <ChhatraLogo size={44} />
          </Link>

          {/* Portal name */}
          <div className="flex-1 min-w-0 text-center">
            <h1 className="font-display text-base md:text-lg font-bold text-primary-foreground leading-tight truncate">
              {PORTAL_NAME}
            </h1>
            <p className="text-xs text-primary-foreground/70 hidden sm:block">
              Bangladesh Jatiotabadi Chhatra Dal
            </p>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-2 shrink-0">
            <Link
              to="/register"
              className="px-4 py-1.5 text-sm font-semibold rounded-full border border-primary-foreground/60 hover:bg-primary-foreground/10 transition-smooth"
              data-ocid="header.register_link"
            >
              সদস্য হন
            </Link>
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm font-semibold rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth"
              data-ocid="header.login_link"
            >
              লগইন
            </Link>
          </nav>

          {/* Mobile nav buttons */}
          <div className="flex md:hidden items-center gap-1 shrink-0">
            <Link
              to="/login"
              className="px-3 py-1 text-xs font-semibold rounded-full bg-accent text-accent-foreground"
              data-ocid="header.mobile_login_link"
            >
              লগইন
            </Link>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full">
        {showSidebar && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        <main className="flex-1 min-w-0 p-4 md:p-6">{children}</main>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground border-t border-primary/80">
        <div className="max-w-screen-2xl mx-auto px-4 py-6 flex flex-col items-center gap-3">
          <ChhatraLogo size={48} />
          <p className="text-sm text-primary-foreground/80 text-center">
            {FOOTER_COPYRIGHT}
          </p>
        </div>
      </footer>
    </div>
  );
}
