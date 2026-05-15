import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDesignations, useMembers } from "@/lib/api";
import type { Member } from "@/types";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

// ────────────────────────────────────────────────
// Rank order: lower number = higher rank
// ────────────────────────────────────────────────
const DESIGNATION_RANK: Record<string, number> = {
  আহ্বায়ক: 1,
  Convener: 1,
  "সিনিয়র যুগ্ম আহ্বায়ক": 2,
  "Senior Joint Convener": 2,
  "যুগ্ম আহ্বায়ক": 3,
  "Joint Convener": 3,
  "সাধারণ সম্পাদক": 4,
  "General Secretary": 4,
  "সহ-সম্পাদক": 5,
  "Assistant Secretary": 5,
  "সাংগঠনিক সম্পাদক": 6,
  "Organizing Secretary": 6,
  সদস্য: 7,
  Member: 7,
};

function rankOf(designation: string): number {
  return DESIGNATION_RANK[designation] ?? 99;
}

// ────────────────────────────────────────────────
// Sample / mock data
// ────────────────────────────────────────────────
interface SampleMember {
  id: string;
  fullName: string;
  designation: string;
  phone: string;
  email: string;
  fullAddress: string;
  avatarColor: string;
  initials: string;
}

const SAMPLE_COMMITTEE: SampleMember[] = [
  {
    id: "s1",
    fullName: "মোঃ রফিকুল ইসলাম",
    designation: "আহ্বায়ক",
    phone: "+880 1711-234567",
    email: "rafiqul@example.com",
    fullAddress: "কপিলমুনি, পাইকগাছা, খুলনা",
    avatarColor: "#006A4E",
    initials: "রই",
  },
  {
    id: "s2",
    fullName: "মোঃ শাহীন আলম",
    designation: "সিনিয়র যুগ্ম আহ্বায়ক",
    phone: "+880 1812-345678",
    email: "shahin@example.com",
    fullAddress: "কপিলমুনি, পাইকগাছা, খুলনা",
    avatarColor: "#DC143C",
    initials: "শআ",
  },
  {
    id: "s3",
    fullName: "মোঃ নাজমুল হাসান",
    designation: "যুগ্ম আহ্বায়ক",
    phone: "+880 1913-456789",
    email: "nazmul@example.com",
    fullAddress: "কপিলমুনি ইউনিয়ন, খুলনা",
    avatarColor: "#1a5276",
    initials: "নহ",
  },
  {
    id: "s4",
    fullName: "মোঃ জাহাঙ্গীর আলম",
    designation: "সাধারণ সম্পাদক",
    phone: "+880 1611-567890",
    email: "jahangir@example.com",
    fullAddress: "কপিলমুনি, খুলনা",
    avatarColor: "#6c3483",
    initials: "জআ",
  },
  {
    id: "s5",
    fullName: "মোঃ রাকিব হাসান",
    designation: "সাংগঠনিক সম্পাদক",
    phone: "+880 1711-678901",
    email: "rakib@example.com",
    fullAddress: "কপিলমুনি ইউনিয়ন, খুলনা",
    avatarColor: "#784212",
    initials: "রহ",
  },
  {
    id: "s6",
    fullName: "মোঃ সালাউদ্দিন সরকার",
    designation: "সদস্য",
    phone: "+880 1811-789012",
    email: "salauddin@example.com",
    fullAddress: "কপিলমুনি, খুলনা",
    avatarColor: "#186a3b",
    initials: "সস",
  },
  {
    id: "s7",
    fullName: "মোঃ তানভীর আহমেদ",
    designation: "সদস্য",
    phone: "+880 1911-890123",
    email: "tanvir@example.com",
    fullAddress: "কপিলমুনি ইউনিয়ন, খুলনা",
    avatarColor: "#1b4f72",
    initials: "তআ",
  },
];

const KHULNA_LEADERS: SampleMember[] = [
  {
    id: "k1",
    fullName: "মোঃ আবদুল করিম",
    designation: "জেলা আহ্বায়ক, খুলনা",
    phone: "+880 1711-111222",
    email: "abdulkarim@bjcd.org",
    fullAddress: "খুলনা জেলা সদর",
    avatarColor: "#006A4E",
    initials: "আক",
  },
  {
    id: "k2",
    fullName: "মোঃ সাইদুর রহমান",
    designation: "উপজেলা আহ্বায়ক, পাইকগাছা",
    phone: "+880 1811-222333",
    email: "saidur@bjcd.org",
    fullAddress: "পাইকগাছা উপজেলা, খুলনা",
    avatarColor: "#DC143C",
    initials: "সর",
  },
  {
    id: "k3",
    fullName: "মোঃ মাহবুবুর রহমান",
    designation: "উপজেলা সম্পাদক, পাইকগাছা",
    phone: "+880 1911-333444",
    email: "mahbubur@bjcd.org",
    fullAddress: "পাইকগাছা উপজেলা, খুলনা",
    avatarColor: "#1a5276",
    initials: "মর",
  },
];

// ────────────────────────────────────────────────
// Avatar component
// ────────────────────────────────────────────────
function Avatar({
  initials,
  color,
  size = "md",
  photoUrl,
}: {
  initials: string;
  color: string;
  size?: "sm" | "md" | "lg";
  photoUrl?: string;
}) {
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-16 h-16 text-lg",
    lg: "w-24 h-24 text-2xl",
  };
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={initials}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-md`}
      />
    );
  }
  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white select-none`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

// ────────────────────────────────────────────────
// Designation badge color
// ────────────────────────────────────────────────
function getDesigBadgeStyle(designation: string) {
  const r = rankOf(designation);
  if (r === 1) return "bg-yellow-500/20 text-yellow-700 border-yellow-400";
  if (r === 2) return "bg-red-100 text-red-700 border-red-400";
  if (r === 3) return "bg-green-100 text-green-700 border-green-500";
  if (r === 4) return "bg-blue-100 text-blue-700 border-blue-400";
  return "bg-muted text-muted-foreground border-border";
}

// ────────────────────────────────────────────────
// MemberCard component
// ────────────────────────────────────────────────
function MemberCard({
  member,
  isConvener,
  onClick,
  index,
}: {
  member: SampleMember;
  isConvener: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`committee.member_card.${index + 1}`}
      className={`text-left w-full rounded-xl border bg-card transition-smooth hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none cursor-pointer group ${
        isConvener
          ? "border-yellow-400 shadow-lg shadow-yellow-400/20 ring-1 ring-yellow-400/50"
          : "border-border hover:border-primary/30"
      }`}
    >
      <div className="p-5 flex flex-col items-center text-center gap-3">
        <div className="relative">
          <Avatar
            initials={member.initials}
            color={member.avatarColor}
            size={isConvener ? "lg" : "md"}
          />
          {isConvener && (
            <span className="absolute -top-1 -right-1 text-lg">👑</span>
          )}
        </div>
        <div className="min-w-0 w-full">
          <h3
            className={`font-bold text-foreground leading-snug ${isConvener ? "text-lg" : "text-base"}`}
          >
            {member.fullName}
          </h3>
          <span
            className={`inline-block mt-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getDesigBadgeStyle(member.designation)}`}
          >
            {member.designation}
          </span>
        </div>
        <div className="w-full space-y-1">
          {member.phone && (
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <span>📞</span>
              <span className="truncate">{member.phone}</span>
            </p>
          )}
          {member.email && (
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <span>✉️</span>
              <span className="truncate">{member.email}</span>
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

// ────────────────────────────────────────────────
// Member modal
// ────────────────────────────────────────────────
function MemberDetailModal({
  member,
  onClose,
}: {
  member: SampleMember | null;
  onClose: () => void;
}) {
  if (!member) return null;
  const isConvener = rankOf(member.designation) === 1;
  return (
    <Dialog open={!!member} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-md"
        data-ocid="committee.member_detail.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground font-display">
            সদস্যের বিবরণ
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          <Avatar
            initials={member.initials}
            color={member.avatarColor}
            size="lg"
          />
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">
              {member.fullName}
            </h2>
            <span
              className={`inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full border ${getDesigBadgeStyle(member.designation)}`}
            >
              {member.designation}
            </span>
            {isConvener && (
              <p className="mt-1 text-yellow-600 text-sm font-medium">
                ★ সর্বোচ্চ পদ
              </p>
            )}
          </div>
          <div className="w-full space-y-3 bg-muted/50 rounded-lg p-4">
            <DetailRow icon="📞" label="ফোন" value={member.phone} />
            <DetailRow icon="✉️" label="ইমেইল" value={member.email} />
            <DetailRow icon="📍" label="ঠিকানা" value={member.fullAddress} />
            <DetailRow icon="🏷️" label="পদবী" value={member.designation} />
          </div>
        </div>
        <div className="flex justify-end pt-1">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="committee.member_detail.close_button"
          >
            বন্ধ করুন
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-base">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground break-words">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Section banner (red/green header)
// ────────────────────────────────────────────────
function SectionBanner({
  title,
  variant = "green",
}: {
  title: string;
  variant?: "green" | "red" | "gold";
}) {
  const styles = {
    green: "bg-[#006A4E] text-white",
    red: "bg-[#DC143C] text-white",
    gold: "bg-gradient-to-r from-yellow-600 to-yellow-400 text-white",
  };
  return (
    <div
      className={`flex items-center gap-3 px-5 py-3 rounded-lg ${styles[variant]} shadow-sm mb-4`}
    >
      <span className="text-lg">
        {variant === "gold" ? "👑" : variant === "red" ? "🔴" : "🟢"}
      </span>
      <h2 className="font-display font-bold text-base md:text-lg tracking-wide">
        {title}
      </h2>
    </div>
  );
}

// ────────────────────────────────────────────────
// Convert real Member → SampleMember
// ────────────────────────────────────────────────
function toSample(m: Member, idx: number): SampleMember {
  const colors = [
    "#006A4E",
    "#DC143C",
    "#1a5276",
    "#6c3483",
    "#784212",
    "#186a3b",
    "#1b4f72",
  ];
  const name = m.fullName || "";
  const words = name.trim().split(/\s+/);
  const initials =
    words.length >= 2
      ? words[0][0] + words[words.length - 1][0]
      : name.slice(0, 2);
  return {
    id: m.id.toString(),
    fullName: m.fullName,
    designation: m.designation,
    phone: m.phone,
    email: m.email,
    fullAddress: m.fullAddress,
    avatarColor: colors[idx % colors.length],
    initials,
  };
}

// ────────────────────────────────────────────────
// Main page
// ────────────────────────────────────────────────
export default function CommitteePage() {
  const { data: rawMembers, isLoading: membersLoading } = useMembers();
  const { data: designations } = useDesignations();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("সকল");
  const [selectedMember, setSelectedMember] = useState<SampleMember | null>(
    null,
  );

  // Use real data if available, otherwise sample data
  const allMembers: SampleMember[] = useMemo(() => {
    if (rawMembers && rawMembers.length > 0) {
      return rawMembers
        .filter(
          (m) =>
            m.status === "approved" ||
            Object.keys(m.status).includes("approved"),
        )
        .map((m, i) => toSample(m as unknown as Member, i));
    }
    return SAMPLE_COMMITTEE;
  }, [rawMembers]);

  // Build designation filter list
  const designationFilters = useMemo(() => {
    if (designations && designations.length > 0) {
      return ["সকল", ...designations.map((d) => d.title)];
    }
    const unique = Array.from(new Set(allMembers.map((m) => m.designation)));
    unique.sort((a, b) => rankOf(a) - rankOf(b));
    return ["সকল", ...unique];
  }, [designations, allMembers]);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = allMembers;
    if (activeFilter !== "সকল") {
      list = list.filter((m) => m.designation === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.fullName.toLowerCase().includes(q) ||
          m.designation.toLowerCase().includes(q),
      );
    }
    return [...list].sort(
      (a, b) => rankOf(a.designation) - rankOf(b.designation),
    );
  }, [allMembers, activeFilter, search]);

  // Group by designation
  const grouped = useMemo(() => {
    const map: Map<string, SampleMember[]> = new Map();
    for (const m of filtered) {
      const existing = map.get(m.designation) ?? [];
      map.set(m.designation, [...existing, m]);
    }
    return Array.from(map.entries()).sort(([a], [b]) => rankOf(a) - rankOf(b));
  }, [filtered]);

  const convener = filtered.find((m) => rankOf(m.designation) === 1);

  const isLoading = membersLoading;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6 pb-8">
        {/* Page heading */}
        <div className="text-center pt-2">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#006A4E] mb-1">
            কমিটি তালিকা
          </h1>
          <p className="text-muted-foreground text-sm">
            ২নং কপিলমুনি ইউনিয়ন ছাত্রদল — কার্যনির্বাহী কমিটি
          </p>
          <div className="h-1 w-24 mx-auto mt-3 rounded-full bg-gradient-to-r from-[#006A4E] via-[#DC143C] to-[#006A4E]" />
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="নাম বা পদবী দিয়ে খুঁজুন..."
            className="pl-9 pr-9"
            data-ocid="committee.search_input"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="clear"
              data-ocid="committee.search_clear_button"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Designation filter buttons */}
        <div
          className="flex flex-wrap gap-2 justify-center"
          data-ocid="committee.designation_filters"
        >
          {designationFilters.map((d) => (
            <Button
              key={d}
              type="button"
              size="sm"
              variant={activeFilter === d ? "default" : "outline"}
              onClick={() => setActiveFilter(d)}
              data-ocid={`committee.filter.${d === "সকল" ? "all" : d.replace(/\s+/g, "_").replace(/[^a-z0-9_]/gi, "")}`}
              className={`text-xs rounded-full transition-smooth ${
                activeFilter === d
                  ? "bg-[#006A4E] hover:bg-[#005a40] text-white border-transparent"
                  : "border-border hover:border-[#006A4E] hover:text-[#006A4E]"
              }`}
            >
              {d}
            </Button>
          ))}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="committee.loading_state"
          >
            {["s1", "s2", "s3", "s4", "s5", "s6"].map((sk) => (
              <div key={sk} className="rounded-xl border border-border p-5">
                <div className="flex flex-col items-center gap-3">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Convener — special full-width card */}
        {!isLoading && convener && activeFilter === "সকল" && !search && (
          <section>
            <SectionBanner title="আহ্বায়ক" variant="gold" />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setSelectedMember(convener)}
                data-ocid="committee.convener_card"
                className="max-w-sm w-full text-left rounded-xl border-2 border-yellow-400 bg-card shadow-xl shadow-yellow-400/20 ring-2 ring-yellow-400/40 transition-smooth hover:shadow-2xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <div className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="relative">
                    <Avatar
                      initials={convener.initials}
                      color={convener.avatarColor}
                      size="lg"
                    />
                    <span className="absolute -top-2 -right-2 text-2xl">
                      👑
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {convener.fullName}
                    </h3>
                    <span className="inline-block mt-1.5 px-3 py-1 text-sm font-semibold rounded-full border bg-yellow-500/20 text-yellow-700 border-yellow-400">
                      {convener.designation}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm text-muted-foreground">
                      📞 {convener.phone}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ✉️ {convener.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      📍 {convener.fullAddress}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </section>
        )}

        {/* All other members grouped by designation */}
        {!isLoading && (
          <div className="space-y-8">
            {activeFilter !== "সকল" || search ? (
              // Flat grid when filtered
              <>
                {filtered.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3"
                    data-ocid="committee.empty_state"
                  >
                    <span className="text-4xl">🔍</span>
                    <p className="text-lg font-medium">কোন সদস্য পাওয়া যায়নি</p>
                    <p className="text-sm">অনুসন্ধান পরিবর্তন করুন</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((m, i) => (
                      <MemberCard
                        key={m.id}
                        member={m}
                        isConvener={rankOf(m.designation) === 1}
                        onClick={() => setSelectedMember(m)}
                        index={i}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              // Grouped sections
              grouped
                .filter(([desig]) => rankOf(desig) !== 1)
                .map(([desig, members]) => (
                  <section key={desig}>
                    <SectionBanner
                      title={desig}
                      variant={rankOf(desig) <= 3 ? "red" : "green"}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {members.map((m, i) => (
                        <MemberCard
                          key={m.id}
                          member={m}
                          isConvener={false}
                          onClick={() => setSelectedMember(m)}
                          index={i}
                        />
                      ))}
                    </div>
                  </section>
                ))
            )}
          </div>
        )}

        {/* Khulna District Section */}
        {!search && activeFilter === "সকল" && (
          <section className="mt-10">
            <div className="h-px bg-border mb-8" />
            <SectionBanner title="খুলনা জেলা ও উপজেলা নেতৃত্ব" variant="green" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {KHULNA_LEADERS.map((m, i) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMember(m)}
                  data-ocid={`committee.khulna_leader.${i + 1}`}
                  className="text-left rounded-xl border border-[#006A4E]/30 bg-card p-5 flex flex-col items-center text-center gap-3 transition-smooth hover:shadow-lg hover:border-[#006A4E]/60 hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Avatar
                    initials={m.initials}
                    color={m.avatarColor}
                    size="md"
                  />
                  <div>
                    <h3 className="font-bold text-foreground text-base">
                      {m.fullName}
                    </h3>
                    <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-semibold rounded-full border bg-green-100 text-green-700 border-green-500">
                      {m.designation}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">📞 {m.phone}</p>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Member detail modal */}
      <MemberDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </Layout>
  );
}
