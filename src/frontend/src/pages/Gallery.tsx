import { ExternalBlob, createActor } from "@/backend";
import type { GalleryPhoto } from "@/backend";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Calendar, Images, X, ZoomIn } from "lucide-react";
import { useState } from "react";

const PLACEHOLDER_PHOTOS: GalleryPhoto[] = [
  {
    id: 1n,
    photoBlob: ExternalBlob.fromURL("/assets/images/placeholder.svg"),
    uploadedDate: BigInt(Date.now() - 2 * 24 * 3600 * 1000) * 1000000n,
    uploaderName: "মোঃ আরিফুল ইসলাম",
    caption: "বার্ষিক সভায় ছাত্রদল নেতৃবৃন্দ",
  },
  {
    id: 2n,
    photoBlob: ExternalBlob.fromURL("/assets/images/placeholder.svg"),
    uploadedDate: BigInt(Date.now() - 5 * 24 * 3600 * 1000) * 1000000n,
    uploaderName: "মোঃ রাসেল আহমেদ",
    caption: "জিয়াউর রহমানের মৃত্যুবার্ষিকী শ্রদ্ধাঞ্জলি",
  },
  {
    id: 3n,
    photoBlob: ExternalBlob.fromURL("/assets/images/placeholder.svg"),
    uploadedDate: BigInt(Date.now() - 10 * 24 * 3600 * 1000) * 1000000n,
    uploaderName: "মোঃ সাইফুল হক",
    caption: "শিক্ষা উপকরণ বিতরণ অনুষ্ঠান",
  },
  {
    id: 4n,
    photoBlob: ExternalBlob.fromURL("/assets/images/placeholder.svg"),
    uploadedDate: BigInt(Date.now() - 15 * 24 * 3600 * 1000) * 1000000n,
    uploaderName: "মোঃ কামাল হোসেন",
    caption: "ছাত্রদল প্রতিষ্ঠা বার্ষিকী র‌্যালি",
  },
  {
    id: 5n,
    photoBlob: ExternalBlob.fromURL("/assets/images/placeholder.svg"),
    uploadedDate: BigInt(Date.now() - 20 * 24 * 3600 * 1000) * 1000000n,
    uploaderName: "মোঃ আরিফুল ইসলাম",
    caption: "কপিলমুনি ইউনিয়নে মানববন্ধন",
  },
  {
    id: 6n,
    photoBlob: ExternalBlob.fromURL("/assets/images/placeholder.svg"),
    uploadedDate: BigInt(Date.now() - 30 * 24 * 3600 * 1000) * 1000000n,
    uploaderName: "মোঃ রাসেল আহমেদ",
    caption: "নবীন বরণ অনুষ্ঠান ২০২৬",
  },
];

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / 1000000n);
  return new Date(ms).toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function GalleryPage() {
  const { actor, isFetching } = useActor(createActor);
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);

  const {
    data: photos,
    isLoading,
    isError,
  } = useQuery<GalleryPhoto[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listGalleryPhotos();
    },
    enabled: !!actor && !isFetching,
  });

  const displayPhotos =
    photos && photos.length > 0 ? photos : PLACEHOLDER_PHOTOS;

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
          <Images size={28} className="text-white/80" />
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-wide">
              ফটো গ্যালারি
            </h1>
            <p className="text-white/70 text-sm mt-0.5">
              সংগঠনের কার্যক্রমের ছবি সংগ্রহ
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
          data-ocid="gallery.loading_state"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive rounded-lg"
          data-ocid="gallery.error_state"
        >
          <AlertCircle size={18} />
          <p className="text-sm">ছবি লোড করতে সমস্যা হয়েছে।</p>
        </div>
      )}

      {/* Grid */}
      {!isLoading &&
        !isError &&
        (displayPhotos.length === 0 ? (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="gallery.empty_state"
          >
            <Images size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">কোনো ছবি নেই</p>
            <p className="text-sm mt-1">এখনো কোনো ছবি আপলোড করা হয়নি।</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-3"
            data-ocid="gallery.list"
          >
            {displayPhotos.map((photo, idx) => (
              <Card
                key={String(photo.id)}
                className="overflow-hidden cursor-pointer group hover:shadow-lg transition-smooth border-border"
                onClick={() => setLightboxPhoto(photo)}
                data-ocid={`gallery.item.${idx + 1}`}
              >
                <div className="relative aspect-square bg-muted">
                  <img
                    src={photo.photoBlob.getDirectURL()}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-smooth flex items-center justify-center">
                    <ZoomIn
                      size={28}
                      className="text-white opacity-0 group-hover:opacity-100 transition-smooth"
                    />
                  </div>
                </div>
                <CardContent className="p-2.5">
                  <p className="text-xs font-medium text-foreground line-clamp-1">
                    {photo.caption}
                  </p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Calendar size={10} />
                    {formatDate(photo.uploadedDate)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}

      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
          onKeyDown={(e) => e.key === "Escape" && setLightboxPhoto(null)}
          role="presentation"
          data-ocid="gallery.dialog"
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-black/40 hover:bg-black/60 transition-smooth"
            onClick={() => setLightboxPhoto(null)}
            aria-label="বন্ধ করুন"
            data-ocid="gallery.close_button"
          >
            <X size={24} />
          </button>
          <div
            className="max-w-3xl max-h-[85vh] w-full flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="document"
            aria-label="ছবির বিস্তারিত"
          >
            <img
              src={lightboxPhoto.photoBlob.getDirectURL()}
              alt={lightboxPhoto.caption}
              className="w-full max-h-[70vh] object-contain rounded-lg"
            />
            <div className="text-white text-center">
              <p className="font-semibold">{lightboxPhoto.caption}</p>
              <p className="text-sm text-white/60 mt-0.5">
                {lightboxPhoto.uploaderName} ·{" "}
                {formatDate(lightboxPhoto.uploadedDate)}
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
