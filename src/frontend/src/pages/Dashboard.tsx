import { MemberStatus } from "@/backend";
import type { Member } from "@/backend";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useMyProfile } from "@/lib/api";
import { generateMembershipPDF } from "@/lib/pdf";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Calendar,
  FileDown,
  Image,
  LogIn,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";

function formatDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("bn-BD", {
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

const QUICK_LINKS = [
  {
    href: "/chat",
    icon: MessageCircle,
    label: "গ্রুপ চ্যাট",
    color: "bg-primary/10 text-primary",
  },
  {
    href: "/committee",
    icon: Users,
    label: "কমিটি",
    color: "bg-accent/10 text-accent",
  },
  {
    href: "/notices",
    icon: Bell,
    label: "নোটিশ বোর্ড",
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    href: "/gallery",
    icon: Image,
    label: "গ্যালারি",
    color: "bg-chart-3/10 text-chart-3",
  },
];

function ProfileCard({ member }: { member: Member }) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const photoUrl = member.photoBlob.getDirectURL();

  async function handlePdfDownload() {
    setPdfLoading(true);
    try {
      await generateMembershipPDF(member);
    } finally {
      setPdfLoading(false);
    }
  }

  const isApproved = member.status === MemberStatus.approved;
  const isPending = member.status === MemberStatus.pending;

  return (
    <div className="space-y-6">
      {/* Pending Warning */}
      {isPending && (
        <div
          className="border border-yellow-400/50 bg-yellow-50/50 rounded-xl p-4 flex items-start gap-3"
          data-ocid="dashboard.pending_warning"
        >
          <span className="text-2xl">⏳</span>
          <div>
            <p className="font-semibold text-foreground">আবেদন পর্যালোচনাধীন</p>
            <p className="text-sm text-muted-foreground mt-1">
              আপনার সদস্যপদের আবেদন পর্যালোচনাধীন রয়েছে। অনুমোদনের পর আপনি সম্পূর্ণ
              অ্যাক্সেস পাবেন।
            </p>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <Card
        className="overflow-hidden shadow-md"
        data-ocid="dashboard.profile_card"
      >
        {/* Green header strip */}
        <div className="h-24 bg-gradient-to-r from-primary to-primary/70" />
        <CardContent className="pt-0 px-6 pb-6">
          {/* Avatar row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 mb-6">
            <div className="relative">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={member.fullName}
                  className="w-24 h-24 rounded-full border-4 border-card object-cover shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-card bg-primary flex items-center justify-center shadow-md">
                  <span className="text-primary-foreground font-display text-2xl font-bold">
                    {getInitials(member.fullName)}
                  </span>
                </div>
              )}
              <span
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card ${
                  isApproved
                    ? "bg-green-500"
                    : isPending
                      ? "bg-yellow-400"
                      : "bg-destructive"
                }`}
              />
            </div>
            <Badge
              className={`text-sm font-semibold px-4 py-1 ${
                isApproved
                  ? "bg-green-100 text-green-800 border-green-300"
                  : "bg-yellow-100 text-yellow-800 border-yellow-300"
              }`}
              variant="outline"
              data-ocid="dashboard.status_badge"
            >
              {isApproved ? "✅ অনুমোদিত" : "⏳ অনুমোদন প্রক্রিয়াধীন"}
            </Badge>
          </div>

          {/* Name & designation */}
          <div className="mb-5">
            <h2 className="text-2xl font-display font-bold text-foreground">
              {member.fullName}
            </h2>
            <Badge
              className="mt-2 bg-primary text-primary-foreground font-semibold"
              data-ocid="dashboard.designation_badge"
            >
              {member.designation}
            </Badge>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4 shrink-0" />
              <span className="truncate">{member.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4 shrink-0" />
              <span>{member.phone}</span>
            </div>
            <div className="flex items-start gap-2 text-muted-foreground sm:col-span-2">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="break-words">{member.fullAddress}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>সদস্য হয়েছেন: {formatDate(member.registeredAt)}</span>
            </div>
            {member.approvedAt !== undefined && member.approvedAt !== null && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserCheck className="w-4 h-4 shrink-0" />
                <span>অনুমোদন: {formatDate(member.approvedAt)}</span>
              </div>
            )}
          </div>

          {/* PDF Download */}
          <Button
            type="button"
            onClick={handlePdfDownload}
            disabled={pdfLoading}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
            data-ocid="dashboard.pdf_download_button"
          >
            <FileDown className="w-4 h-4" />
            {pdfLoading ? "তৈরি হচ্ছে..." : "সদস্যপদ কার্ড ডাউনলোড (PDF)"}
          </Button>
        </CardContent>
      </Card>

      {/* Join Reason Quote */}
      {member.joinReason && (
        <Card
          className="border-l-4 border-l-accent bg-card"
          data-ocid="dashboard.join_reason_card"
        >
          <CardContent className="pt-5 pb-5 px-6">
            <div className="flex items-start gap-3">
              <Quote className="w-6 h-6 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">
                  কেন ছাত্রদলে যোগ দিয়েছেন
                </p>
                <p className="text-foreground italic leading-relaxed">
                  {member.joinReason}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function QuickLinks() {
  return (
    <div data-ocid="dashboard.quick_links_section">
      <h3 className="text-lg font-display font-bold text-foreground mb-4">
        দ্রুত যোগাযোগ
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {QUICK_LINKS.map(({ href, icon: Icon, label, color }) => (
          <Link
            key={href}
            to={href}
            data-ocid={`dashboard.quick_link.${label}`}
          >
            <Card className="hover:shadow-md transition-smooth cursor-pointer hover:scale-[1.02]">
              <CardContent className="flex flex-col items-center justify-center py-6 gap-3">
                <div className={`p-3 rounded-full ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {label}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function NoProfileState() {
  return (
    <Card
      className="text-center py-12 px-6"
      data-ocid="dashboard.no_profile_state"
    >
      <CardContent className="pt-0">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-display font-bold text-foreground mb-2">
          প্রোফাইল তৈরি করুন
        </h3>
        <p className="text-muted-foreground mb-6">
          আপনি এখনও সদস্যতার জন্য আবেদন করেননি। নিবন্ধন করতে নিচের বাটনে ক্লিক করুন।
        </p>
        <Link to="/register">
          <Button
            type="button"
            className="bg-primary text-primary-foreground font-semibold gap-2"
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

function NotLoggedInState() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4"
      data-ocid="dashboard.not_logged_in_state"
    >
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <LogIn className="w-10 h-10 text-muted-foreground" />
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
            className="bg-primary text-primary-foreground font-semibold gap-2 w-full sm:w-auto"
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

export default function DashboardPage() {
  const { isLoggedIn } = useAuth();
  const { data: member, isLoading } = useMyProfile();

  return (
    <Layout>
      {/* Bengali CTA Banner */}
      <div
        className="w-full py-5 px-4 hero-red"
        data-ocid="dashboard.join_cta_banner"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.49 0.21 22) 0%, oklch(0.38 0.22 18) 60%, oklch(0.30 0.18 22) 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white text-xl font-display font-bold leading-snug">
              আপনি কি আমাদের ছাত্রদলে যোগ দিতে চান?
            </p>
            <p className="text-white/80 text-sm mt-1">
              বাংলাদেশ জাতীয়তাবাদী ছাত্রদল — ২নং কপিলমুনি ইউনিয়ন শাখা
            </p>
          </div>
          <Link to="/register">
            <Button
              type="button"
              className="bg-white text-accent hover:bg-white/90 font-bold gap-2 shrink-0 shadow-md"
              data-ocid="dashboard.cta_join_button"
            >
              <UserPlus className="w-4 h-4" />
              যোগ দিন
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!isLoggedIn ? (
          <NotLoggedInState />
        ) : isLoading ? (
          <div className="space-y-6" data-ocid="dashboard.loading_state">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {member ? <ProfileCard member={member} /> : <NoProfileState />}
            <QuickLinks />
          </div>
        )}
      </div>
    </Layout>
  );
}
