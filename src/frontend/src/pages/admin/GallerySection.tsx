import { ExternalBlob } from "@/backend";
import type { CreateGalleryPhotoPayload, GalleryPhoto } from "@/backend";
import { useBackend } from "@/hooks/useBackend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog, SectionHeader, Spinner } from "./AdminShared";

export function GallerySection({
  show,
}: {
  show: (msg: string, type?: "success" | "error") => void;
}) {
  const { actor } = useBackend();
  const qc = useQueryClient();
  const [caption, setCaption] = useState("");
  const [uploaderName, setUploaderName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<bigint | null>(null);

  const { data: photos = [] } = useQuery<GalleryPhoto[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listGalleryPhotos();
    },
    enabled: !!actor,
  });

  const deletePhoto = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("no actor");
      return actor.deleteGalleryPhoto(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gallery"] });
      show("ছবি মুছে ফেলা হয়েছে");
      setDeleteConfirm(null);
    },
    onError: () => show("মুছে ফেলা ব্যর্থ হয়েছে", "error"),
  });

  const handleFileChange = (f: File | null) => {
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!actor || !file || !caption.trim() || !uploaderName.trim()) return;
    setUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const photoBlob = ExternalBlob.fromBytes(bytes);
      const payload: CreateGalleryPhotoPayload = {
        photoBlob,
        uploaderName,
        caption,
      };
      await actor.addGalleryPhoto(payload);
      qc.invalidateQueries({ queryKey: ["gallery"] });
      show("ছবি সফলভাবে আপলোড হয়েছে");
      setCaption("");
      setUploaderName("");
      setFile(null);
      setPreview(null);
    } catch {
      show("আপলোড ব্যর্থ হয়েছে", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div data-ocid="admin.gallery_section">
      <SectionHeader
        icon="🖼️"
        title="গ্যালারি"
        description="এখান থেকে নতুন ছবি আপলোড করুন এবং বিদ্যমান ছবি পরিচালনা করুন"
      />

      {/* Upload Form */}
      <div className="bg-card rounded-xl p-5 shadow-sm border border-border mb-6">
        <h3 className="font-semibold mb-4 text-[#1a2e1a]">নতুন ছবি যোগ করুন</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <input
              data-ocid="admin.gallery.uploader_input"
              type="text"
              placeholder="আপলোডকারীর নাম *"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
            <input
              data-ocid="admin.gallery.caption_input"
              type="text"
              placeholder="ক্যাপশন *"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
            <label className="flex items-center gap-3 border-2 border-dashed border-input rounded-lg p-3 cursor-pointer hover:border-[#006A4E] transition-colors group">
              <Upload className="w-5 h-5 text-muted-foreground group-hover:text-[#006A4E]" />
              <span className="text-sm text-muted-foreground group-hover:text-foreground">
                {file ? file.name : "ছবি নির্বাচন করুন"}
              </span>
              <input
                data-ocid="admin.gallery.upload_button"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
            </label>
            <button
              type="button"
              data-ocid="admin.gallery.submit_button"
              disabled={
                !file || !caption.trim() || !uploaderName.trim() || uploading
              }
              onClick={handleUpload}
              className="w-full bg-[#006A4E] hover:bg-green-800 text-white py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
            >
              {uploading ? <Spinner small /> : <Upload className="w-4 h-4" />}
              ছবি আপলোড করুন
            </button>
          </div>
          {preview && (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-44 object-cover rounded-xl border border-border"
              />
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black/80"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((p, i) => (
          <div
            key={String(p.id)}
            data-ocid={`admin.gallery.item.${i + 1}`}
            className="bg-card rounded-xl overflow-hidden shadow-sm border border-border group"
          >
            <div className="relative">
              <img
                src={p.photoBlob.getDirectURL()}
                alt={p.caption}
                className="w-full h-36 object-cover"
              />
              <button
                type="button"
                data-ocid={`admin.gallery.delete_button.${i + 1}`}
                onClick={() => setDeleteConfirm(p.id)}
                className="absolute top-2 right-2 bg-[#DC143C]/80 hover:bg-[#DC143C] text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-2.5">
              <p className="text-xs font-semibold truncate">{p.caption}</p>
              <p className="text-xs text-muted-foreground">{p.uploaderName}</p>
            </div>
          </div>
        ))}
        {photos.length === 0 && (
          <div
            data-ocid="admin.gallery.empty_state"
            className="col-span-4 bg-card rounded-xl p-12 text-center border border-border"
          >
            <p className="text-4xl mb-2">🖼️</p>
            <p className="text-muted-foreground">কোনো ছবি নেই</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteConfirm !== null}
        message="এই ছবিটি মুছে ফেলতে চান?"
        onConfirm={() =>
          deleteConfirm !== null && deletePhoto.mutate(deleteConfirm)
        }
        onCancel={() => setDeleteConfirm(null)}
        isPending={deletePhoto.isPending}
        confirmLabel="হ্যাঁ, মুছুন"
        danger
      />
    </div>
  );
}
