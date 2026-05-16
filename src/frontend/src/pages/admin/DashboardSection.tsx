import type { MemberStats } from "@/backend";
import { useBackend } from "@/hooks/useBackend";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart2,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SectionHeader } from "./AdminShared";

const growthData = [
  { month: "জানু", সদস্য: 12 },
  { month: "ফেব্রু", সদস্য: 28 },
  { month: "মার্চ", সদস্য: 45 },
  { month: "এপ্রিল", সদস্য: 61 },
  { month: "মে", সদস্য: 78 },
  { month: "জুন", সদস্য: 95 },
];

export function DashboardSection() {
  const { actor } = useBackend();
  const { data: stats } = useQuery<MemberStats>({
    queryKey: ["memberStats"],
    queryFn: async () => {
      if (!actor)
        return {
          pendingCount: 0n,
          total: 0n,
          joinedYesterday: 0n,
          joinedToday: 0n,
        } as MemberStats;
      return actor.getMemberStats();
    },
    enabled: !!actor,
  });

  const cards = [
    {
      label: "মোট সদস্য",
      value: stats ? Number(stats.total) : "—",
      color: "#006A4E",
      bg: "#e8f5f0",
      icon: <Users className="w-6 h-6" />,
    },
    {
      label: "অনুমোদিত সদস্য",
      value: stats ? Number(stats.total) - Number(stats.pendingCount) : "—",
      color: "#1a6b3e",
      bg: "#d4edda",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      label: "অপেক্ষমাণ অনুরোধ",
      value: stats ? Number(stats.pendingCount) : "—",
      color: "#e67e22",
      bg: "#fef3e2",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      label: "আজ যোগ দিয়েছেন",
      value: stats ? Number(stats.joinedToday) : "—",
      color: "#DC143C",
      bg: "#fde8ec",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      label: "গতকাল যোগ দিয়েছেন",
      value: stats ? Number(stats.joinedYesterday) : "—",
      color: "#1a5276",
      bg: "#e3f0fc",
      icon: <BarChart2 className="w-6 h-6" />,
    },
    {
      label: "প্রত্যাখ্যাত সদস্য",
      value: 0,
      color: "#7f8c8d",
      bg: "#f0f3f5",
      icon: <XCircle className="w-6 h-6" />,
    },
  ];

  return (
    <div data-ocid="admin.dashboard_section">
      <SectionHeader
        icon="📊"
        title="ড্যাশবোর্ড"
        description="সামগ্রিক পরিসংখ্যান এবং সদস্যপদ কার্যক্রমের সংক্ষিপ্ত বিবরণ"
      />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl p-4 shadow-sm border border-border flex items-center gap-3 transition-transform hover:scale-[1.02]"
            style={{ background: c.bg }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: c.color, color: "white" }}
            >
              {c.icon}
            </div>
            <div>
              <p
                className="text-2xl font-bold leading-none"
                style={{ color: c.color }}
              >
                {c.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {c.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl p-5 shadow border border-border">
        <h3 className="font-semibold text-[#1a2e1a] mb-4 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#006A4E]" />
          সদস্যপদ বৃদ্ধির গ্রাফ (জানুয়ারি – জুন)
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="সদস্য"
              stroke="#DC143C"
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
