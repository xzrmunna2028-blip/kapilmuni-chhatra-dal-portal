import { MemberStatus } from "@/backend";
import type { Member } from "@/backend";
import { useBackend } from "@/hooks/useBackend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";
import { SectionHeader, Spinner, formatDate } from "./AdminShared";

export function RegistrationRequestsSection({
  show,
}: {
  show: (msg: string, type?: "success" | "error") => void;
}) {
  const { actor } = useBackend();
  const qc = useQueryClient();
  const [approveModal, setApproveModal] = useState<Member | null>(null);
  const [adminSignature, setAdminSignature] = useState("");
  const [rejectModal, setRejectModal] = useState<{
    id: bigint;
    name: string;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: pending = [], isLoading } = useQuery<Member[]>({
    queryKey: ["members", "pending"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMembersByStatus(MemberStatus.pending);
    },
    enabled: !!actor,
  });

  const approve = useMutation({
    mutationFn: async ({ id, sig }: { id: bigint; sig: string }) => {
      if (!actor) throw new Error("no actor");
      return actor.approveMember(id, sig || null);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
      qc.invalidateQueries({ queryKey: ["memberStats"] });
      show("সদস্য সফলভাবে অনুমোদিত হয়েছে");
      setApproveModal(null);
      setAdminSignature("");
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
      <SectionHeader
        icon="📋"
        title={`নিবন্ধন অনুরোধ (${pending.length})`}
        description="এই বিভাগ থেকে নিবন্ধন অনুরোধগুলো পর্যালোচনা করুন এবং অনুমোদন দিন"
      />

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      )}

      {!isLoading && pending.length === 0 && (
        <div
          data-ocid="admin.pending.empty_state"
          className="bg-card rounded-xl p-12 text-center border border-border"
        >
          <div className="text-5xl mb-3">✅</div>
          <p className="text-muted-foreground font-medium">
            কোনো অপেক্ষমাণ অনুরোধ নেই
          </p>
        </div>
      )}

      <div className="space-y-4">
        {pending.map((m, i) => (
          <div
            key={String(m.id)}
            data-ocid={`admin.pending.item.${i + 1}`}
            className="bg-card rounded-xl p-5 shadow-sm border border-border"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Photo */}
              <div className="w-16 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={m.photoBlob.getDirectURL()}
                  alt={m.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/64x80?text=📷";
                  }}
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-[#1a2e1a] text-lg">
                      {m.fullName}
                    </p>
                    <p className="text-sm font-semibold text-[#DC143C]">
                      {m.designation}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {formatDate(m.registeredAt)}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                  <span className="text-muted-foreground">📞 {m.phone}</span>
                  <span className="text-muted-foreground truncate">
                    ✉️ {m.email}
                  </span>
                  <span className="text-muted-foreground sm:col-span-2 truncate">
                    📍 {m.fullAddress}
                  </span>
                </div>
                {m.joinReason && (
                  <p className="text-xs text-muted-foreground mt-2 italic line-clamp-2">
                    💬 {m.joinReason}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-3 border-t border-border">
              <button
                type="button"
                data-ocid={`admin.pending.approve_button.${i + 1}`}
                onClick={() => {
                  setApproveModal(m);
                  setAdminSignature("");
                }}
                className="flex-1 bg-[#006A4E] hover:bg-green-800 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                ✓ অনুমোদন করুন
              </button>
              <button
                type="button"
                data-ocid={`admin.pending.reject_button.${i + 1}`}
                onClick={() => setRejectModal({ id: m.id, name: m.fullName })}
                className="flex-1 bg-[#DC143C] hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                ✗ প্রত্যাখ্যান
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Approve Modal */}
      {approveModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div
            data-ocid="admin.approve.dialog"
            className="bg-card rounded-2xl w-full max-w-lg shadow-2xl border border-border my-4"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-[#1a2e1a] text-lg">
                সদস্য অনুমোদন করুন
              </h3>
              <button
                type="button"
                onClick={() => setApproveModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                <img
                  src={approveModal.photoBlob.getDirectURL()}
                  alt={approveModal.fullName}
                  className="w-16 h-20 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/64x80?text=📷";
                  }}
                />
                <div className="text-sm space-y-1">
                  <p>
                    <strong>নাম:</strong> {approveModal.fullName}
                  </p>
                  <p>
                    <strong>পদবী:</strong> {approveModal.designation}
                  </p>
                  <p>
                    <strong>ফোন:</strong> {approveModal.phone}
                  </p>
                  <p className="truncate">
                    <strong>ইমেইল:</strong> {approveModal.email}
                  </p>
                  <p className="line-clamp-2">
                    <strong>ঠিকানা:</strong> {approveModal.fullAddress}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="adminSignature"
                  className="text-sm font-semibold text-[#1a2e1a]"
                >
                  অ্যাডমিন সিগনেচার (ঐচ্ছিক)
                </label>
                <input
                  id="adminSignature"
                  data-ocid="admin.approve.signature_input"
                  type="text"
                  value={adminSignature}
                  onChange={(e) => setAdminSignature(e.target.value)}
                  placeholder="যেমন: মো. রফিকুল ইসলাম, সভাপতি"
                  className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#006A4E] outline-none"
                />
                <p className="text-xs text-muted-foreground">
                  এই সিগনেচার সদস্যের সার্টিফিকেটে প্রদর্শিত হবে
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-border flex gap-3">
              <button
                type="button"
                data-ocid="admin.approve.confirm_button"
                disabled={approve.isPending}
                onClick={() =>
                  approve.mutate({
                    id: approveModal.id,
                    sig: adminSignature,
                  })
                }
                className="flex-1 bg-[#006A4E] hover:bg-green-800 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
              >
                {approve.isPending && <Spinner small />}✓ অনুমোদন নিশ্চিত করুন
              </button>
              <button
                type="button"
                data-ocid="admin.approve.cancel_button"
                onClick={() => setApproveModal(null)}
                className="flex-1 border border-border py-2.5 rounded-lg font-semibold hover:bg-muted transition-colors"
              >
                বাতিল
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            data-ocid="admin.reject.dialog"
            className="bg-card rounded-xl p-6 w-full max-w-md shadow-2xl border border-border"
          >
            <h3 className="font-bold text-[#1a2e1a] mb-3">
              {rejectModal.name} — প্রত্যাখ্যানের কারণ
            </h3>
            <textarea
              data-ocid="admin.reject.textarea"
              className="w-full border border-input rounded-lg p-3 text-sm min-h-[100px] resize-none focus:ring-2 focus:ring-[#DC143C] outline-none"
              placeholder="প্রত্যাখ্যানের কারণ লিখুন..."
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
                className="flex-1 bg-[#DC143C] hover:bg-red-700 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {reject.isPending && <Spinner small />}
                নিশ্চিত করুন
              </button>
              <button
                type="button"
                data-ocid="admin.reject.cancel_button"
                onClick={() => {
                  setRejectModal(null);
                  setRejectReason("");
                }}
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
