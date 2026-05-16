import type { CreateNoticePayload, Notice } from "@/backend";
import { useBackend } from "@/hooks/useBackend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ConfirmDialog,
  SectionHeader,
  Spinner,
  formatDate,
} from "./AdminShared";

export function NoticesSection({
  show,
}: {
  show: (msg: string, type?: "success" | "error") => void;
}) {
  const { actor } = useBackend();
  const qc = useQueryClient();
  const [form, setForm] = useState<CreateNoticePayload>({
    title: "",
    content: "",
    author: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);

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
      setDeleteConfirm(null);
    },
    onError: () => show("মুছে ফেলা ব্যর্থ হয়েছে", "error"),
  });

  return (
    <div data-ocid="admin.notices_section">
      <SectionHeader
        icon="📢"
        title="নোটিশ বোর্ড"
        description="এখান থেকে নতুন নোটিশ যোগ করুন, আর্কাইভ করুন বা মুছে ফেলুন"
      />

      {/* Create form */}
      <div className="bg-card rounded-xl p-5 shadow-sm border border-border mb-6">
        <h3 className="font-semibold mb-4 text-[#1a2e1a] flex items-center gap-2">
          <span className="w-5 h-5 bg-[#006A4E] text-white rounded text-xs flex items-center justify-center">
            +
          </span>
          নতুন নোটিশ যোগ করুন
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              data-ocid="admin.notices.title_input"
              type="text"
              placeholder="শিরোনাম *"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              className="border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
            <input
              data-ocid="admin.notices.author_input"
              type="text"
              placeholder="লেখক *"
              value={form.author}
              onChange={(e) =>
                setForm((f) => ({ ...f, author: e.target.value }))
              }
              className="border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
          </div>
          <textarea
            data-ocid="admin.notices.content_textarea"
            placeholder="নোটিশের বিষয়বস্তু লিখুন *"
            value={form.content}
            onChange={(e) =>
              setForm((f) => ({ ...f, content: e.target.value }))
            }
            className="w-full border border-input rounded-lg px-3 py-2 text-sm min-h-[100px] resize-none outline-none focus:ring-2 focus:ring-[#006A4E]"
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
            className="bg-[#006A4E] hover:bg-green-800 text-white px-6 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 disabled:opacity-60 transition-colors"
          >
            {createNotice.isPending && <Spinner small />}
            নোটিশ প্রকাশ করুন
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {notices.map((n, i) => (
          <div
            key={String(n.id)}
            data-ocid={`admin.notices.item.${i + 1}`}
            className="bg-card rounded-xl p-4 shadow-sm border border-border"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#1a2e1a] flex items-center gap-2">
                  {n.title}
                  {n.archived && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-0.5 rounded-full">
                      আর্কাইভড
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {n.author} · {formatDate(n.date)}
                </p>
                <p className="text-sm mt-1.5 text-foreground line-clamp-2">
                  {n.content}
                </p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                {!n.archived && (
                  <button
                    type="button"
                    data-ocid={`admin.notices.archive_button.${i + 1}`}
                    onClick={() => archiveNotice.mutate(n.id)}
                    disabled={archiveNotice.isPending}
                    className="text-xs border border-border px-2.5 py-1.5 rounded-lg hover:bg-muted font-semibold disabled:opacity-60 transition-colors"
                  >
                    আর্কাইভ
                  </button>
                )}
                <button
                  type="button"
                  data-ocid={`admin.notices.delete_button.${i + 1}`}
                  onClick={() => setDeleteConfirm(n.id)}
                  disabled={deleteNotice.isPending}
                  className="text-[#DC143C] hover:text-red-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50 disabled:opacity-60 transition-colors"
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
            className="bg-card rounded-xl p-10 text-center border border-border"
          >
            <p className="text-3xl mb-2">📭</p>
            <p className="text-muted-foreground">কোনো নোটিশ নেই</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteConfirm !== null}
        message="এই নোটিশটি স্থায়ীভাবে মুছে ফেলতে চান?"
        onConfirm={() =>
          deleteConfirm !== null && deleteNotice.mutate(deleteConfirm)
        }
        onCancel={() => setDeleteConfirm(null)}
        isPending={deleteNotice.isPending}
        confirmLabel="হ্যাঁ, মুছুন"
        danger
      />
    </div>
  );
}
