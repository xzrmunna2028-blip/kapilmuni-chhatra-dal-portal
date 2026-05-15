import { createActor } from "@/backend";
import type { Notice } from "@/backend";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Bell,
  Calendar,
  ChevronDown,
  ChevronUp,
  Search,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";

const SAMPLE_NOTICES: Notice[] = [
  {
    id: 1n,
    title: "২নং কপিলমুনি ইউনিয়ন ছাত্রদলের বার্ষিক সভা আহবান",
    content:
      "আগামী ১৫ জুন ২০২৬ তারিখ রোজ শনিবার বিকাল ৩টায় কপিলমুনি ইউনিয়ন পরিষদ মিলনায়তনে ২নং কপিলমুনি ইউনিয়ন ছাত্রদলের বার্ষিক সাধারণ সভা অনুষ্ঠিত হবে। সকল সদস্যদের যথাসময়ে উপস্থিত থাকার জন্য অনুরোধ করা হচ্ছে। সভায় কমিটি পুনর্গঠন ও আগামী কর্মসূচি নিয়ে আলোচনা হবে।",
    date: BigInt(Date.now() - 1 * 24 * 60 * 60 * 1000) * 1000000n,
    author: "সভাপতি, মোঃ আরিফুল ইসলাম",
    archived: false,
  },
  {
    id: 2n,
    title: "জাতীয়তাবাদী ছাত্রদল প্রতিষ্ঠা বার্ষিকী উদযাপন",
    content:
      "আগামী ১ জানুয়ারি ২০২৬ তারিখে জাতীয়তাবাদী ছাত্রদলের ৪৭তম প্রতিষ্ঠা বার্ষিকী উদযাপন উপলক্ষে ২নং কপিলমুনি ইউনিয়নে বর্ণাঢ্য অনুষ্ঠানের আয়োজন করা হয়েছে। র‌্যালি, আলোচনা সভা ও সাংস্কৃতিক অনুষ্ঠান থাকবে। সকল নেতাকর্মীদের অংশগ্রহণ নিশ্চিত করুন।",
    date: BigInt(Date.now() - 3 * 24 * 60 * 60 * 1000) * 1000000n,
    author: "সাধারণ সম্পাদক, মোঃ রাসেল আহমেদ",
    archived: false,
  },
  {
    id: 3n,
    title: "নতুন সদস্য নিবন্ধন প্রক্রিয়া শুরু",
    content:
      "২নং কপিলমুনি ইউনিয়ন ছাত্রদলে নতুন সদস্য ভর্তির কার্যক্রম শুরু হয়েছে। আগ্রহী প্রার্থীদের অনলাইনে নিবন্ধন করতে অনুরোধ করা হচ্ছে। নিবন্ধনের জন্য পাসপোর্ট সাইজ ছবি, জাতীয় পরিচয়পত্র ও শিক্ষাগত যোগ্যতার সনদ আবশ্যক।",
    date: BigInt(Date.now() - 7 * 24 * 60 * 60 * 1000) * 1000000n,
    author: "সাংগঠনিক সম্পাদক, মোঃ সাইফুল হক",
    archived: false,
  },
  {
    id: 4n,
    title: "বি.এন.পি প্রতিষ্ঠাতা শহীদ রাষ্ট্রপতি জিয়াউর রহমানের মৃত্যুবার্ষিকী পালন",
    content:
      "আগামী ৩০ মে বীর মুক্তিযোদ্ধা ও বি.এন.পির প্রতিষ্ঠাতা শহীদ রাষ্ট্রপতি জিয়াউর রহমানের ৪৫তম মৃত্যুবার্ষিকী উপলক্ষে মিলাদ ও দোয়া মাহফিলের আয়োজন করা হয়েছে। স্থান: কপিলমুনি কেন্দ্রীয় জামে মসজিদ, সময়: বাদ আসর।",
    date: BigInt(Date.now() - 14 * 24 * 60 * 60 * 1000) * 1000000n,
    author: "সভাপতি, মোঃ আরিফুল ইসলাম",
    archived: false,
  },
  {
    id: 5n,
    title: "মানবিক সহায়তা বিতরণ কার্যক্রম",
    content:
      "ইউনিয়নের দরিদ্র ও অসহায় শিক্ষার্থীদের মধ্যে শিক্ষা উপকরণ বিতরণ করা হবে। মোট ১০০ জন শিক্ষার্থীকে বই, খাতা ও কলম প্রদান করা হবে। অনুষ্ঠান স্থল: কপিলমুনি উচ্চ বিদ্যালয় প্রাঙ্গণ। তারিখ: ২০ জুন ২০২৬।",
    date: BigInt(Date.now() - 21 * 24 * 60 * 60 * 1000) * 1000000n,
    author: "সমাজকল্যাণ সম্পাদক, মোঃ কামাল হোসেন",
    archived: false,
  },
];

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / 1000000n);
  return new Date(ms).toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function NoticeCard({ notice }: { notice: Notice }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className="border-border hover:shadow-md transition-smooth"
      data-ocid={`notices.item.${Number(notice.id)}`}
    >
      <CardContent className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Bell size={15} className="text-accent-red shrink-0" />
              {!notice.archived && (
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-green-100 text-green-800 border-green-200"
                >
                  সক্রিয়
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-foreground text-sm md:text-base leading-snug">
              {notice.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(notice.date)}
              </span>
              <span className="flex items-center gap-1">
                <User size={12} />
                {notice.author}
              </span>
            </div>
          </div>
        </div>

        <p
          className={`mt-3 text-sm text-muted-foreground leading-relaxed ${
            expanded ? "" : "line-clamp-2"
          }`}
        >
          {notice.content}
        </p>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 h-7 text-xs text-primary px-0 hover:bg-transparent"
          onClick={() => setExpanded((v) => !v)}
          data-ocid={`notices.expand_button.${Number(notice.id)}`}
        >
          {expanded ? (
            <>
              <ChevronUp size={14} className="mr-1" /> কম দেখুন
            </>
          ) : (
            <>
              <ChevronDown size={14} className="mr-1" /> পুরো নোটিশ দেখুন
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function NoticesPage() {
  const { actor, isFetching } = useActor(createActor);
  const [search, setSearch] = useState("");

  const {
    data: notices,
    isLoading,
    isError,
  } = useQuery<Notice[]>({
    queryKey: ["notices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listNotices(false);
    },
    enabled: !!actor && !isFetching,
  });

  const displayData = notices && notices.length > 0 ? notices : SAMPLE_NOTICES;

  const sorted = useMemo(() => {
    return [...displayData].sort((a, b) => Number(b.date - a.date));
  }, [displayData]);

  const filtered = useMemo(() => {
    if (!search.trim()) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.author.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q),
    );
  }, [sorted, search]);

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
          <Bell size={28} className="text-white/80" />
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-wide">
              নোটিশ বোর্ড
            </h1>
            <p className="text-white/70 text-sm mt-0.5">
              সকল গুরুত্বপূর্ণ বিজ্ঞপ্তি ও নোটিশ
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-5" data-ocid="notices.search_input">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="নোটিশ খুঁজুন..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3" data-ocid="notices.loading_state">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-5 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-1" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive rounded-lg"
          data-ocid="notices.error_state"
        >
          <AlertCircle size={18} />
          <p className="text-sm">নোটিশ লোড করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।</p>
        </div>
      )}

      {/* Notice List */}
      {!isLoading &&
        !isError &&
        (filtered.length === 0 ? (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="notices.empty_state"
          >
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">কোনো নোটিশ নেই</p>
            <p className="text-sm mt-1">এখনো কোনো নোটিশ প্রকাশিত হয়নি।</p>
          </div>
        ) : (
          <div className="space-y-3" data-ocid="notices.list">
            <p className="text-xs text-muted-foreground mb-3">
              মোট {filtered.length}টি নোটিশ পাওয়া গেছে
            </p>
            {filtered.map((notice) => (
              <NoticeCard key={String(notice.id)} notice={notice} />
            ))}
          </div>
        ))}
    </Layout>
  );
}
