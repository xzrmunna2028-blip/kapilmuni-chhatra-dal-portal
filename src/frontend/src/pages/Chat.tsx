import type { ChatMessage } from "@/backend";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useChatMessages, useSendChatMessage } from "@/lib/api";
import { LogIn, MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ── Timestamp helper ──────────────────────────────────────────────────────────
function toBengaliRelativeTime(nsTimestamp: bigint): string {
  const msTimestamp = Number(nsTimestamp / 1_000_000n);
  const diffMs = Date.now() - msTimestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  const toBengaliNum = (n: number) =>
    n
      .toString()
      .replace(/0/g, "০")
      .replace(/1/g, "১")
      .replace(/2/g, "২")
      .replace(/3/g, "৩")
      .replace(/4/g, "৪")
      .replace(/5/g, "৫")
      .replace(/6/g, "৬")
      .replace(/7/g, "৭")
      .replace(/8/g, "৮")
      .replace(/9/g, "৯");

  if (diffSec < 30) return "এইমাত্র";
  if (diffSec < 60) return `${toBengaliNum(diffSec)} সেকেন্ড আগে`;
  if (diffMin < 60) return `${toBengaliNum(diffMin)} মিনিট আগে`;
  if (diffHr < 24) return `${toBengaliNum(diffHr)} ঘন্টা আগে`;
  return `${toBengaliNum(diffDay)} দিন আগে`;
}

// ── Avatar initials ───────────────────────────────────────────────────────────
function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// ── Single Message Bubble ─────────────────────────────────────────────────────
function MessageBubble({
  msg,
  isOwn,
  index,
}: {
  msg: ChatMessage;
  isOwn: boolean;
  index: number;
}) {
  return (
    <div
      data-ocid={`chat.message.item.${index + 1}`}
      className={`flex gap-2 items-end max-w-[80%] ${
        isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
      }`}
    >
      {/* Avatar */}
      {msg.senderPhotoUrl ? (
        <img
          src={msg.senderPhotoUrl}
          alt={msg.senderName}
          className="w-8 h-8 rounded-full object-cover shrink-0 border-2 border-primary/30"
        />
      ) : (
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white ${
            isOwn ? "bg-primary" : "bg-accent"
          }`}
        >
          {getInitials(msg.senderName)}
        </div>
      )}

      {/* Bubble */}
      <div
        className={`flex flex-col gap-0.5 ${isOwn ? "items-end" : "items-start"}`}
      >
        {!isOwn && (
          <span className="text-xs font-semibold text-primary px-1">
            {msg.senderName}
          </span>
        )}
        <div
          className={`rounded-2xl px-4 py-2 text-sm leading-relaxed max-w-xs break-words ${
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-card text-card-foreground border border-primary/20 rounded-bl-sm"
          }`}
        >
          {msg.text}
        </div>
        <span className="text-[10px] text-muted-foreground px-1">
          {toBengaliRelativeTime(msg.timestamp)}
        </span>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const { isLoggedIn, principal } = useAuth();
  const { data: messages, isLoading } = useChatMessages(100n);
  const sendMutation = useSendChatMessage();

  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Derive a stable display name from IC principal
  const displayName = principal ? `${principal.slice(0, 8)}...` : "সদস্য";

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !isLoggedIn) return;
    sendMutation.mutate(
      { text: trimmed, senderName: displayName, senderPhotoUrl: "" },
      {
        onSuccess: () => {
          setText("");
          textareaRef.current?.focus();
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Login Prompt ──────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <h2
              className="text-xl font-bold text-foreground mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              গ্রুপ চ্যাট
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              চ্যাটে অংশ নিতে আপনাকে লগইন করতে হবে।
            </p>
            <a href="/login">
              <Button
                className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 w-full"
                data-ocid="chat.login_button"
              >
                <LogIn className="w-4 h-4" />
                লগইন করুন
              </Button>
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Full-height chat layout inside page */}
      <div
        className="flex flex-col"
        style={{ height: "calc(100dvh - 4rem)" }}
        data-ocid="chat.page"
      >
        {/* Header */}
        <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1
              className="font-bold text-foreground text-base"
              style={{ fontFamily: "var(--font-display)" }}
            >
              গ্রুপ চ্যাট
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">সরাসরি সংযুক্ত</span>
            </div>
          </div>
        </div>

        {/* Message List */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-background"
          data-ocid="chat.message.list"
        >
          {/* System welcome message */}
          <div className="flex justify-center">
            <span className="bg-muted text-muted-foreground text-xs px-3 py-1.5 rounded-full">
              🇧🇩 ২নং কপিলমুনি ইউনিয়ন ছাত্রদলের গ্রুপ চ্যাটে আপনাকে স্বাগতম
            </span>
          </div>

          {/* Loading skeleton */}
          {isLoading && (
            <div className="space-y-4" data-ocid="chat.loading_state">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${
                    i % 2 === 0
                      ? "flex-row-reverse ml-auto max-w-[60%]"
                      : "max-w-[60%]"
                  }`}
                >
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <Skeleton className="h-12 rounded-2xl flex-1" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && (!messages || messages.length === 0) && (
            <div
              className="flex flex-col items-center justify-center py-16 gap-3"
              data-ocid="chat.empty_state"
            >
              <MessageCircle className="w-12 h-12 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">এখনো কোনো বার্তা নেই</p>
              <p className="text-muted-foreground/60 text-xs">প্রথম বার্তা পাঠান!</p>
            </div>
          )}

          {/* Messages */}
          {!isLoading &&
            messages?.map((msg, index) => (
              <MessageBubble
                key={msg.id.toString()}
                msg={msg}
                isOwn={msg.senderName === displayName}
                index={index}
              />
            ))}

          {/* Auto-scroll anchor */}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="shrink-0 bg-card border-t border-border px-4 py-3">
          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              data-ocid="chat.message_input"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 500))}
              onKeyDown={handleKeyDown}
              placeholder="বার্তা লিখুন... (Enter পাঠাতে)"
              rows={1}
              className="flex-1 resize-none rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring min-h-[42px] max-h-[120px] overflow-y-auto"
            />

            <Button
              data-ocid="chat.send_button"
              type="button"
              onClick={handleSend}
              disabled={!text.trim() || sendMutation.isPending}
              className="shrink-0 h-[42px] w-[42px] p-0 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground transition-smooth"
            >
              <Send className="w-4 h-4" />
              <span className="sr-only">পাঠান</span>
            </Button>
          </div>

          {/* Char counter */}
          {text.length > 400 && (
            <div className="flex justify-end mt-1">
              <span
                className={`text-xs ${
                  text.length >= 500
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {text.length}/500
              </span>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
