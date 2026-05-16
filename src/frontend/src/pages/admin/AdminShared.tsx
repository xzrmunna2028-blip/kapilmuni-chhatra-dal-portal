// Shared helpers, types, and small components used across admin sections
import { MemberStatus } from "@/backend";

export type ToastState = { message: string; type: "success" | "error" } | null;

import { useRef, useState } from "react";

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = (message: string, type: "success" | "error" = "success") => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type });
    timerRef.current = setTimeout(() => setToast(null), 3500);
  };
  return { toast, show };
}

export function Toast({ toast }: { toast: ToastState }) {
  if (!toast) return null;
  return (
    <div
      data-ocid="admin.toast"
      className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl shadow-2xl text-white font-semibold text-sm flex items-center gap-2 transition-all ${
        toast.type === "success"
          ? "bg-[#006A4E] border border-green-400/30"
          : "bg-[#DC143C] border border-red-400/30"
      }`}
    >
      {toast.type === "success" ? "✓" : "✗"} {toast.message}
    </div>
  );
}

export function Spinner({ small }: { small?: boolean }) {
  return (
    <span
      className={`inline-block border-2 border-white border-t-transparent rounded-full animate-spin ${
        small ? "w-3 h-3" : "w-4 h-4"
      }`}
    />
  );
}

export function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("bn-BD");
}

export function formatDateTime(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleString("bn-BD");
}

export function StatusBadge({ status }: { status: MemberStatus }) {
  const map: Record<MemberStatus, { label: string; cls: string }> = {
    [MemberStatus.pending]: {
      label: "অপেক্ষমাণ",
      cls: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    [MemberStatus.approved]: {
      label: "অনুমোদিত",
      cls: "bg-green-100 text-green-800 border-green-200",
    },
    [MemberStatus.rejected]: {
      label: "প্রত্যাখ্যাত",
      cls: "bg-red-100 text-red-800 border-red-200",
    },
  };
  const { label, cls } = map[status] ?? {
    label: status,
    cls: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}
    >
      {label}
    </span>
  );
}

export function SectionHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="mb-6 pb-4 border-b border-border">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-xl font-display font-bold text-[#1a2e1a]">
          {title}
        </h2>
      </div>
      <p className="text-sm text-muted-foreground ml-11">{description}</p>
    </div>
  );
}

export function ConfirmDialog({
  open,
  message,
  onConfirm,
  onCancel,
  isPending,
  confirmLabel = "হ্যাঁ, নিশ্চিত করুন",
  danger = false,
}: {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
  confirmLabel?: string;
  danger?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-6 w-full max-w-sm shadow-2xl border border-border">
        <p className="font-bold text-[#1a2e1a] mb-5 text-center text-base">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-colors ${
              danger
                ? "bg-[#DC143C] hover:bg-red-700"
                : "bg-[#006A4E] hover:bg-green-800"
            }`}
          >
            {isPending && <Spinner small />}
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-border py-2.5 rounded-lg font-semibold hover:bg-muted transition-colors"
          >
            বাতিল
          </button>
        </div>
      </div>
    </div>
  );
}
