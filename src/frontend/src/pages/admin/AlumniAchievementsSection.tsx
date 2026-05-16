import type {
  Achievement,
  AlumniRecord,
  CreateAchievementPayload,
  CreateAlumniPayload,
} from "@/backend";
import { useBackend } from "@/hooks/useBackend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ConfirmDialog,
  SectionHeader,
  Spinner,
  formatDate,
} from "./AdminShared";

export function AlumniAchievementsSection({
  show,
}: {
  show: (msg: string, type?: "success" | "error") => void;
}) {
  const { actor } = useBackend();
  const qc = useQueryClient();
  const [subTab, setSubTab] = useState<"alumni" | "achievements">("alumni");
  const [alumniForm, setAlumniForm] = useState<
    Omit<CreateAlumniPayload, "photoBlob">
  >({
    name: "",
    designation: "",
    yearsActive: "",
    currentStatus: "",
  });
  const [achForm, setAchForm] = useState<
    Omit<CreateAchievementPayload, "photoBlob">
  >({
    memberName: "",
    title: "",
    description: "",
  });
  const [deleteAlumniConfirm, setDeleteAlumniConfirm] = useState<bigint | null>(
    null,
  );
  const [deleteAchConfirm, setDeleteAchConfirm] = useState<bigint | null>(null);

  const { data: alumniList = [] } = useQuery<AlumniRecord[]>({
    queryKey: ["alumni"],
    queryFn: async () => (actor ? actor.listAlumni() : []),
    enabled: !!actor,
  });

  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ["achievements"],
    queryFn: async () => (actor ? actor.listAchievements() : []),
    enabled: !!actor,
  });

  const addAlumni = useMutation({
    mutationFn: async (payload: CreateAlumniPayload) => {
      if (!actor) throw new Error("no actor");
      return actor.addAlumni(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alumni"] });
      show("প্রাক্তন সদস্য যোগ হয়েছে");
      setAlumniForm({
        name: "",
        designation: "",
        yearsActive: "",
        currentStatus: "",
      });
    },
    onError: () => show("যোগ ব্যর্থ হয়েছে", "error"),
  });

  const deleteAlumni = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("no actor");
      return actor.deleteAlumni(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alumni"] });
      show("মুছে ফেলা হয়েছে");
      setDeleteAlumniConfirm(null);
    },
    onError: () => show("মুছে ফেলা ব্যর্থ হয়েছে", "error"),
  });

  const addAchievement = useMutation({
    mutationFn: async (payload: CreateAchievementPayload) => {
      if (!actor) throw new Error("no actor");
      return actor.addAchievement(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["achievements"] });
      show("সাফল্য যোগ হয়েছে");
      setAchForm({ memberName: "", title: "", description: "" });
    },
    onError: () => show("যোগ ব্যর্থ হয়েছে", "error"),
  });

  const deleteAchievement = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("no actor");
      return actor.deleteAchievement(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["achievements"] });
      show("মুছে ফেলা হয়েছে");
      setDeleteAchConfirm(null);
    },
    onError: () => show("মুছে ফেলা ব্যর্থ হয়েছে", "error"),
  });

  return (
    <div data-ocid="admin.alumni_achievements_section">
      <SectionHeader
        icon="🏆"
        title="অ্যালামনাই ও কৃতিত্ব"
        description="প্রাক্তন সদস্য এবং সদস্যদের বিশেষ কৃতিত্ব পরিচালনা করুন"
      />

      {/* Sub-tabs */}
      <div className="flex gap-1 mb-6 bg-muted/50 rounded-xl p-1 w-fit">
        <button
          type="button"
          data-ocid="admin.alumni_tab"
          onClick={() => setSubTab("alumni")}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
            subTab === "alumni"
              ? "bg-card shadow text-[#1a2e1a]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          প্রাক্তন সদস্য ({alumniList.length})
        </button>
        <button
          type="button"
          data-ocid="admin.achievements_tab"
          onClick={() => setSubTab("achievements")}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
            subTab === "achievements"
              ? "bg-card shadow text-[#1a2e1a]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          কৃতিত্ব ({achievements.length})
        </button>
      </div>

      {subTab === "alumni" && (
        <div>
          <div className="bg-card rounded-xl p-5 shadow-sm border border-border mb-5">
            <h3 className="font-semibold mb-3 text-[#1a2e1a]">
              নতুন প্রাক্তন সদস্য যোগ করুন
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                data-ocid="admin.alumni.name_input"
                type="text"
                placeholder="নাম *"
                value={alumniForm.name}
                onChange={(e) =>
                  setAlumniForm((f) => ({ ...f, name: e.target.value }))
                }
                className="border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
              <input
                data-ocid="admin.alumni.designation_input"
                type="text"
                placeholder="পদবী *"
                value={alumniForm.designation}
                onChange={(e) =>
                  setAlumniForm((f) => ({ ...f, designation: e.target.value }))
                }
                className="border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
              <input
                data-ocid="admin.alumni.years_input"
                type="text"
                placeholder="সক্রিয় বছর (যেমন: ২০১৫-২০১৮)"
                value={alumniForm.yearsActive}
                onChange={(e) =>
                  setAlumniForm((f) => ({ ...f, yearsActive: e.target.value }))
                }
                className="border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
              <input
                data-ocid="admin.alumni.status_input"
                type="text"
                placeholder="বর্তমান অবস্থান"
                value={alumniForm.currentStatus}
                onChange={(e) =>
                  setAlumniForm((f) => ({
                    ...f,
                    currentStatus: e.target.value,
                  }))
                }
                className="border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
            </div>
            <button
              type="button"
              data-ocid="admin.alumni.submit_button"
              disabled={
                !alumniForm.name.trim() ||
                !alumniForm.designation.trim() ||
                addAlumni.isPending
              }
              onClick={() => addAlumni.mutate({ ...alumniForm })}
              className="mt-3 bg-[#006A4E] hover:bg-green-800 text-white px-5 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 disabled:opacity-60 transition-colors"
            >
              {addAlumni.isPending && <Spinner small />}
              যোগ করুন
            </button>
          </div>
          <div className="space-y-2">
            {alumniList.map((a, i) => (
              <div
                key={String(a.id)}
                data-ocid={`admin.alumni.item.${i + 1}`}
                className="bg-card rounded-xl px-4 py-3 shadow-sm border border-border flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-[#1a2e1a]">{a.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {a.designation} · {a.yearsActive} · {a.currentStatus}
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid={`admin.alumni.delete_button.${i + 1}`}
                  onClick={() => setDeleteAlumniConfirm(a.id)}
                  className="text-[#DC143C] hover:text-red-700 text-sm font-semibold px-2 py-1 rounded hover:bg-red-50"
                >
                  মুছুন
                </button>
              </div>
            ))}
            {alumniList.length === 0 && (
              <div
                data-ocid="admin.alumni.empty_state"
                className="bg-card rounded-xl p-8 text-center border border-border text-muted-foreground"
              >
                কোনো প্রাক্তন সদস্য নেই
              </div>
            )}
          </div>
        </div>
      )}

      {subTab === "achievements" && (
        <div>
          <div className="bg-card rounded-xl p-5 shadow-sm border border-border mb-5">
            <h3 className="font-semibold mb-3 text-[#1a2e1a]">
              নতুন কৃতিত্ব যোগ করুন
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                data-ocid="admin.achievements.member_input"
                type="text"
                placeholder="সদস্যের নাম *"
                value={achForm.memberName}
                onChange={(e) =>
                  setAchForm((f) => ({ ...f, memberName: e.target.value }))
                }
                className="border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
              <input
                data-ocid="admin.achievements.title_input"
                type="text"
                placeholder="কৃতিত্বের শিরোনাম *"
                value={achForm.title}
                onChange={(e) =>
                  setAchForm((f) => ({ ...f, title: e.target.value }))
                }
                className="border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
            </div>
            <textarea
              data-ocid="admin.achievements.desc_textarea"
              placeholder="বিস্তারিত বিবরণ"
              value={achForm.description}
              onChange={(e) =>
                setAchForm((f) => ({ ...f, description: e.target.value }))
              }
              className="mt-3 w-full border border-input rounded-lg px-3 py-2 text-sm min-h-[80px] resize-none outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
            <button
              type="button"
              data-ocid="admin.achievements.submit_button"
              disabled={
                !achForm.memberName.trim() ||
                !achForm.title.trim() ||
                addAchievement.isPending
              }
              onClick={() => addAchievement.mutate({ ...achForm })}
              className="mt-3 bg-[#006A4E] hover:bg-green-800 text-white px-5 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 disabled:opacity-60 transition-colors"
            >
              {addAchievement.isPending && <Spinner small />}
              যোগ করুন
            </button>
          </div>
          <div className="space-y-2">
            {achievements.map((a, i) => (
              <div
                key={String(a.id)}
                data-ocid={`admin.achievements.item.${i + 1}`}
                className="bg-card rounded-xl px-4 py-3 shadow-sm border border-border flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1a2e1a]">{a.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {a.memberName} · {formatDate(a.date)}
                  </p>
                  <p className="text-sm mt-0.5 line-clamp-1">{a.description}</p>
                </div>
                <button
                  type="button"
                  data-ocid={`admin.achievements.delete_button.${i + 1}`}
                  onClick={() => setDeleteAchConfirm(a.id)}
                  className="ml-3 text-[#DC143C] hover:text-red-700 text-sm font-semibold px-2 py-1 rounded hover:bg-red-50 flex-shrink-0"
                >
                  মুছুন
                </button>
              </div>
            ))}
            {achievements.length === 0 && (
              <div
                data-ocid="admin.achievements.empty_state"
                className="bg-card rounded-xl p-8 text-center border border-border text-muted-foreground"
              >
                কোনো কৃতিত্ব নেই
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteAlumniConfirm !== null}
        message="প্রাক্তন সদস্যটি মুছে ফেলতে চান?"
        onConfirm={() =>
          deleteAlumniConfirm !== null &&
          deleteAlumni.mutate(deleteAlumniConfirm)
        }
        onCancel={() => setDeleteAlumniConfirm(null)}
        isPending={deleteAlumni.isPending}
        confirmLabel="হ্যাঁ, মুছুন"
        danger
      />
      <ConfirmDialog
        open={deleteAchConfirm !== null}
        message="কৃতিত্বটি মুছে ফেলতে চান?"
        onConfirm={() =>
          deleteAchConfirm !== null &&
          deleteAchievement.mutate(deleteAchConfirm)
        }
        onCancel={() => setDeleteAchConfirm(null)}
        isPending={deleteAchievement.isPending}
        confirmLabel="হ্যাঁ, মুছুন"
        danger
      />
    </div>
  );
}
