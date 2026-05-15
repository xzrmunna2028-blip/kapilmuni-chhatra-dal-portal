import ChhatraLogo from "@/components/ChhatraLogo";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export default function AdminLoginPage() {
  const { actor } = useBackend();
  const { setAdminSession } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: { email: string; password: string }) => {
      if (!actor) throw new Error("সার্ভারের সাথে সংযোগ নেই");
      const result = await actor.adminLogin(email, password);
      return result;
    },
    onSuccess: (token) => {
      if (token) {
        setAdminSession(token);
        navigate({ to: "/admin" });
      } else {
        setErrorMsg("ইমেইল বা পাসওয়ার্ড ভুল। আবার চেষ্টা করুন।");
      }
    },
    onError: (err: Error) => {
      setErrorMsg(err.message || "লগইন করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    loginMutation.mutate({ email, password });
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #0a1a0a 0%, #1a3a1a 50%, #2a0a0a 100%)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card rounded-2xl shadow-2xl p-8 border border-border">
          {/* Logo + Title */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <ChhatraLogo size={80} />
            <h1 className="font-display text-xl font-bold text-foreground text-center leading-tight">
              ২নং কপিলমুনি ইউনিয়ন ছাত্রদল
            </h1>
            <p className="text-sm text-muted-foreground font-semibold tracking-wide uppercase">
              প্রশাসন প্যানেল
            </p>
            <div
              className="h-0.5 w-24 rounded-full"
              style={{ background: "linear-gradient(90deg, #DC143C, #006A4E)" }}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="admin-email"
              >
                ইমেইল ঠিকানা
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                data-ocid="admin_login.email_input"
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="admin-password"
              >
                পাসওয়ার্ড
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                data-ocid="admin_login.password_input"
              />
            </div>

            {errorMsg && (
              <div
                className="px-4 py-3 rounded-lg text-sm font-medium"
                style={{
                  background: "#DC143C22",
                  color: "#DC143C",
                  border: "1px solid #DC143C44",
                }}
                data-ocid="admin_login.error_state"
              >
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 rounded-lg font-bold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #DC143C, #006A4E)",
              }}
              data-ocid="admin_login.submit_button"
            >
              {loginMutation.isPending ? "যাচাই করা হচ্ছে..." : "লগইন করুন"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            শুধুমাত্র অনুমোদিত প্রশাসকদের জন্য
          </p>
        </div>
      </div>
    </div>
  );
}
