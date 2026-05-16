import type { Member } from "@/backend";
import { MemberStatus } from "@/backend";
import { useBackend } from "@/hooks/useBackend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ConfirmDialog,
  SectionHeader,
  Spinner,
  StatusBadge,
  formatDate,
} from "./AdminShared";

export function MemberManagementSection({
  show,
}: {
  show: (msg: string, type?: "success" | "error") => void;
}) {
  const { actor } = useBackend();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | MemberStatus>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);

  const { data: members = [], isLoading } = useQuery<Member[]>({
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
      const header = "নাম,পদবী,ফোন,ইমেইল,স্ট্যাটাস,তারিখ";
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
      a.download = "chhatra-dal-members.csv";
      a.click();
      URL.revokeObjectURL(url);
      show("CSV ডাউনলোড হচ্ছে");
    } catch {
      show("CSV তৈরি ব্যর্থ হয়েছে", "error");
    }
  };

  return (
    <div data-ocid="admin.members_section">
      <SectionHeader
        icon="👥"
        title="সদস্য ব্যবস্থাপনা"
        description="এখান থেকে সকল সদস্য পরিচালনা করুন — দেখুন, খুঁজুন, সম্পাদনা করুন বা মুছে ফেলুন"
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <input
          data-ocid="admin.members.search_input"
          type="text"
          placeholder="নাম, ফোন বা ইমেইল খুঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006A4E] outline-none"
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
        <button
          type="button"
          data-ocid="admin.members.export_button"
          onClick={handleExport}
          className="bg-[#1a2e1a] hover:bg-green-900 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          CSV ডাউনলোড
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[660px]">
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
                    className="px-4 py-10 text-center text-muted-foreground"
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
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={m.photoBlob.getDirectURL()}
                          alt={m.fullName}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                        <span className="font-semibold truncate max-w-[140px]">
                          {m.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {m.designation}
                    </td>
                    <td className="px-4 py-3">{m.phone}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {formatDate(m.registeredAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        data-ocid={`admin.members.delete_button.${i + 1}`}
                        onClick={() => setDeleteConfirm(m.id)}
                        className="text-[#DC143C] hover:text-red-800 font-semibold text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
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
      )}

      <ConfirmDialog
        open={deleteConfirm !== null}
        message="আপনি কি নিশ্চিত যে এই সদস্যকে স্থায়ীভাবে মুছে ফেলবেন?"
        onConfirm={() =>
          deleteConfirm !== null && deleteMember.mutate(deleteConfirm)
        }
        onCancel={() => setDeleteConfirm(null)}
        isPending={deleteMember.isPending}
        confirmLabel="হ্যাঁ, মুছুন"
        danger
      />
    </div>
  );
}
