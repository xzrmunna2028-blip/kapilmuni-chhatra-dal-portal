import ChhatraLogo from "@/components/ChhatraLogo";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const { setAdminSession, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-navigate if session already active
  useEffect(() => {
    if (isAdmin) {
      void navigate({ to: "/admin" });
    }
  }, [isAdmin, navigate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    const trimmed = password.trim();
    if (!trimmed) {
      setErrorMsg("পাসওয়ার্ড দিন");
      return;
    }
    // Client-side password check — immediate, no backend call needed
    if (trimmed === "MUNNA12061") {
      setAdminSession("admin-local-token");
      setSuccessMsg("লগইন সফল! প্রশাসন প্যানেলে প্রবেশ করছেন...");
      setTimeout(() => {
        void navigate({ to: "/admin" });
      }, 600);
    } else {
      setErrorMsg("পাসওয়ার্ড ভুল। আবার চেষ্টা করুন।");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0a1a0a 0%, #0e2e1e 40%, #1a0a0a 100%)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #DC143C, transparent)",
          }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #006A4E, transparent)",
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div
          className="rounded-2xl shadow-2xl p-8 border"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          <div className="flex flex-col items-center gap-3 mb-8">
            <ChhatraLogo size={90} />
            <h1 className="font-display text-2xl font-bold text-white text-center leading-tight mt-1">
              ২নং কপিলমুনি ইউনিয়ন ছাত্রদল
            </h1>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <p className="text-sm text-green-400 font-semibold tracking-wide uppercase">
                প্রশাসন প্যানেল
              </p>
            </div>
            <div
              className="h-px w-32 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #DC143C, #006A4E, transparent)",
              }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-green-300 flex items-center gap-2"
                htmlFor="admin-password"
              >
                <Lock className="w-3.5 h-3.5" />
                অ্যাডমিন পাসওয়ার্ড
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড লিখুন"
                  className="w-full px-4 py-3 pr-12 rounded-xl border text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    borderColor: "rgba(255,255,255,0.15)",
                  }}
                  data-ocid="admin_login.password_input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                  aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {successMsg && (
              <div
                className="px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
                style={{
                  background: "rgba(0,106,78,0.2)",
                  color: "#4ade80",
                  border: "1px solid rgba(0,106,78,0.4)",
                }}
                data-ocid="admin_login.success_state"
              >
                ✅ {successMsg}
              </div>
            )}

            {errorMsg && (
              <div
                className="px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
                style={{
                  background: "rgba(220,20,60,0.15)",
                  color: "#ff6b6b",
                  border: "1px solid rgba(220,20,60,0.3)",
                }}
                data-ocid="admin_login.error_state"
              >
                ⚠️ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={!password.trim()}
              className="w-full py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
              style={{
                background:
                  "linear-gradient(135deg, #DC143C 0%, #8B0000 50%, #006A4E 100%)",
                boxShadow: "0 4px 20px rgba(220,20,60,0.3)",
              }}
              data-ocid="admin_login.submit_button"
            >
              <ShieldCheck className="w-4 h-4" />
              লগইন করুন
            </button>
          </form>

          <p
            className="mt-6 text-center text-xs"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            শুধুমাত্র অনুমোদিত প্রশাসকদের জন্য · সকল কার্যক্রম লগ করা হয়
          </p>
        </div>
      </div>
    </div>
  );
}
