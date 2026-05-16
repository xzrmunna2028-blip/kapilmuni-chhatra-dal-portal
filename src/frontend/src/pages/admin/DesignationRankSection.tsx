import type { Designation, Member } from "@/backend";
import { MemberStatus } from "@/backend";
import { useBackend } from "@/hooks/useBackend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GripVertical, Pencil, X } from "lucide-react";
import { useState } from "react";
import { SectionHeader, Spinner } from "./AdminShared";

export function DesignationRankSection({
  show,
}: {
  show: (msg: string, type?: "success" | "error") => void;
}) {
  const { actor } = useBackend();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [rank, setRank] = useState("");
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [editDesig, setEditDesig] = useState("");
  const [editRank, setEditRank] = useState("");

  const { data: designations = [] } = useQuery<Designation[]>({
    queryKey: ["designations"],
    queryFn: async () => (actor ? actor.listDesignations() : []),
    enabled: !!actor,
  });

  const { data: approvedMembers = [] } = useQuery<Member[]>({
    queryKey: ["members", "approved"],
    queryFn: async () =>
      actor ? actor.listMembersByStatus(MemberStatus.approved) : [],
    enabled: !!actor,
  });

  const addDesignation = useMutation({
    mutationFn: async ({ t, r }: { t: string; r: bigint }) => {
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

  const updateDesignation = useMutation({
    mutationFn: async ({
      id,
      desig,
      r,
    }: { id: bigint; desig: string; r: bigint }) => {
      if (!actor) throw new Error("no actor");
      return actor.updateMemberDesignation(id, desig, r);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
      show("পদবী আপডেট হয়েছে");
      setEditMember(null);
    },
    onError: () => show("আপডেট ব্যর্থ হয়েছে", "error"),
  });

  const sortedDesig = [...designations].sort(
    (a, b) => Number(a.rank) - Number(b.rank),
  );
  const sortedMembers = [...approvedMembers].sort(
    (a, b) => Number(a.rank) - Number(b.rank),
  );

  return (
    <div data-ocid="admin.designations_section">
      <SectionHeader
        icon="🏅"
        title="পদবী ও র‍্যাংক"
        description="সদস্যদের পদবী পরিবর্তন করুন, র‍্যাংক সাজান এবং পদবীর টেমপ্লেট পরিচালনা করুন"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Ranks */}
        <div>
          <h3 className="font-bold text-[#1a2e1a] mb-3 flex items-center gap-2">
            <span className="w-5 h-5 bg-[#006A4E] text-white rounded text-xs flex items-center justify-center font-bold">
              M
            </span>
            অনুমোদিত সদস্যদের পদবী সম্পাদনা
          </h3>
          <div className="space-y-2">
            {sortedMembers.map((m, i) => (
              <div
                key={String(m.id)}
                data-ocid={`admin.designations.member.${i + 1}`}
                className="bg-card rounded-lg px-4 py-3 border border-border flex items-center gap-3"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="w-6 h-6 bg-[#006A4E] text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                  {Number(m.rank) || i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1a2e1a] text-sm truncate">
                    {m.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {m.designation}
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid={`admin.designations.edit_button.${i + 1}`}
                  onClick={() => {
                    setEditMember(m);
                    setEditDesig(m.designation);
                    setEditRank(String(m.rank));
                  }}
                  className="p-1.5 rounded hover:bg-muted transition-colors text-[#1a2e1a]"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {sortedMembers.length === 0 && (
              <p
                data-ocid="admin.designations.members.empty_state"
                className="text-center text-muted-foreground py-6 text-sm"
              >
                কোনো অনুমোদিত সদস্য নেই
              </p>
            )}
          </div>
        </div>

        {/* Designation Templates */}
        <div>
          <h3 className="font-bold text-[#1a2e1a] mb-3 flex items-center gap-2">
            <span className="w-5 h-5 bg-[#DC143C] text-white rounded text-xs flex items-center justify-center font-bold">
              T
            </span>
            পদবীর টেমপ্লেট
          </h3>
          <div className="bg-card rounded-xl p-4 border border-border mb-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                data-ocid="admin.designations.title_input"
                type="text"
                placeholder="পদবীর নাম (যেমন: সভাপতি)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
              <input
                data-ocid="admin.designations.rank_input"
                type="number"
                placeholder="র‌্যাংক"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className="w-24 border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
              <button
                type="button"
                data-ocid="admin.designations.submit_button"
                disabled={!title.trim() || !rank || addDesignation.isPending}
                onClick={() =>
                  addDesignation.mutate({
                    t: title,
                    r: BigInt(rank),
                  })
                }
                className="bg-[#006A4E] hover:bg-green-800 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1.5 disabled:opacity-60"
              >
                {addDesignation.isPending && <Spinner small />}
                যোগ করুন
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {sortedDesig.map((d, i) => (
              <div
                key={String(d.id)}
                data-ocid={`admin.designations.item.${i + 1}`}
                className="bg-card rounded-lg px-4 py-2.5 border border-border flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs w-6 h-6 bg-[#1a2e1a] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {String(d.rank)}
                  </span>
                  <span className="font-medium text-sm">{d.title}</span>
                </div>
                <button
                  type="button"
                  data-ocid={`admin.designations.delete_button.${i + 1}`}
                  onClick={() => deleteDesignation.mutate(d.id)}
                  disabled={deleteDesignation.isPending}
                  className="text-[#DC143C] hover:text-red-700 text-xs font-semibold disabled:opacity-60 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {sortedDesig.length === 0 && (
              <p
                data-ocid="admin.designations.empty_state"
                className="text-center text-muted-foreground py-6 text-sm"
              >
                কোনো পদবী নেই
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Member Designation Modal */}
      {editMember && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            data-ocid="admin.designations.edit.dialog"
            className="bg-card rounded-xl p-6 w-full max-w-md shadow-2xl border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1a2e1a]">
                পদবী সম্পাদনা: {editMember.fullName}
              </h3>
              <button
                type="button"
                onClick={() => setEditMember(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="edit-designation"
                  className="text-xs font-semibold text-muted-foreground mb-1 block"
                >
                  নতুন পদবী
                </label>
                <input
                  id="edit-designation"
                  data-ocid="admin.designations.edit.desig_input"
                  type="text"
                  value={editDesig}
                  onChange={(e) => setEditDesig(e.target.value)}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>
              <div>
                <label
                  htmlFor="edit-rank"
                  className="text-xs font-semibold text-muted-foreground mb-1 block"
                >
                  নতুন র‌্যাংক নম্বর
                </label>
                <input
                  id="edit-rank"
                  data-ocid="admin.designations.edit.rank_input"
                  type="number"
                  value={editRank}
                  onChange={(e) => setEditRank(e.target.value)}
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                data-ocid="admin.designations.edit.save_button"
                disabled={
                  !editDesig.trim() || !editRank || updateDesignation.isPending
                }
                onClick={() =>
                  updateDesignation.mutate({
                    id: editMember.id,
                    desig: editDesig,
                    r: BigInt(editRank),
                  })
                }
                className="flex-1 bg-[#006A4E] hover:bg-green-800 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {updateDesignation.isPending && <Spinner small />}
                সংরক্ষণ করুন
              </button>
              <button
                type="button"
                onClick={() => setEditMember(null)}
                className="flex-1 border border-border py-2.5 rounded-lg font-semibold hover:bg-muted"
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
