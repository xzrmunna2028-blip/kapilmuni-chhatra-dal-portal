import type { ChatMessage } from "@/backend";
import { useBackend } from "@/hooks/useBackend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ConfirmDialog,
  SectionHeader,
  Spinner,
  formatDateTime,
} from "./AdminShared";

export function ChatModerationSection({
  show,
}: {
  show: (msg: string, type?: "success" | "error") => void;
}) {
  const { actor } = useBackend();
  const qc = useQueryClient();
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);

  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["chatMessages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatMessages(100n);
    },
    enabled: !!actor,
    refetchInterval: 5000,
  });

  const deleteMsg = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("no actor");
      return actor.deleteChatMessage(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chatMessages"] });
      show("বার্তা মুছে ফেলা হয়েছে");
      setDeleteConfirm(null);
    },
    onError: () => show("মুছে ফেলা ব্যর্থ হয়েছে", "error"),
  });

  return (
    <div data-ocid="admin.chat_section">
      <SectionHeader
        icon="💬"
        title="চ্যাট মডারেশন"
        description="সদস্যদের চ্যাট বার্তা পর্যবেক্ষণ করুন এবং অনুপযুক্ত বার্তা মুছে ফেলুন"
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-[#1a2e1a] text-white">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
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
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted-foreground"
                    data-ocid="admin.chat.empty_state"
                  >
                    <div className="text-3xl mb-2">💬</div>
                    কোনো বার্তা নেই
                  </td>
                </tr>
              ) : (
                messages.map((msg, i) => (
                  <tr
                    key={String(msg.id)}
                    data-ocid={`admin.chat.item.${i + 1}`}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {msg.senderPhotoUrl && (
                          <img
                            src={msg.senderPhotoUrl}
                            alt={msg.senderName}
                            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        )}
                        <span className="font-semibold">{msg.senderName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[300px]">
                      <p className="truncate text-foreground">{msg.text}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {formatDateTime(msg.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        data-ocid={`admin.chat.delete_button.${i + 1}`}
                        onClick={() => setDeleteConfirm(msg.id)}
                        disabled={deleteMsg.isPending}
                        className="text-[#DC143C] hover:text-red-700 text-xs font-semibold px-2 py-1 rounded hover:bg-red-50 disabled:opacity-60 transition-colors"
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
        message="এই বার্তাটি স্থায়ীভাবে মুছে ফেলতে চান?"
        onConfirm={() =>
          deleteConfirm !== null && deleteMsg.mutate(deleteConfirm)
        }
        onCancel={() => setDeleteConfirm(null)}
        isPending={deleteMsg.isPending}
        confirmLabel="হ্যাঁ, মুছুন"
        danger
      />
    </div>
  );
}
