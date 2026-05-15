import {
  type Achievement,
  type AlumniRecord,
  type ChatMessage,
  type CreateAchievementPayload,
  type CreateAlumniPayload,
  type CreateGalleryPhotoPayload,
  type CreateNoticePayload,
  type Designation,
  ExternalBlob,
  type GalleryPhoto,
  type Member,
  type MemberStats,
  MemberStatus,
  type Notice,
} from "@/backend";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ───────────────────────────────────────────── Toast ──
type ToastState = { message: string; type: "success" | "error" } | null;
function useToast() {
  const [toast, setToast] = useState<ToastState>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = (message: string, type: "success" | "error" = "success") => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type });
    timerRef.current = setTimeout(() => setToast(null), 3000);
  };
  return { toast, show };
}

function Toast({ toast }: { toast: ToastState }) {
  if (!toast) return null;
  return (
    <div
      data-ocid="admin.toast"
      className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-semibold transition-all ${
        toast.type === "success" ? "bg-[#006A4E]" : "bg-[#DC143C]"
      }`}
    >
      {toast.message}
    </div>
  );
}

// ───────────────────────────────────────────── Helpers ──
function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("bn-BD");
}

function StatusBadge({ status }: { status: MemberStatus }) {
  const map: Record<MemberStatus, { label: string; cls: string }> = {
    [MemberStatus.pending]: {
      label: "অপেক্ষমাণ",
      cls: "bg-yellow-100 text-yellow-800",
    },
    [MemberStatus.approved]: {
      label: "অনুমোদিত",
      cls: "bg-green-100 text-green-800",
    },
    [MemberStatus.rejected]: {
      label: "প্রত্যাখ্যাত",
      cls: "bg-red-100 text-red-800",
    },
  };
  const { label, cls } = map[status] ?? {
    label: status,
    cls: "bg-gray-100 text-gray-800",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

function Spinner() {
  return (
    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  );
}

const TABS = [
  "ড্যাশবোর্ড",
  "অনুমোদন প্রক্রিয়াধীন",
  "সকল সদস্য",
  "নোটিশ",
  "গ্যালারি",
  "চ্যাট বার্তা",
  "পদবী",
  "প্রাক্তন ও সাফল্য",
];

// ────────────────────────────────────────── Main Page ──
export default function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin, clearAdminSession } = useAuth();
  const { actor } = useBackend();
  const qc = useQueryClient();
  const { toast, show } = useToast();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!isAdmin) void navigate({ to: "/admin/login" });
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const handleLogout = () => {
    clearAdminSession();
    void navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-[#f4f6f0] font-body">
      <Toast toast={toast} />

      {/* Header */}
      <header className="bg-[#1a2e1a] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#DC143C] flex items-center justify-center font-bold text-sm">
            ছা
          </div>
          <div>
            <p className="font-display font-bold text-sm leading-tight">
              ২নং কপিলমুনি ইউনিয়ন ছাত্রদল
            </p>
            <p className="text-xs text-green-300">প্রশাসন প্যানেল</p>
          </div>
        </div>
        <button
          type="button"
          data-ocid="admin.logout_button"
          onClick={handleLogout}
          className="bg-[#DC143C] hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded font-semibold transition-colors"
        >
          লগ আউট
        </button>
      </header>

      {/* Tab bar */}
      <div className="bg-[#1a2e1a] overflow-x-auto">
        <div className="flex min-w-max">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              type="button"
              data-ocid={`admin.tab.${i + 1}`}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 text-sm whitespace-nowrap font-semibold transition-colors border-b-2 ${
                activeTab === i
                  ? "border-[#DC143C] text-white bg-[#DC143C]/10"
                  : "border-transparent text-green-300 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 0 && <DashboardTab actor={actor} />}
        {activeTab === 1 && <PendingTab actor={actor} qc={qc} show={show} />}
        {activeTab === 2 && <MembersTab actor={actor} qc={qc} show={show} />}
        {activeTab === 3 && <NoticesTab actor={actor} qc={qc} show={show} />}
        {activeTab === 4 && <GalleryTab actor={actor} qc={qc} show={show} />}
        {activeTab === 5 && <ChatTab actor={actor} qc={qc} show={show} />}
        {activeTab === 6 && (
          <DesignationTab actor={actor} qc={qc} show={show} />
        )}
        {activeTab === 7 && (
          <AlumniAchievementsTab actor={actor} qc={qc} show={show} />
        )}
      </main>
    </div>
  );
}

// ──────────────────────────────────── Types for tabs ──
type TabProps = {
  actor: ReturnType<typeof useBackend>["actor"];
  qc: ReturnType<typeof useQueryClient>;
  show: (msg: string, type?: "success" | "error") => void;
};
type DashTabProps = { actor: ReturnType<typeof useBackend>["actor"] };

// ─────────────────────────────────────── Tab 1: Dashboard ──
const growthData = [
  { month: "জানু", সদস্য: 12 },
  { month: "ফেব্রু", সদস্য: 28 },
  { month: "মার্চ", সদস্য: 45 },
  { month: "এপ্রিল", সদস্য: 61 },
  { month: "মে", সদস্য: 78 },
  { month: "জুন", সদস্য: 95 },
];

function DashboardTab({ actor }: DashTabProps) {
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
      label: "আজ যোগ দিয়েছেন",
      value: stats ? Number(stats.joinedToday) : "—",
      color: "#006A4E",
    },
    {
      label: "গতকাল যোগ দিয়েছেন",
      value: stats ? Number(stats.joinedYesterday) : "—",
      color: "#1a5276",
    },
    {
      label: "মোট সদস্য",
      value: stats ? Number(stats.total) : "—",
      color: "#DC143C",
    },
    {
      label: "অনুমোদন প্রক্রিয়াধীন",
      value: stats ? Number(stats.pendingCount) : "—",
      color: "#e67e22",
    },
  ];

  return (
    <div data-ocid="admin.dashboard_section">
      <h2 className="text-xl font-display font-bold text-[#1a2e1a] mb-5">
        ড্যাশবোর্ড
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-card rounded-xl p-4 shadow border border-border text-center"
          >
            <p className="text-3xl font-bold" style={{ color: c.color }}>
              {c.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-semibold">
              {c.label}
            </p>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-xl p-5 shadow border border-border">
        <h3 className="font-semibold text-[#1a2e1a] mb-4">
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
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─────────────────────────────── Tab 2: Pending Members ──
function PendingTab({ actor, qc, show }: TabProps) {
  const { data: pending = [] } = useQuery<Member[]>({
    queryKey: ["members", "pending"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMembersByStatus(MemberStatus.pending);
    },
    enabled: !!actor,
  });

  const [rejectModal, setRejectModal] = useState<{
    id: bigint;
    name: string;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const approve = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("no actor");
      return actor.approveMember(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
      qc.invalidateQueries({ queryKey: ["memberStats"] });
      show("সদস্য অনুমোদিত হয়েছে");
    },
    onError: () => show("অনুমোদন ব্যর্থ হয়েছে", "error"),
  });

  const reject = useMutation({
    mutationFn: async ({ id, reason }: { id: bigint; reason: string }) => {
      if (!actor) throw new Error("no actor");
      return actor.rejectMember(id, reason);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
      qc.invalidateQueries({ queryKey: ["memberStats"] });
      show("সদস্য প্রত্যাখ্যাত হয়েছে");
      setRejectModal(null);
      setRejectReason("");
    },
    onError: () => show("প্রত্যাখ্যান ব্যর্থ হয়েছে", "error"),
  });

  return (
    <div data-ocid="admin.pending_section">
      <h2 className="text-xl font-display font-bold text-[#1a2e1a] mb-5">
        অনুমোদন প্রক্রিয়াধীন ({pending.length})
      </h2>
      {pending.length === 0 ? (
        <div
          data-ocid="admin.pending.empty_state"
          className="bg-card rounded-xl p-10 text-center text-muted-foreground"
        >
          কোনো অপেক্ষমাণ সদস্য নেই
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((m, i) => (
            <div
              key={String(m.id)}
              data-ocid={`admin.pending.item.${i + 1}`}
              className="bg-card rounded-xl p-4 shadow border border-border flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#1a2e1a] truncate">
                  {m.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {m.designation} · {m.phone}
                </p>
                <p className="text-xs text-muted-foreground">
                  {m.email} · {formatDate(m.registeredAt)}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  data-ocid={`admin.pending.approve_button.${i + 1}`}
                  onClick={() => approve.mutate(m.id)}
                  disabled={approve.isPending}
                  className="bg-[#006A4E] hover:bg-green-800 text-white px-3 py-1.5 rounded text-sm font-semibold flex items-center gap-1 disabled:opacity-60"
                >
                  {approve.isPending ? <Spinner /> : null} অনুমোদন
                </button>
                <button
                  type="button"
                  data-ocid={`admin.pending.reject_button.${i + 1}`}
                  onClick={() => setRejectModal({ id: m.id, name: m.fullName })}
                  className="bg-[#DC143C] hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-semibold"
                >
                  প্রত্যাখ্যান
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            data-ocid="admin.reject.dialog"
            className="bg-card rounded-xl p-6 w-full max-w-md shadow-2xl"
          >
            <h3 className="font-bold text-[#1a2e1a] mb-3">
              {rejectModal.name} — প্রত্যাখ্যানের কারণ
            </h3>
            <textarea
              data-ocid="admin.reject.textarea"
              className="w-full border border-input rounded-lg p-3 text-sm min-h-[100px] resize-none"
              placeholder="কারণ লিখুন..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                data-ocid="admin.reject.confirm_button"
                disabled={!rejectReason.trim() || reject.isPending}
                onClick={() =>
                  reject.mutate({ id: rejectModal.id, reason: rejectReason })
                }
                className="flex-1 bg-[#DC143C] hover:bg-red-700 text-white py-2 rounded font-semibold text-sm flex items-center justify-center gap-1 disabled:opacity-60"
              >
                {reject.isPending ? <Spinner /> : null} নিশ্চিত করুন
              </button>
              <button
                type="button"
                data-ocid="admin.reject.cancel_button"
                onClick={() => {
                  setRejectModal(null);
                  setRejectReason("");
                }}
                className="flex-1 border border-border py-2 rounded font-semibold text-sm hover:bg-muted"
              >
                বাতিল
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────── Tab 3: All Members ──
function MembersTab({ actor, qc, show }: TabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | MemberStatus>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);

  const { data: members = [] } = useQuery<Member[]>({
    queryKey: ["members", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMembers();
    },
    enabled: !!actor,
  });

  const deleteMember = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("no actor");
      return actor.deleteMember(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
      qc.invalidateQueries({ queryKey: ["memberStats"] });
      show("সদস্য মুছে ফেলা হয়েছে");
      setDeleteConfirm(null);
    },
    onError: () => show("মুছে ফেলা ব্যর্থ হয়েছে", "error"),
  });

  const filtered = members.filter((m) => {
    const matchSearch =
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleExport = async () => {
    if (!actor) return;
    try {
      const allMembers = await actor.listMembers();
      const header =
        "\u09a8\u09be\u09ae,\u09aa\u09a6\u09ac\u09c0,\u09ab\u09cb\u09a8,\u0987\u09ae\u09c7\u0987\u09b2,\u09b8\u09cd\u099f\u09cd\u09af\u09be\u099f\u09be\u09b8,\u09a4\u09be\u09b0\u09bf\u0996";
      const rows = allMembers.map((m) =>
        [
          m.fullName,
          m.designation,
          m.phone,
          m.email,
          m.status,
          formatDate(m.registeredAt),
        ].join(","),
      );
      const csv = [header, ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "members.csv";
      a.click();
      URL.revokeObjectURL(url);
      show(
        "CSV \u09a1\u09be\u0989\u09a8\u09b2\u09cb\u09a1 \u09b9\u099a\u09cd\u099b\u09c7",
      );
    } catch {
      show(
        "CSV \u09ac\u09cd\u09af\u09b0\u09cd\u09a5 \u09b9\u09af\u09bc\u09c7\u099b\u09c7",
        "error",
      );
    }
  };

  return (
    <div data-ocid="admin.members_section">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <h2 className="text-xl font-display font-bold text-[#1a2e1a] flex-1">
          সকল সদস্য ({filtered.length})
        </h2>
        <button
          type="button"
          data-ocid="admin.members.export_button"
          onClick={handleExport}
          className="bg-[#1a2e1a] hover:bg-green-900 text-white px-4 py-2 rounded text-sm font-semibold"
        >
          CSV ডাউনলোড
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          data-ocid="admin.members.search_input"
          type="text"
          placeholder="নাম, ফোন বা ইমেইল খুঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-input rounded-lg px-3 py-2 text-sm"
        />
        <select
          data-ocid="admin.members.status_filter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "all" | MemberStatus)
          }
          className="border border-input rounded-lg px-3 py-2 text-sm bg-card"
        >
          <option value="all">সব স্ট্যাটাস</option>
          <option value={MemberStatus.pending}>অপেক্ষমাণ</option>
          <option value={MemberStatus.approved}>অনুমোদিত</option>
          <option value={MemberStatus.rejected}>প্রত্যাখ্যাত</option>
        </select>
      </div>
      <div className="bg-card rounded-xl shadow border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-[#1a2e1a] text-white">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">নাম</th>
              <th className="px-4 py-3 text-left">পদবী</th>
              <th className="px-4 py-3 text-left">ফোন</th>
              <th className="px-4 py-3 text-left">স্ট্যাটাস</th>
              <th className="px-4 py-3 text-left">তারিখ</th>
              <th className="px-4 py-3 text-right">কার্যক্রম</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-muted-foreground"
                  data-ocid="admin.members.empty_state"
                >
                  কোনো সদস্য পাওয়া যায়নি
                </td>
              </tr>
            ) : (
              filtered.map((m, i) => (
                <tr
                  key={String(m.id)}
                  data-ocid={`admin.members.item.${i + 1}`}
                  className="border-t border-border hover:bg-muted/30"
                >
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold truncate max-w-[160px]">
                    {m.fullName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {m.designation}
                  </td>
                  <td className="px-4 py-3">{m.phone}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(m.registeredAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      data-ocid={`admin.members.delete_button.${i + 1}`}
                      onClick={() => setDeleteConfirm(m.id)}
                      className="text-[#DC143C] hover:text-red-800 font-semibold text-xs"
                    >
                      মুছুন
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            data-ocid="admin.members.delete.dialog"
            className="bg-card rounded-xl p-6 w-full max-w-sm shadow-2xl text-center"
          >
            <p className="font-bold text-[#1a2e1a] mb-4">
              আপনি কি নিশ্চিত যে এই সদস্যকে মুছে ফেলবেন?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                data-ocid="admin.members.delete.confirm_button"
                onClick={() => deleteMember.mutate(deleteConfirm)}
                disabled={deleteMember.isPending}
                className="flex-1 bg-[#DC143C] hover:bg-red-700 text-white py-2 rounded font-semibold flex items-center justify-center gap-1 disabled:opacity-60"
              >
                {deleteMember.isPending ? <Spinner /> : null} হ্যাঁ, মুছুন
              </button>
              <button
                type="button"
                data-ocid="admin.members.delete.cancel_button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-border py-2 rounded font-semibold hover:bg-muted"
              >
                বাতিল
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────── Tab 4: Notices ──
function NoticesTab({ actor, qc, show }: TabProps) {
  const [form, setForm] = useState({ title: "", content: "", author: "" });

  const { data: notices = [] } = useQuery<Notice[]>({
    queryKey: ["notices", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listNotices(true);
    },
    enabled: !!actor,
  });

  const createNotice = useMutation({
    mutationFn: async (payload: CreateNoticePayload) => {
      if (!actor) throw new Error("no actor");
      return actor.createNotice(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notices"] });
      show("নোটিশ যোগ করা হয়েছে");
      setForm({ title: "", content: "", author: "" });
    },
    onError: () => show("নোটিশ যোগ ব্যর্থ হয়েছে", "error"),
  });

  const archiveNotice = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("no actor");
      return actor.archiveNotice(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notices"] });
      show("নোটিশ আর্কাইভ করা হয়েছে");
    },
    onError: () => show("আর্কাইভ ব্যর্থ হয়েছে", "error"),
  });

  const deleteNotice = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("no actor");
      return actor.deleteNotice(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notices"] });
      show("নোটিশ মুছে ফেলা হয়েছে");
    },
    onError: () => show("মুছে ফেলা ব্যর্থ হয়েছে", "error"),
  });

  return (
    <div data-ocid="admin.notices_section">
      <h2 className="text-xl font-display font-bold text-[#1a2e1a] mb-5">
        নোটিশ ব্যবস্থাপনা
      </h2>
      <div className="bg-card rounded-xl p-5 shadow border border-border mb-6">
        <h3 className="font-semibold mb-3 text-[#1a2e1a]">নতুন নোটিশ যোগ করুন</h3>
        <div className="space-y-3">
          <input
            data-ocid="admin.notices.title_input"
            type="text"
            placeholder="শিরোনাম"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full border border-input rounded-lg px-3 py-2 text-sm"
          />
          <input
            data-ocid="admin.notices.author_input"
            type="text"
            placeholder="লেখক"
            value={form.author}
            onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
            className="w-full border border-input rounded-lg px-3 py-2 text-sm"
          />
          <textarea
            data-ocid="admin.notices.content_textarea"
            placeholder="বিষয়বস্তু"
            value={form.content}
            onChange={(e) =>
              setForm((f) => ({ ...f, content: e.target.value }))
            }
            className="w-full border border-input rounded-lg px-3 py-2 text-sm min-h-[100px] resize-none"
          />
          <button
            type="button"
            data-ocid="admin.notices.submit_button"
            disabled={
              !form.title.trim() ||
              !form.content.trim() ||
              !form.author.trim() ||
              createNotice.isPending
            }
            onClick={() => createNotice.mutate(form)}
            className="bg-[#006A4E] hover:bg-green-800 text-white px-5 py-2 rounded font-semibold text-sm flex items-center gap-2 disabled:opacity-60"
          >
            {createNotice.isPending ? <Spinner /> : null} নোটিশ যোগ করুন
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {notices.map((n, i) => (
          <div
            key={String(n.id)}
            data-ocid={`admin.notices.item.${i + 1}`}
            className="bg-card rounded-xl p-4 shadow border border-border"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#1a2e1a] flex items-center gap-2">
                  {n.title}
                  {n.archived && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                      আর্কাইভড
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {n.author} · {formatDate(n.date)}
                </p>
                <p className="text-sm mt-1 text-foreground line-clamp-2">
                  {n.content}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!n.archived && (
                  <button
                    type="button"
                    data-ocid={`admin.notices.archive_button.${i + 1}`}
                    onClick={() => archiveNotice.mutate(n.id)}
                    disabled={archiveNotice.isPending}
                    className="text-xs border border-border px-2 py-1 rounded hover:bg-muted font-semibold disabled:opacity-60"
                  >
                    আর্কাইভ
                  </button>
                )}
                <button
                  type="button"
                  data-ocid={`admin.notices.delete_button.${i + 1}`}
                  onClick={() => deleteNotice.mutate(n.id)}
                  disabled={deleteNotice.isPending}
                  className="text-[#DC143C] hover:text-red-700 text-xs font-semibold disabled:opacity-60"
                >
                  মুছুন
                </button>
              </div>
            </div>
          </div>
        ))}
        {notices.length === 0 && (
          <div
            data-ocid="admin.notices.empty_state"
            className="bg-card rounded-xl p-8 text-center text-muted-foreground"
          >
            কোনো নোটিশ নেই
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────── Tab 5: Gallery ──
function GalleryTab({ actor, qc, show }: TabProps) {
  const [caption, setCaption] = useState("");
  const [uploaderName, setUploaderName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: photos = [] } = useQuery<GalleryPhoto[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listGalleryPhotos();
    },
    enabled: !!actor,
  });

  const deletePhoto = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("no actor");
      return actor.deleteGalleryPhoto(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gallery"] });
      show("ছবি মুছে ফেলা হয়েছে");
    },
    onError: () => show("মুছে ফেলা ব্যর্থ হয়েছে", "error"),
  });

  const handleUpload = async () => {
    if (!actor || !file || !caption.trim() || !uploaderName.trim()) return;
    setUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const photoBlob = ExternalBlob.fromBytes(bytes);
      const payload: CreateGalleryPhotoPayload = {
        photoBlob,
        uploaderName,
        caption,
      };
      await actor.addGalleryPhoto(payload);
      qc.invalidateQueries({ queryKey: ["gallery"] });
      show("ছবি আপলোড হয়েছে");
      setCaption("");
      setUploaderName("");
      setFile(null);
    } catch {
      show("আপলোড ব্যর্থ হয়েছে", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div data-ocid="admin.gallery_section">
      <h2 className="text-xl font-display font-bold text-[#1a2e1a] mb-5">
        গ্যালারি ব্যবস্থাপনা
      </h2>
      <div className="bg-card rounded-xl p-5 shadow border border-border mb-6">
        <h3 className="font-semibold mb-3 text-[#1a2e1a]">নতুন ছবি যোগ করুন</h3>
        <div className="space-y-3">
          <input
            data-ocid="admin.gallery.uploader_input"
            type="text"
            placeholder="আপলোডকারীর নাম"
            value={uploaderName}
            onChange={(e) => setUploaderName(e.target.value)}
            className="w-full border border-input rounded-lg px-3 py-2 text-sm"
          />
          <input
            data-ocid="admin.gallery.caption_input"
            type="text"
            placeholder="ক্যাপশন"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border border-input rounded-lg px-3 py-2 text-sm"
          />
          <input
            data-ocid="admin.gallery.upload_button"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block text-sm text-muted-foreground file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#1a2e1a] file:text-white hover:file:bg-green-900"
          />
          <button
            type="button"
            data-ocid="admin.gallery.submit_button"
            disabled={
              !file || !caption.trim() || !uploaderName.trim() || uploading
            }
            onClick={handleUpload}
            className="bg-[#006A4E] hover:bg-green-800 text-white px-5 py-2 rounded font-semibold text-sm flex items-center gap-2 disabled:opacity-60"
          >
            {uploading ? <Spinner /> : null} ছবি যোগ করুন
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((p, i) => (
          <div
            key={String(p.id)}
            data-ocid={`admin.gallery.item.${i + 1}`}
            className="bg-card rounded-xl overflow-hidden shadow border border-border group"
          >
            <img
              src={p.photoBlob.getDirectURL()}
              alt={p.caption}
              className="w-full h-36 object-cover"
            />
            <div className="p-2">
              <p className="text-xs font-semibold truncate">{p.caption}</p>
              <p className="text-xs text-muted-foreground">{p.uploaderName}</p>
              <button
                type="button"
                data-ocid={`admin.gallery.delete_button.${i + 1}`}
                onClick={() => deletePhoto.mutate(p.id)}
                className="mt-1 text-[#DC143C] text-xs font-semibold hover:text-red-700"
              >
                মুছুন
              </button>
            </div>
          </div>
        ))}
        {photos.length === 0 && (
          <div
            data-ocid="admin.gallery.empty_state"
            className="col-span-4 bg-card rounded-xl p-8 text-center text-muted-foreground"
          >
            কোনো ছবি নেই
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────── Tab 6: Chat ──
function ChatTab({ actor, qc, show }: TabProps) {
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ["chatMessages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatMessages(50n);
    },
    enabled: !!actor,
    refetchInterval: 3000,
  });

  const deleteMsg = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("no actor");
      return actor.deleteChatMessage(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chatMessages"] });
      show("বার্তা মুছে ফেলা হয়েছে");
    },
    onError: () => show("মুছে ফেলা ব্যর্থ হয়েছে", "error"),
  });

  return (
    <div data-ocid="admin.chat_section">
      <h2 className="text-xl font-display font-bold text-[#1a2e1a] mb-5">
        চ্যাট বার্তা ({messages.length})
      </h2>
      <div className="bg-card rounded-xl shadow border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[540px]">
          <thead className="bg-[#1a2e1a] text-white">
            <tr>
              <th className="px-4 py-3 text-left">প্রেরক</th>
              <th className="px-4 py-3 text-left">বার্তা</th>
              <th className="px-4 py-3 text-left">সময়</th>
              <th className="px-4 py-3 text-right">কার্যক্রম</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                  data-ocid="admin.chat.empty_state"
                >
                  কোনো বার্তা নেই
                </td>
              </tr>
            ) : (
              messages.map((msg, i) => (
                <tr
                  key={String(msg.id)}
                  data-ocid={`admin.chat.item.${i + 1}`}
                  className="border-t border-border hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-semibold">{msg.senderName}</td>
                  <td className="px-4 py-3 max-w-[300px] truncate">
                    {msg.text}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {formatDate(msg.timestamp)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      data-ocid={`admin.chat.delete_button.${i + 1}`}
                      onClick={() => deleteMsg.mutate(msg.id)}
                      disabled={deleteMsg.isPending}
                      className="text-[#DC143C] hover:text-red-700 text-xs font-semibold disabled:opacity-60"
                    >
                      মুছুন
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────── Tab 7: Designations ──
function DesignationTab({ actor, qc, show }: TabProps) {
  const [title, setTitle] = useState("");
  const [rank, setRank] = useState("");

  const { data: designations = [] } = useQuery<Designation[]>({
    queryKey: ["designations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listDesignations();
    },
    enabled: !!actor,
  });

  const addDesignation = useMutation({
    mutationFn: async ({
      title: t,
      rank: r,
    }: { title: string; rank: bigint }) => {
      if (!actor) throw new Error("no actor");
      return actor.addDesignation(t, r);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["designations"] });
      show("পদবী যোগ করা হয়েছে");
      setTitle("");
      setRank("");
    },
    onError: () => show("পদবী যোগ ব্যর্থ হয়েছে", "error"),
  });

  const deleteDesignation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("no actor");
      return actor.deleteDesignation(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["designations"] });
      show("পদবী মুছে ফেলা হয়েছে");
    },
    onError: () => show("মুছে ফেলা ব্যর্থ হয়েছে", "error"),
  });

  const sorted = [...designations].sort(
    (a, b) => Number(a.rank) - Number(b.rank),
  );

  return (
    <div data-ocid="admin.designations_section">
      <h2 className="text-xl font-display font-bold text-[#1a2e1a] mb-5">
        পদবী ব্যবস্থাপনা
      </h2>
      <div className="bg-card rounded-xl p-5 shadow border border-border mb-6">
        <h3 className="font-semibold mb-3 text-[#1a2e1a]">নতুন পদবী যোগ করুন</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            data-ocid="admin.designations.title_input"
            type="text"
            placeholder="পদবীর নাম (যেমন: সভাপতি)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border border-input rounded-lg px-3 py-2 text-sm"
          />
          <input
            data-ocid="admin.designations.rank_input"
            type="number"
            placeholder="র‌্যাংক (১ = সর্বোচ্চ)"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            className="w-40 border border-input rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="button"
            data-ocid="admin.designations.submit_button"
            disabled={!title.trim() || !rank || addDesignation.isPending}
            onClick={() => addDesignation.mutate({ title, rank: BigInt(rank) })}
            className="bg-[#006A4E] hover:bg-green-800 text-white px-5 py-2 rounded font-semibold text-sm flex items-center gap-2 disabled:opacity-60"
          >
            {addDesignation.isPending ? <Spinner /> : null} যোগ করুন
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {sorted.map((d, i) => (
          <div
            key={String(d.id)}
            data-ocid={`admin.designations.item.${i + 1}`}
            className="bg-card rounded-xl px-4 py-3 shadow border border-border flex items-center justify-between"
          >
            <div>
              <span className="font-bold text-[#1a2e1a]">{d.title}</span>
              <span className="ml-3 text-xs text-muted-foreground">
                র‌্যাংক: {String(d.rank)}
              </span>
            </div>
            <button
              type="button"
              data-ocid={`admin.designations.delete_button.${i + 1}`}
              onClick={() => deleteDesignation.mutate(d.id)}
              disabled={deleteDesignation.isPending}
              className="text-[#DC143C] hover:text-red-700 text-sm font-semibold disabled:opacity-60"
            >
              মুছুন
            </button>
          </div>
        ))}
        {sorted.length === 0 && (
          <div
            data-ocid="admin.designations.empty_state"
            className="bg-card rounded-xl p-8 text-center text-muted-foreground"
          >
            কোনো পদবী নেই
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────── Tab 8: Alumni & Achievements ──
function AlumniAchievementsTab({ actor, qc, show }: TabProps) {
  const [subTab, setSubTab] = useState<"alumni" | "achievements">("alumni");

  // Alumni state
  const [alumniForm, setAlumniForm] = useState<
    Omit<CreateAlumniPayload, "photoBlob">
  >({ name: "", designation: "", yearsActive: "", currentStatus: "" });

  // Achievement state
  const [achForm, setAchForm] = useState<
    Omit<CreateAchievementPayload, "photoBlob">
  >({ memberName: "", title: "", description: "" });

  const { data: alumniList = [] } = useQuery<AlumniRecord[]>({
    queryKey: ["alumni"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAlumni();
    },
    enabled: !!actor,
  });

  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ["achievements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAchievements();
    },
    enabled: !!actor,
  });

  const addAlumni = useMutation({
    mutationFn: async (payload: CreateAlumniPayload) => {
      if (!actor) throw new Error("no actor");
      return actor.addAlumni(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alumni"] });
      show("প্রাক্তন সদস্য যোগ হয়েছে");
      setAlumniForm({
        name: "",
        designation: "",
        yearsActive: "",
        currentStatus: "",
      });
    },
    onError: () => show("যোগ ব্যর্থ হয়েছে", "error"),
  });

  const deleteAlumni = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("no actor");
      return actor.deleteAlumni(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alumni"] });
      show("মুছে ফেলা হয়েছে");
    },
    onError: () => show("মুছে ফেলা ব্যর্থ হয়েছে", "error"),
  });

  const addAchievement = useMutation({
    mutationFn: async (payload: CreateAchievementPayload) => {
      if (!actor) throw new Error("no actor");
      return actor.addAchievement(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["achievements"] });
      show("সাফল্য যোগ হয়েছে");
      setAchForm({ memberName: "", title: "", description: "" });
    },
    onError: () => show("যোগ ব্যর্থ হয়েছে", "error"),
  });

  const deleteAchievement = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("no actor");
      return actor.deleteAchievement(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["achievements"] });
      show("মুছে ফেলা হয়েছে");
    },
    onError: () => show("মুছে ফেলা ব্যর্থ হয়েছে", "error"),
  });

  return (
    <div data-ocid="admin.alumni_achievements_section">
      <h2 className="text-xl font-display font-bold text-[#1a2e1a] mb-5">
        প্রাক্তন ও সাফল্য
      </h2>

      {/* Sub-tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        <button
          type="button"
          data-ocid="admin.alumni_tab"
          onClick={() => setSubTab("alumni")}
          className={`pb-2 px-1 font-semibold text-sm border-b-2 transition-colors ${
            subTab === "alumni"
              ? "border-[#DC143C] text-[#DC143C]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          প্রাক্তন সদস্য
        </button>
        <button
          type="button"
          data-ocid="admin.achievements_tab"
          onClick={() => setSubTab("achievements")}
          className={`pb-2 px-1 font-semibold text-sm border-b-2 transition-colors ${
            subTab === "achievements"
              ? "border-[#DC143C] text-[#DC143C]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          সাফল্য
        </button>
      </div>

      {subTab === "alumni" && (
        <div>
          <div className="bg-card rounded-xl p-5 shadow border border-border mb-5">
            <h3 className="font-semibold mb-3 text-[#1a2e1a]">
              নতুন প্রাক্তন সদস্য যোগ করুন
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                data-ocid="admin.alumni.name_input"
                type="text"
                placeholder="নাম"
                value={alumniForm.name}
                onChange={(e) =>
                  setAlumniForm((f) => ({ ...f, name: e.target.value }))
                }
                className="border border-input rounded-lg px-3 py-2 text-sm"
              />
              <input
                data-ocid="admin.alumni.designation_input"
                type="text"
                placeholder="পদবী"
                value={alumniForm.designation}
                onChange={(e) =>
                  setAlumniForm((f) => ({ ...f, designation: e.target.value }))
                }
                className="border border-input rounded-lg px-3 py-2 text-sm"
              />
              <input
                data-ocid="admin.alumni.years_input"
                type="text"
                placeholder="সক্রিয় বছর (যেমন: ২০১৫-২০১৮)"
                value={alumniForm.yearsActive}
                onChange={(e) =>
                  setAlumniForm((f) => ({ ...f, yearsActive: e.target.value }))
                }
                className="border border-input rounded-lg px-3 py-2 text-sm"
              />
              <input
                data-ocid="admin.alumni.status_input"
                type="text"
                placeholder="বর্তমান অবস্থান"
                value={alumniForm.currentStatus}
                onChange={(e) =>
                  setAlumniForm((f) => ({
                    ...f,
                    currentStatus: e.target.value,
                  }))
                }
                className="border border-input rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <button
              type="button"
              data-ocid="admin.alumni.submit_button"
              disabled={
                !alumniForm.name.trim() ||
                !alumniForm.designation.trim() ||
                addAlumni.isPending
              }
              onClick={() => addAlumni.mutate({ ...alumniForm })}
              className="mt-3 bg-[#006A4E] hover:bg-green-800 text-white px-5 py-2 rounded font-semibold text-sm flex items-center gap-2 disabled:opacity-60"
            >
              {addAlumni.isPending ? <Spinner /> : null} যোগ করুন
            </button>
          </div>
          <div className="space-y-3">
            {alumniList.map((a, i) => (
              <div
                key={String(a.id)}
                data-ocid={`admin.alumni.item.${i + 1}`}
                className="bg-card rounded-xl px-4 py-3 shadow border border-border flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-[#1a2e1a]">{a.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {a.designation} · {a.yearsActive} · {a.currentStatus}
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid={`admin.alumni.delete_button.${i + 1}`}
                  onClick={() => deleteAlumni.mutate(a.id)}
                  disabled={deleteAlumni.isPending}
                  className="text-[#DC143C] hover:text-red-700 text-sm font-semibold disabled:opacity-60"
                >
                  মুছুন
                </button>
              </div>
            ))}
            {alumniList.length === 0 && (
              <div
                data-ocid="admin.alumni.empty_state"
                className="bg-card rounded-xl p-8 text-center text-muted-foreground"
              >
                কোনো প্রাক্তন সদস্য নেই
              </div>
            )}
          </div>
        </div>
      )}

      {subTab === "achievements" && (
        <div>
          <div className="bg-card rounded-xl p-5 shadow border border-border mb-5">
            <h3 className="font-semibold mb-3 text-[#1a2e1a]">
              নতুন সাফল্য যোগ করুন
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                data-ocid="admin.achievements.member_input"
                type="text"
                placeholder="সদস্যের নাম"
                value={achForm.memberName}
                onChange={(e) =>
                  setAchForm((f) => ({ ...f, memberName: e.target.value }))
                }
                className="border border-input rounded-lg px-3 py-2 text-sm"
              />
              <input
                data-ocid="admin.achievements.title_input"
                type="text"
                placeholder="সাফল্যের শিরোনাম"
                value={achForm.title}
                onChange={(e) =>
                  setAchForm((f) => ({ ...f, title: e.target.value }))
                }
                className="border border-input rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <textarea
              data-ocid="admin.achievements.desc_textarea"
              placeholder="বিস্তারিত বিবরণ"
              value={achForm.description}
              onChange={(e) =>
                setAchForm((f) => ({ ...f, description: e.target.value }))
              }
              className="mt-3 w-full border border-input rounded-lg px-3 py-2 text-sm min-h-[80px] resize-none"
            />
            <button
              type="button"
              data-ocid="admin.achievements.submit_button"
              disabled={
                !achForm.memberName.trim() ||
                !achForm.title.trim() ||
                addAchievement.isPending
              }
              onClick={() => addAchievement.mutate({ ...achForm })}
              className="mt-3 bg-[#006A4E] hover:bg-green-800 text-white px-5 py-2 rounded font-semibold text-sm flex items-center gap-2 disabled:opacity-60"
            >
              {addAchievement.isPending ? <Spinner /> : null} যোগ করুন
            </button>
          </div>
          <div className="space-y-3">
            {achievements.map((a, i) => (
              <div
                key={String(a.id)}
                data-ocid={`admin.achievements.item.${i + 1}`}
                className="bg-card rounded-xl px-4 py-3 shadow border border-border flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1a2e1a]">{a.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {a.memberName} · {formatDate(a.date)}
                  </p>
                  <p className="text-sm mt-0.5 line-clamp-1">{a.description}</p>
                </div>
                <button
                  type="button"
                  data-ocid={`admin.achievements.delete_button.${i + 1}`}
                  onClick={() => deleteAchievement.mutate(a.id)}
                  disabled={deleteAchievement.isPending}
                  className="ml-3 text-[#DC143C] hover:text-red-700 text-sm font-semibold disabled:opacity-60 shrink-0"
                >
                  মুছুন
                </button>
              </div>
            ))}
            {achievements.length === 0 && (
              <div
                data-ocid="admin.achievements.empty_state"
                className="bg-card rounded-xl p-8 text-center text-muted-foreground"
              >
                কোনো সাফল্য নেই
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
