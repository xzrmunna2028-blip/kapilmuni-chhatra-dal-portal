import { createActor } from "@/backend";
import type { Achievement } from "@/backend";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Award, Calendar, User } from "lucide-react";

const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  {
    id: 1n,
    memberName: "মোঃ আরিফুল ইসলাম",
    title: "শ্রেষ্ঠ ছাত্রনেতা পুরস্কার ২০২৫",
    description:
      "উপজেলা পর্যায়ে সর্বোচ্চ সংগঠন বিস্তার ও সফল কার্যক্রম পরিচালনার জন্য খুলনা জেলা ছাত্রদল কর্তৃক শ্রেষ্ঠ ছাত্রনেতা হিসেবে ভূষিত।",
    date: BigInt(Date.now() - 30 * 24 * 3600 * 1000) * 1000000n,
  },
  {
    id: 2n,
    memberName: "মোঃ রাসেল আহমেদ",
    title: "জাতীয় বিতর্ক প্রতিযোগিতায় প্রথম স্থান",
    description:
      "ঢাকা বিশ্ববিদ্যালয়ে অনুষ্ঠিত জাতীয় পর্যায়ের ছাত্র বিতর্ক প্রতিযোগিতায় ২নং কপিলমুনি ইউনিয়নের প্রতিনিধি হিসেবে প্রথম স্থান অর্জন।",
    date: BigInt(Date.now() - 60 * 24 * 3600 * 1000) * 1000000n,
  },
  {
    id: 3n,
    memberName: "মোঃ সাইফুল হক",
    title: "সমাজসেবায় বিশেষ অবদান স্বীকৃতি",
    description:
      "বন্যাকবলিত এলাকায় ত্রাণ বিতরণ ও পুনর্বাসন কাজে অক্লান্ত পরিশ্রমের স্বীকৃতি স্বরূপ উপজেলা প্রশাসন কর্তৃক সম্মাননা প্রদান।",
    date: BigInt(Date.now() - 90 * 24 * 3600 * 1000) * 1000000n,
  },
  {
    id: 4n,
    memberName: "মোঃ কামাল হোসেন",
    title: "সেরা স্বেচ্ছাসেবক পুরস্কার",
    description:
      "করোনা মহামারীর সময় অসহায় মানুষদের মধ্যে খাদ্য সহায়তা ও স্বাস্থ্য সেবা প্রদানে অবদানের জন্য জেলা প্রশাসন কর্তৃক পুরস্কৃত।",
    date: BigInt(Date.now() - 120 * 24 * 3600 * 1000) * 1000000n,
  },
  {
    id: 5n,
    memberName: "মোঃ মিনহাজুল ইসলাম",
    title: "পরিবেশ রক্ষায় অসাধারণ অবদান",
    description:
      "কপিলমুনি ইউনিয়নে ১০,০০০ গাছ রোপণ অভিযানে নেতৃত্ব দিয়ে পরিবেশ রক্ষায় অবদান রাখায় বন বিভাগ কর্তৃক সনদ ও পুরস্কার প্রদান।",
    date: BigInt(Date.now() - 150 * 24 * 3600 * 1000) * 1000000n,
  },
  {
    id: 6n,
    memberName: "মোঃ তানভীর হাসান",
    title: "শিক্ষা বৃত্তি প্রতিযোগিতায় বিজয়ী",
    description:
      "জাতীয়তাবাদী ছাত্রদলের শিক্ষা বৃত্তি প্রতিযোগিতায় সারাদেশের মধ্যে প্রথম স্থান অর্জন করে সংগঠনের মুখ উজ্জ্বল করেছেন।",
    date: BigInt(Date.now() - 180 * 24 * 3600 * 1000) * 1000000n,
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

export default function AchievementsPage() {
  const { actor, isFetching } = useActor(createActor);

  const {
    data: achievements,
    isLoading,
    isError,
  } = useQuery<Achievement[]>({
    queryKey: ["achievements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAchievements();
    },
    enabled: !!actor && !isFetching,
  });

  const displayData =
    achievements && achievements.length > 0
      ? achievements
      : SAMPLE_ACHIEVEMENTS;

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
          <Award size={28} className="text-white/80" />
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-wide">
              সাফল্য
            </h1>
            <p className="text-white/70 text-sm mt-0.5">
              আমাদের সদস্যদের গর্বিত অর্জন ও সম্মাননা
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          data-ocid="achievements.loading_state"
        >
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <Skeleton className="h-5 w-24 mb-3" />
                <Skeleton className="h-5 w-3/4 mb-2" />
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
          data-ocid="achievements.error_state"
        >
          <AlertCircle size={18} />
          <p className="text-sm">সাফল্যের তথ্য লোড করতে সমস্যা হয়েছে।</p>
        </div>
      )}

      {/* Cards */}
      {!isLoading && !isError && (
        // biome-ignore lint/complexity/noUselessFragments: required for conditional rendering
        <>
          {displayData.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="achievements.empty_state"
            >
              <Award size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">কোনো সাফল্য নেই</p>
              <p className="text-sm mt-1">এখনো কোনো সাফল্য যোগ করা হয়নি।</p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              data-ocid="achievements.list"
            >
              {displayData.map((achievement, idx) => (
                <Card
                  key={String(achievement.id)}
                  className="border-border hover:shadow-md transition-smooth overflow-hidden"
                  data-ocid={`achievements.item.${idx + 1}`}
                >
                  <div
                    className="h-1.5"
                    style={{
                      background: "linear-gradient(90deg, #DC143C, #006A4E)",
                    }}
                  />
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "#DC143C" }}
                      >
                        <Award size={18} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge
                          className="text-[10px] mb-2 text-white border-0"
                          style={{ background: "#DC143C" }}
                        >
                          সাফল্য
                        </Badge>
                        <h3 className="font-bold text-foreground text-sm md:text-base leading-snug">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {achievement.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground border-t border-border pt-3">
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {achievement.memberName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(achievement.date)}
                          </span>
                        </div>
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
