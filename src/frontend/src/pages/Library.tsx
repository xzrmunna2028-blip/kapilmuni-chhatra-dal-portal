import { ExternalBlob, createActor } from "@/backend";
import type { LibraryItem } from "@/backend";
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
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Scroll,
  Search,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";

const SAMPLE_ITEMS: LibraryItem[] = [
  {
    id: 1n,
    title: "বাংলাদেশ জাতীয়তাবাদী দল (বিএনপি) গঠনতন্ত্র",
    description:
      "বাংলাদেশ জাতীয়তাবাদী দলের পূর্ণাঙ্গ গঠনতন্ত্র ও নীতিমালা সংক্রান্ত দলিল। দলের উদ্দেশ্য, সংগঠন কাঠামো এবং সদস্যপদের শর্তাবলী অন্তর্ভুক্ত।",
    category: "সংগঠন",
    uploadedDate: BigInt(Date.now() - 10 * 24 * 3600 * 1000) * 1000000n,
    fileBlob: ExternalBlob.fromURL("#"),
  },
  {
    id: 2n,
    title: "জাতীয়তাবাদী ছাত্রদলের আদর্শ ও কর্মসূচি",
    description:
      "ছাত্রদলের মূল আদর্শ, লক্ষ্য ও উদ্দেশ্য এবং ভবিষ্যৎ কর্মসূচি সম্পর্কিত বিস্তারিত দলিল। ছাত্র রাজনীতির দিকনির্দেশনা ও নীতি।",
    category: "আদর্শ",
    uploadedDate: BigInt(Date.now() - 20 * 24 * 3600 * 1000) * 1000000n,
    fileBlob: ExternalBlob.fromURL("#"),
  },
  {
    id: 3n,
    title: "শহীদ জিয়ার রাষ্ট্রনায়কোচিত অবদান - ইতিহাস",
    description:
      "মুক্তিযুদ্ধে জিয়াউর রহমানের ভূমিকা এবং স্বাধীনতার পর বাংলাদেশ গড়ার ক্ষেত্রে তার অবদান নিয়ে রচিত ঐতিহাসিক দলিল।",
    category: "ইতিহাস",
    uploadedDate: BigInt(Date.now() - 30 * 24 * 3600 * 1000) * 1000000n,
    fileBlob: ExternalBlob.fromURL("#"),
  },
  {
    id: 4n,
    title: "২নং কপিলমুনি ইউনিয়নের পরিচিতি ও ইতিহাস",
    description:
      "কপিলমুনি ইউনিয়নের ভৌগোলিক অবস্থান, জনসংখ্যা, শিক্ষা প্রতিষ্ঠান ও ঐতিহাসিক গুরুত্ব সম্পর্কিত তথ্য সংকলন।",
    category: "এলাকা",
    uploadedDate: BigInt(Date.now() - 45 * 24 * 3600 * 1000) * 1000000n,
    fileBlob: ExternalBlob.fromURL("#"),
  },
  {
    id: 5n,
    title: "ছাত্র রাজনীতিতে নেতৃত্বের গুণাবলী",
    description:
      "একজন সফল ছাত্রনেতার কী কী গুণাবলী থাকা প্রয়োজন এবং কিভাবে সংগঠন পরিচালনা করতে হয় তা নিয়ে প্রশিক্ষণ উপকরণ।",
    category: "প্রশিক্ষণ",
    uploadedDate: BigInt(Date.now() - 60 * 24 * 3600 * 1000) * 1000000n,
    fileBlob: ExternalBlob.fromURL("#"),
  },
];

const CATEGORIES = ["সব", "সংগঠন", "আদর্শ", "ইতিহাস", "এলাকা", "প্রশিক্ষণ"];

const CATEGORY_COLORS: Record<string, string> = {
  সংগঠন: "bg-blue-100 text-blue-800 border-blue-200",
  আদর্শ: "bg-purple-100 text-purple-800 border-purple-200",
  ইতিহাস: "bg-amber-100 text-amber-800 border-amber-200",
  এলাকা: "bg-green-100 text-green-800 border-green-200",
  প্রশিক্ষণ: "bg-pink-100 text-pink-800 border-pink-200",
};

function getCategoryIcon(category: string) {
  switch (category) {
    case "সংগঠন":
      return <Scroll size={14} />;
    case "ইতিহাস":
      return <BookOpen size={14} />;
    case "আদর্শ":
      return <Star size={14} />;
    default:
      return <FileText size={14} />;
  }
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / 1000000n);
  return new Date(ms).toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function LibraryPage() {
  const { actor, isFetching } = useActor(createActor);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("সব");

  const {
    data: items,
    isLoading,
    isError,
  } = useQuery<LibraryItem[]>({
    queryKey: ["library"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listLibraryItems();
    },
    enabled: !!actor && !isFetching,
  });

  const displayData = items && items.length > 0 ? items : SAMPLE_ITEMS;

  const filtered = useMemo(() => {
    let result = displayData;
    if (activeCategory !== "সব") {
      result = result.filter((i) => i.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q),
      );
    }
    return result;
  }, [displayData, search, activeCategory]);

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
          <BookOpen size={28} className="text-white/80" />
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-wide">
              তথ্য ভান্ডার
            </h1>
            <p className="text-white/70 text-sm mt-0.5">
              দলিলপত্র, ইতিহাস ও প্রশিক্ষণ উপকরণ
            </p>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3 mb-5">
        <div className="relative" data-ocid="library.search_input">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="দলিল খুঁজুন..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2" data-ocid="library.filter.tab">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-smooth ${
                activeCategory === cat
                  ? "text-white border-transparent"
                  : "border-border bg-card text-muted-foreground hover:border-primary"
              }`}
              style={activeCategory === cat ? { background: "#006A4E" } : {}}
              data-ocid={`library.tab.${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3" data-ocid="library.loading_state">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2 mt-1" />
                  </div>
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
          data-ocid="library.error_state"
        >
          <AlertCircle size={18} />
          <p className="text-sm">তথ্য লোড করতে সমস্যা হয়েছে।</p>
        </div>
      )}

      {/* Items */}
      {!isLoading &&
        !isError &&
        (filtered.length === 0 ? (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="library.empty_state"
          >
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">কোনো দলিল নেই</p>
            <p className="text-sm mt-1">
              এই বিভাগে এখনো কোনো উপকরণ যোগ করা হয়নি।
            </p>
          </div>
        ) : (
          <div className="space-y-3" data-ocid="library.list">
            <p className="text-xs text-muted-foreground mb-1">
              {filtered.length}টি দলিল পাওয়া গেছে
            </p>
            {filtered.map((item, idx) => (
              <Card
                key={String(item.id)}
                className="border-border hover:shadow-md transition-smooth"
                data-ocid={`library.item.${idx + 1}`}
              >
                <CardContent className="p-4 md:p-5">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-white"
                      style={{
                        background: "linear-gradient(135deg, #006A4E, #004d38)",
                      }}
                    >
                      {getCategoryIcon(item.category)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-semibold text-foreground text-sm md:text-base leading-snug flex-1">
                          {item.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`text-[10px] shrink-0 ${
                            CATEGORY_COLORS[item.category] ??
                            "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-border">
                        <span className="text-xs text-muted-foreground">
                          আপলোড: {formatDate(item.uploadedDate)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1 border-border"
                            asChild
                          >
                            <a
                              href={item.fileBlob.getDirectURL()}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-ocid={`library.view_button.${idx + 1}`}
                            >
                              <ExternalLink size={12} />
                              দেখুন
                            </a>
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            className="h-7 text-xs gap-1 text-white border-0"
                            style={{ background: "#006A4E" }}
                            asChild
                          >
                            <a
                              href={item.fileBlob.getDirectURL()}
                              download
                              data-ocid={`library.download_button.${idx + 1}`}
                            >
                              <Download size={12} />
                              ডাউনলোড
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
    </Layout>
  );
}
