import { MemberStatus, createActor } from "@/backend";
import type {
  CreateAchievementPayload,
  CreateAlumniPayload,
  CreateGalleryPhotoPayload,
  CreateLibraryItemPayload,
  CreateNoticePayload,
  RegisterMemberPayload,
  SendMessagePayload,
  UpdateMemberPayload,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useAct() {
  return useActor(createActor);
}

export function useMembers() {
  const { actor, isFetching } = useAct();
  return useQuery({
    queryKey: ["members"],
    queryFn: async () => (actor ? actor.listMembers() : []),
    enabled: !!actor && !isFetching,
  });
}

export function usePendingMembers() {
  const { actor, isFetching } = useAct();
  return useQuery({
    queryKey: ["members", "pending"],
    queryFn: async () =>
      actor ? actor.listMembersByStatus(MemberStatus.pending) : [],
    enabled: !!actor && !isFetching,
  });
}

export function useMemberStats() {
  const { actor, isFetching } = useAct();
  return useQuery({
    queryKey: ["member-stats"],
    queryFn: async () =>
      actor
        ? actor.getMemberStats()
        : { pendingCount: 0n, total: 0n, joinedYesterday: 0n, joinedToday: 0n },
    enabled: !!actor && !isFetching,
  });
}

export function useMyProfile() {
  const { actor, isFetching } = useAct();
  return useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => (actor ? actor.getMyMemberProfile() : null),
    enabled: !!actor && !isFetching,
  });
}

export function useChatMessages(limit = 50n) {
  const { actor, isFetching } = useAct();
  return useQuery({
    queryKey: ["chat", limit.toString()],
    queryFn: async () => (actor ? actor.getChatMessages(limit) : []),
    enabled: !!actor && !isFetching,
    refetchInterval: 3000,
  });
}

export function useNotices(includeArchived = false) {
  const { actor, isFetching } = useAct();
  return useQuery({
    queryKey: ["notices", includeArchived],
    queryFn: async () => (actor ? actor.listNotices(includeArchived) : []),
    enabled: !!actor && !isFetching,
  });
}

export function useGallery() {
  const { actor, isFetching } = useAct();
  return useQuery({
    queryKey: ["gallery"],
    queryFn: async () => (actor ? actor.listGalleryPhotos() : []),
    enabled: !!actor && !isFetching,
  });
}

export function useAlumni() {
  const { actor, isFetching } = useAct();
  return useQuery({
    queryKey: ["alumni"],
    queryFn: async () => (actor ? actor.listAlumni() : []),
    enabled: !!actor && !isFetching,
  });
}

export function useAchievements() {
  const { actor, isFetching } = useAct();
  return useQuery({
    queryKey: ["achievements"],
    queryFn: async () => (actor ? actor.listAchievements() : []),
    enabled: !!actor && !isFetching,
  });
}

export function useLibrary() {
  const { actor, isFetching } = useAct();
  return useQuery({
    queryKey: ["library"],
    queryFn: async () => (actor ? actor.listLibraryItems() : []),
    enabled: !!actor && !isFetching,
  });
}

export function useDesignations() {
  const { actor, isFetching } = useAct();
  return useQuery({
    queryKey: ["designations"],
    queryFn: async () => (actor ? actor.listDesignations() : []),
    enabled: !!actor && !isFetching,
  });
}

// --- Mutations ---

export function useRegisterMember() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RegisterMemberPayload) =>
      actor!.registerMember(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useApproveMember() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => actor!.approveMember(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
      qc.invalidateQueries({ queryKey: ["member-stats"] });
    },
  });
}

export function useRejectMember() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: bigint; reason: string }) =>
      actor!.rejectMember(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
      qc.invalidateQueries({ queryKey: ["member-stats"] });
    },
  });
}

export function useDeleteMember() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => actor!.deleteMember(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useUpdateMember() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: { id: bigint; payload: UpdateMemberPayload }) =>
      actor!.updateMember(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useSendChatMessage() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SendMessagePayload) =>
      actor!.sendChatMessage(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chat"] }),
  });
}

export function useDeleteChatMessage() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => actor!.deleteChatMessage(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chat"] }),
  });
}

export function useCreateNotice() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateNoticePayload) =>
      actor!.createNotice(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notices"] }),
  });
}

export function useArchiveNotice() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => actor!.archiveNotice(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notices"] }),
  });
}

export function useDeleteNotice() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => actor!.deleteNotice(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notices"] }),
  });
}

export function useAddGalleryPhoto() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateGalleryPhotoPayload) =>
      actor!.addGalleryPhoto(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery"] }),
  });
}

export function useDeleteGalleryPhoto() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => actor!.deleteGalleryPhoto(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery"] }),
  });
}

export function useAddAlumni() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateAlumniPayload) =>
      actor!.addAlumni(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alumni"] }),
  });
}

export function useDeleteAlumni() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => actor!.deleteAlumni(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alumni"] }),
  });
}

export function useAddAchievement() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateAchievementPayload) =>
      actor!.addAchievement(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["achievements"] }),
  });
}

export function useDeleteAchievement() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => actor!.deleteAchievement(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["achievements"] }),
  });
}

export function useAddLibraryItem() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateLibraryItemPayload) =>
      actor!.addLibraryItem(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["library"] }),
  });
}

export function useDeleteLibraryItem() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => actor!.deleteLibraryItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["library"] }),
  });
}

export function useAddDesignation() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, rank }: { title: string; rank: bigint }) =>
      actor!.addDesignation(title, rank),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["designations"] }),
  });
}

export function useDeleteDesignation() {
  const { actor } = useAct();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => actor!.deleteDesignation(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["designations"] }),
  });
}

export function useAdminLogin() {
  const { actor } = useAct();
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: { email: string; password: string }) =>
      actor!.adminLogin(email, password),
  });
}
