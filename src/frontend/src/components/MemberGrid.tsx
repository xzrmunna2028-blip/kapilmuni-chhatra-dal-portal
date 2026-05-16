import type { Member } from "@/backend";
import { MemberStatus } from "@/backend";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Mail, MapPin, Phone, X } from "lucide-react";
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

function MemberProfileModal({
  member,
  onClose,
}: { member: Member; onClose: () => void }) {
  const photoUrl = member.photoBlob.getDirectURL();
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="max-w-md"
        data-ocid="dashboard.member_profile_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            {member.fullName}
          </DialogTitle>
        </DialogHeader>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
          data-ocid="dashboard.member_profile.close_button"
        >
          <X className="w-4 h-4" />
        </Button>
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="relative">
            <Avatar className="w-28 h-28 border-4 border-primary shadow-lg">
              <AvatarImage src={photoUrl} alt={member.fullName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {getInitials(member.fullName)}
              </AvatarFallback>
            </Avatar>
            <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs whitespace-nowrap">
              #{Number(member.rank)}
            </Badge>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-display font-bold text-foreground">
              {member.fullName}
            </h3>
            <Badge
              variant="outline"
              className="mt-1 border-primary text-primary font-semibold"
            >
              {member.designation}
            </Badge>
          </div>
          <div className="w-full space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4 shrink-0 text-primary" />
              <span>{member.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4 shrink-0 text-primary" />
              <span className="break-all">{member.email}</span>
            </div>
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
              <span className="break-words">{member.fullAddress}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 shrink-0 text-primary" />
              <span>যোগদান: {formatDate(member.registeredAt)}</span>
            </div>
            {member.joinReason && (
              <div className="mt-3 p-3 bg-muted rounded-lg border-l-4 border-primary">
                <p className="text-xs font-semibold text-muted-foreground mb-1">
                  যোগ দেওয়ার কারণ
                </p>
                <p className="text-foreground text-sm italic">
                  {member.joinReason}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MemberCardItem({ member, index }: { member: Member; index: number }) {
  const [showModal, setShowModal] = useState(false);
  const photoUrl = member.photoBlob.getDirectURL();
  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="member-card-enter group flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/40 transition-smooth cursor-pointer w-full text-left"
        style={{ animationDelay: `${index * 60}ms` }}
        data-ocid={`dashboard.member_grid.item.${index + 1}`}
      >
        <div className="relative">
          <Avatar className="w-16 h-16 border-2 border-border group-hover:border-primary transition-smooth">
            <AvatarImage src={photoUrl} alt={member.fullName} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {getInitials(member.fullName)}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow">
            {Number(member.rank)}
          </span>
        </div>
        <div className="text-center min-w-0 w-full">
          <p className="font-semibold text-sm text-foreground truncate">
            {member.fullName}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {member.designation}
          </p>
        </div>
      </button>
      {showModal && (
        <MemberProfileModal
          member={member}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

interface MemberGridProps {
  members: Member[];
  loading?: boolean;
}

export function MemberGrid({ members, loading }: MemberGridProps) {
  const approved = members
    .filter((m) => m.status === MemberStatus.approved)
    .sort((a, b) => Number(a.rank) - Number(b.rank));

  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  if (approved.length === 0) {
    return (
      <div
        className="text-center py-10 text-muted-foreground"
        data-ocid="dashboard.member_grid.empty_state"
      >
        <span className="text-4xl block mb-2">👥</span>
        <p className="text-sm">এখনো কোনো অনুমোদিত সদস্য নেই</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
      data-ocid="dashboard.member_grid"
    >
      {approved.map((member, i) => (
        <MemberCardItem key={member.id.toString()} member={member} index={i} />
      ))}
    </div>
  );
}
