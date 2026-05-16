import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef, useState } from "react";

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  gradient: string;
  suffix?: string;
  delay?: number;
}

function useCountUp(target: number, duration = 1200, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (target === 0) return;
      const steps = 40;
      const increment = target / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);
  return count;
}

function StatCard({
  label,
  value,
  icon,
  gradient,
  suffix = "",
  delay = 0,
}: StatCardProps) {
  const count = useCountUp(value, 1000, delay);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`stat-card-enter ${visible ? "stat-card-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-smooth hover:-translate-y-1">
        <div className={`h-1.5 ${gradient}`} />
        <CardContent className="p-4 pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{icon}</span>
            <span className="text-3xl font-display font-bold text-foreground">
              {count}
              {suffix}
            </span>
          </div>
          <p className="text-sm font-semibold text-muted-foreground text-right">
            {label}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

interface DashboardStatsProps {
  totalMembers: number;
  chatCount: number;
  rank: number;
  daysSinceJoining: number;
  loading?: boolean;
}

export function DashboardStats({
  totalMembers,
  chatCount,
  rank,
  daysSinceJoining,
  loading,
}: DashboardStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "মোট সদস্য",
      value: totalMembers,
      icon: "👥",
      gradient: "bg-gradient-to-r from-green-600 to-emerald-500",
      delay: 0,
    },
    {
      label: "চ্যাট সদস্য",
      value: chatCount,
      icon: "💬",
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-400",
      delay: 100,
    },
    {
      label: "আপনার ক্রম",
      value: rank,
      icon: "🏅",
      gradient: "bg-gradient-to-r from-amber-500 to-yellow-400",
      suffix: "#",
      delay: 200,
    },
    {
      label: "যোগদানের দিন",
      value: daysSinceJoining,
      icon: "📅",
      gradient: "bg-gradient-to-r from-red-500 to-rose-400",
      delay: 300,
    },
  ];

  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      data-ocid="dashboard.stats_section"
    >
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
