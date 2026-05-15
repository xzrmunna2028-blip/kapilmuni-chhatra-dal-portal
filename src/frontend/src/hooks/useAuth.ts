import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useCallback, useEffect, useState } from "react";

const ADMIN_SESSION_KEY = "admin_session";

export type MemberRole = "admin" | "member" | "guest";

export function useAuth() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const [memberRole, setMemberRole] = useState<MemberRole>("guest");
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_SESSION_KEY);
    if (stored) {
      try {
        const session = JSON.parse(stored) as {
          token: string;
          expiresAt: number;
        };
        if (session.expiresAt > Date.now()) {
          setAdminToken(session.token);
          setMemberRole("admin");
        } else {
          localStorage.removeItem(ADMIN_SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(ADMIN_SESSION_KEY);
      }
    }
  }, []);

  const isLoggedIn = loginStatus === "success";
  const principal = identity?.getPrincipal()?.toText() ?? null;

  const logout = useCallback(() => {
    clear();
    setMemberRole("guest");
    setAdminToken(null);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }, [clear]);

  const setAdminSession = useCallback((token: string) => {
    const session = { token, expiresAt: Date.now() + 8 * 60 * 60 * 1000 };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    setAdminToken(token);
    setMemberRole("admin");
  }, []);

  const clearAdminSession = useCallback(() => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setAdminToken(null);
    setMemberRole(isLoggedIn ? "member" : "guest");
  }, [isLoggedIn]);

  return {
    isLoggedIn,
    principal,
    login,
    logout,
    loginStatus,
    memberRole,
    setMemberRole,
    adminToken,
    setAdminSession,
    clearAdminSession,
    isAdmin: memberRole === "admin",
  };
}
