import { createActor } from "@/backend";
import type { AlumniRecord } from "@/backend";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  GraduationCap,
  Search,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";

const SAMPLE_ALUMNI: AlumniRecord[] = [
  {
    id: 1n,
    name: "মোঃ শফিকুল ইসলাম",
    designation: "সভাপতি",
    yearsActive: "২০১৫-২০১৮",
    currentStatus: "ব্যবসায়ী, কপিলমুনি বাজার",
  },
  {
    id: 2n,
    name: "মোঃ জাহিদুল হাসান",
    designation: "সাধারণ সম্পাদক",
    yearsActive: "২০১৬-২০১৯",
    currentStatus: "সরকারি চাকরিজীবী",
  },
  {
    id: 3n,
    name: "মোঃ নাসিরউদ্দিন",
    designation: "সাংগঠনিক সম্পাদক",
    yearsActive: "২০১৭-২০২০",
    currentStatus: "আইনজীবী, খুলনা জজ কোর্ট",
  },
  {
    id: 4n,
    name: "মোঃ রফিকুল আলম",
    designation: "অর্থ সম্পাদক",
    yearsActive: "২০১৩-২০১৬",
    currentStatus: "উপজেলা পর্যায়ে রাজনীতি",
  },
  {
    id: 5n,
    name: "মোঃ আলমগীর হোসেন",
    designation: "প্রচার সম্পাদক",
    yearsActive: "২০১৮-২০২১",
    currentStatus: "শিক্ষক, কপিলমুনি উচ্চ বিদ্যালয়",
  },
  {
    id: 6n,
    name: "মোঃ মোস্তফা কামাল",
    designation: "সহ-সভাপতি",
    yearsActive: "২০১২-২০১৫",
    currentStatus: "ডাক্তার, উপজেলা স্বাস্থ্য কমপ্লেক্স",
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

export default function AlumniPage() {
  const { actor, isFetching } = useActor(createActor);
  const [search, setSearch] = useState("");

  const {
    data: alumni,
    isLoading,
    isError,
  } = useQuery<AlumniRecord[]>({
    queryKey: ["alumni"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAlumni();
    },
    enabled: !!actor && !isFetching,
  });

  const displayData = alumni && alumni.length > 0 ? alumni : SAMPLE_ALUMNI;

  const filtered = useMemo(() => {
    if (!search.trim()) return displayData;
    const q = search.toLowerCase();
    return displayData.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.designation.toLowerCase().includes(q) ||
        a.currentStatus.toLowerCase().includes(q),
    );
  }, [displayData, search]);

  return (
    <Layout>
      {/* Page Header */}
      <div
        className="rounded-xl mb-6 px-6 py-8 text-white"
        style={{
          background: "linear-gradient(135deg, #006A4E 0%, #004d38 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <GraduationCap size={28} className="text-white/80" />
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-wide">
              প্রাক্তন সদস্য
            </h1>
            <p className="text-white/70 text-sm mt-0.5">
              আমাদের সংগঠনের প্রাক্তন নেতৃবৃন্দ
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5" data-ocid="alumni.search_input">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="নাম বা পদবী দিয়ে খুঁজুন..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="alumni.loading_state"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-5 flex gap-4 items-center">
                <Skeleton className="w-14 h-14 rounded-full shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive rounded-lg"
          data-ocid="alumni.error_state"
        >
          <AlertCircle size={18} />
          <p className="text-sm">প্রাক্তন সদস্যদের তথ্য লোড করতে সমস্যা হয়েছে।</p>
        </div>
      )}

      {/* Cards */}
      {!isLoading && !isError && (
        // biome-ignore lint/complexity/noUselessFragments: required for conditional rendering
        <>
          {filtered.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="alumni.empty_state"
            >
              <GraduationCap size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">কোনো প্রাক্তন সদস্য নেই</p>
              <p className="text-sm mt-1">এখনো কোনো তথ্য যোগ করা হয়নি।</p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              data-ocid="alumni.list"
            >
              {filtered.map((alumnus, idx) => (
                <Card
                  key={String(alumnus.id)}
                  className="border-border hover:shadow-md transition-smooth"
                  data-ocid={`alumni.item.${idx + 1}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      {alumnus.photoBlob ? (
                        <img
                          src={alumnus.photoBlob.getDirectURL()}
                          alt={alumnus.name}
                          className="w-14 h-14 rounded-full object-cover border-2 shrink-0"
                          style={{ borderColor: "#006A4E" }}
                        />
                      ) : (
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #006A4E, #DC143C)",
                          }}
                        >
                          {getInitials(alumnus.name)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {alumnus.name}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="text-[10px] mt-1 bg-green-50 text-green-800 border-green-200"
                        >
                          {alumnus.designation}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={12} className="shrink-0" />
                        <span>সক্রিয় ছিলেন: {alumnus.yearsActive}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User size={12} className="shrink-0" />
                        <span className="truncate">
                          বর্তমান: {alumnus.currentStatus}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
