import { MemberStatus } from "@/backend";
import type { Member } from "@/backend";
import { DashboardStats } from "@/components/DashboardStats";
import Layout from "@/components/Layout";
import { MemberGrid } from "@/components/MemberGrid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import {
  useChatMessages,
  useMemberStats,
  useMembers,
  useMyProfile,
} from "@/lib/api";
import { generateMembershipPDF } from "@/lib/pdf";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  FileDown,
  LogIn,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  Shield,
  Star,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

function formatDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getBengaliDate(): string {
  return new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function getDaysSince(ts: bigint): number {
  const ms = Number(ts / 1_000_000n);
  const diff = Date.now() - ms;
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

// --- Hero Header ---
function DashboardHero({ member }: { member: Member }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative overflow-hidden rounded-2xl text-white"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.28 0.12 155) 0%, oklch(0.22 0.08 160) 40%, oklch(0.18 0.06 22) 100%)",
      }}
      data-ocid="dashboard.hero_section"
    >
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10"
        style={{ background: "oklch(0.8 0.15 85)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-5"
        style={{ background: "oklch(0.7 0.2 22)" }}
      />
      <div
        className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full opacity-10"
        style={{ background: "oklch(0.9 0.1 85)" }}
      />
      <div
        className={`relative z-10 px-6 py-8 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative shrink-0">
            <Avatar
              className="w-20 h-20 border-4 shadow-2xl"
              style={{ borderColor: "oklch(0.72 0.15 85 / 0.8)" }}
            >
              <AvatarImage
                src={member.photoBlob.getDirectURL()}
                alt={member.fullName}
              />
              <AvatarFallback
                className="text-2xl font-bold"
                style={{ background: "oklch(0.38 0.12 155)", color: "white" }}
              >
                {getInitials(member.fullName)}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white bg-green-400 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white/70 text-sm mb-0.5">{getBengaliDate()}</p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold leading-tight">
              স্বাগতম, {member.fullName}!
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge
                className="font-semibold border-0 text-xs"
                style={{
                  background: "oklch(0.72 0.15 85 / 0.25)",
                  color: "oklch(0.9 0.1 85)",
                }}
              >
                <Star className="w-3 h-3 mr-1" />
                {member.designation}
              </Badge>
              {member.status === MemberStatus.approved && (
                <Badge
                  className="font-semibold border-0 text-xs"
                  style={{
                    background: "oklch(0.45 0.15 155 / 0.4)",
                    color: "oklch(0.85 0.1 155)",
                  }}
                >
                  <Shield className="w-3 h-3 mr-1" />
                  অনুমোদিত সদস্য
                </Badge>
              )}
              {member.rank > 0n && (
                <Badge
                  className="font-semibold border-0 text-xs"
                  style={{
                    background: "oklch(0.49 0.21 22 / 0.3)",
                    color: "oklch(0.85 0.1 22)",
                  }}
                >
                  ক্রম #{Number(member.rank)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Profile Card ---
function ProfileCard({ member }: { member: Member }) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const isApproved = member.status === MemberStatus.approved;

  async function handlePdfDownload() {
    setPdfLoading(true);
    try {
      await generateMembershipPDF(member);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <Card
      className="overflow-hidden shadow-md"
      data-ocid="dashboard.profile_card"
    >
      <div className="h-3 bg-gradient-to-r from-primary via-primary/80 to-accent" />
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center gap-3 shrink-0">
            <Avatar className="w-28 h-28 border-4 border-primary/30 shadow-lg">
              <AvatarImage
                src={member.photoBlob.getDirectURL()}
                alt={member.fullName}
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                {getInitials(member.fullName)}
              </AvatarFallback>
            </Avatar>
            <Badge
              className={`text-xs font-bold px-3 py-1 ${
                isApproved
                  ? "bg-green-100 text-green-800 border-green-300"
                  : "bg-amber-100 text-amber-800 border-amber-300"
              }`}
              variant="outline"
              data-ocid="dashboard.status_badge"
            >
              {isApproved ? "✅ অনুমোদিত" : "⏳ পর্যালোচনাধীন"}
            </Badge>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-display font-bold text-foreground mb-1">
              {member.fullName}
            </h2>
            <Badge
              className="bg-primary text-primary-foreground font-semibold mb-4"
              data-ocid="dashboard.designation_badge"
            >
              {member.designation}
            </Badge>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 shrink-0 text-primary" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 shrink-0 text-primary" />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground sm:col-span-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                <span className="break-words">{member.fullAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4 shrink-0 text-primary" />
                <span>যোগদান: {formatDate(member.registeredAt)}</span>
              </div>
              {member.approvedAt && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserCheck className="w-4 h-4 shrink-0 text-green-600" />
                  <span>অনুমোদন: {formatDate(member.approvedAt)}</span>
                </div>
              )}
            </div>
            {isApproved && member.adminSignature && (
              <div className="mb-4 p-3 rounded-lg border border-amber-200 bg-amber-50/60 flex items-center gap-3">
                <span className="text-2xl">🎖️</span>
                <div>
                  <p className="text-xs font-bold text-amber-700">
                    এডমিন অনুমোদন সত্যায়িত
                  </p>
                  <p className="text-xs text-amber-600 italic">
                    {member.adminSignature}
                  </p>
                </div>
              </div>
            )}
            <Button
              type="button"
              onClick={handlePdfDownload}
              disabled={pdfLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 shadow-md"
              data-ocid="dashboard.pdf_download_button"
            >
              <FileDown className="w-4 h-4" />
              {pdfLoading ? "তৈরি হচ্ছে..." : "সদস্যপদ কার্ড PDF"}
            </Button>
          </div>
        </div>
        {member.joinReason && (
          <div
            className="mt-5 p-4 rounded-xl bg-muted/50 border-l-4 border-accent"
            data-ocid="dashboard.join_reason_card"
          >
            <div className="flex items-start gap-3">
              <Quote className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-1">
                  কেন ছাত্রদলে যোগ দিয়েছেন
                </p>
                <p className="text-foreground text-sm italic leading-relaxed">
                  {member.joinReason}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Pending State ---
function PendingState({ member }: { member: Member }) {
  return (
    <div className="space-y-6">
      <div
        className="relative overflow-hidden rounded-2xl p-6 text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.62 0.15 85 / 0.12) 0%, oklch(0.85 0.1 85 / 0.06) 100%)",
        }}
        data-ocid="dashboard.pending_state"
      >
        <div className="pending-pulse text-7xl mb-4">⏳</div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          অপেক্ষায় আছেন
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
          আপনার নিবন্ধন পর্যালোচনা করা হচ্ছে। অ্যাডমিন অনুমোদন দিলে আপনি সম্পূর্ণ ড্যাশবোর্ড
          অ্যাক্সেস করতে পারবেন।
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <div
            className="w-2 h-2 rounded-full bg-amber-400 pending-dot"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-amber-400 pending-dot"
            style={{ animationDelay: "300ms" }}
          />
          <div
            className="w-2 h-2 rounded-full bg-amber-400 pending-dot"
            style={{ animationDelay: "600ms" }}
          />
        </div>
      </div>
      <ProfileCard member={member} />
    </div>
  );
}

// --- Group Chat CTA ---
function GroupChatCTA({ messageCount }: { messageCount: number }) {
  return (
    <Link to="/chat" data-ocid="dashboard.chat_cta_link">
      <div
        className="relative overflow-hidden rounded-2xl p-5 flex items-center justify-between gap-4 cursor-pointer group"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.35 0.14 155) 0%, oklch(0.28 0.1 160) 100%)",
        }}
        data-ocid="dashboard.chat_cta_section"
      >
        <div
          className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10"
          style={{ background: "oklch(0.8 0.1 85)" }}
        />
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center chat-float shadow-lg"
            style={{ background: "oklch(0.45 0.18 155 / 0.5)" }}
          >
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-white font-display font-bold text-lg">
              গ্রুপ চ্যাটে যোগ দিন
            </p>
            <p className="text-white/70 text-sm">{messageCount} টি বার্তা রয়েছে</p>
          </div>
        </div>
        <Button
          type="button"
          className="bg-white text-primary font-bold gap-2 group-hover:bg-white/90 shadow-md shrink-0"
          data-ocid="dashboard.chat_join_button"
        >
          <MessageCircle className="w-4 h-4" />
          যোগ দিন
        </Button>
      </div>
    </Link>
  );
}

// --- Not Logged In ---
function NotLoggedInState() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4"
      data-ocid="dashboard.not_logged_in_state"
    >
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.38 0.12 155) 0%, oklch(0.49 0.21 22) 100%)",
        }}
      >
        <LogIn className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-2xl font-display font-bold text-foreground mb-3">
        লগইন প্রয়োজন
      </h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        ড্যাশবোর্ড দেখতে আপনাকে প্রথমে লগইন করতে হবে।
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/login">
          <Button
            type="button"
            className="bg-primary text-primary-foreground font-bold gap-2 w-full sm:w-auto"
            data-ocid="dashboard.login_button"
          >
            <LogIn className="w-4 h-4" />
            লগইন করুন
          </Button>
        </Link>
        <Link to="/register">
          <Button
            type="button"
            variant="outline"
            className="gap-2 w-full sm:w-auto"
            data-ocid="dashboard.register_button"
          >
            <UserPlus className="w-4 h-4" />
            নিবন্ধন করুন
          </Button>
        </Link>
      </div>
    </div>
  );
}

// --- No Profile ---
function NoProfileState() {
  return (
    <Card
      className="text-center py-14 px-6 shadow-md"
      data-ocid="dashboard.no_profile_state"
    >
      <CardContent className="pt-0">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <UserPlus className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-display font-bold text-foreground mb-2">
          প্রোফাইল তৈরি করুন
        </h3>
        <p className="text-muted-foreground mb-6">
          আপনি এখনো সদস্যতার জন্য আবেদন করেননি। নিবন্ধন করতে নিচের বাটনে ক্লিক করুন।
        </p>
        <Link to="/register">
          <Button
            type="button"
            className="bg-primary text-primary-foreground font-bold gap-2"
            data-ocid="dashboard.register_now_button"
          >
            <UserPlus className="w-4 h-4" />
            এখনই নিবন্ধন করুন
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// --- Main Dashboard ---
export default function DashboardPage() {
  const { isLoggedIn } = useAuth();
  const { data: member, isLoading: profileLoading } = useMyProfile();
  const { data: allMembers = [], isLoading: membersLoading } = useMembers();
  const { data: stats, isLoading: statsLoading } = useMemberStats();
  const { data: chatMessages = [] } = useChatMessages(10n);

  const approvedMembers = allMembers.filter(
    (m) => m.status === MemberStatus.approved,
  );
  const totalApproved = stats ? Number(stats.total) : approvedMembers.length;
  const myRank = member ? Number(member.rank) : 0;
  const daysSince = member ? getDaysSince(member.registeredAt) : 0;
  const isApproved = member?.status === MemberStatus.approved;
  const isPending = member?.status === MemberStatus.pending;
  const isLoading = profileLoading || statsLoading;

  return (
    <Layout>
      {/* Join CTA Banner */}
      <div
        className="w-full py-4 px-4"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.38 0.2 22) 0%, oklch(0.45 0.22 18) 100%)",
        }}
        data-ocid="dashboard.join_cta_banner"
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-white font-display font-bold text-lg leading-snug">
              আপনি কি আমাদের ছাত্রদলে যোগ দিতে চান?
            </p>
            <p className="text-white/75 text-sm">
              বাংলাদেশ জাতীয়তাবাদী ছাত্রদল — ২নং কপিলমুনি ইউনিয়ন শাখা
            </p>
          </div>
          <Link to="/register">
            <Button
              type="button"
              className="bg-white text-accent hover:bg-white/90 font-bold gap-2 shrink-0 shadow"
              data-ocid="dashboard.cta_join_button"
            >
              <UserPlus className="w-4 h-4" />
              যোগ দিন
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {!isLoggedIn ? (
          <NotLoggedInState />
        ) : isLoading ? (
          <div className="space-y-6" data-ocid="dashboard.loading_state">
            <Skeleton className="h-36 rounded-2xl" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        ) : (
          <div className="space-y-6">
            {member && <DashboardHero member={member} />}

            {member && (
              <DashboardStats
                totalMembers={totalApproved}
                chatCount={chatMessages.length}
                rank={myRank}
                daysSinceJoining={daysSince}
                loading={statsLoading || membersLoading}
              />
            )}

            {!member ? (
              <NoProfileState />
            ) : isPending ? (
              <PendingState member={member} />
            ) : isApproved ? (
              <ProfileCard member={member} />
            ) : null}

            {isApproved && <GroupChatCTA messageCount={chatMessages.length} />}

            {isApproved && (
              <div className="space-y-4" data-ocid="dashboard.members_section">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 rounded-full bg-primary" />
                  <h2 className="text-xl font-display font-bold text-foreground">
                    আমাদের সদস্যবৃন্দ
                  </h2>
                  <Badge variant="secondary" className="ml-auto font-semibold">
                    <Users className="w-3 h-3 mr-1" />
                    {approvedMembers.length} জন
                  </Badge>
                </div>
                <MemberGrid members={allMembers} loading={membersLoading} />
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
