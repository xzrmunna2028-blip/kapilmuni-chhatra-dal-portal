import type { backendInterface, Member, MemberStats, ChatMessage, Notice, GalleryPhoto, AlumniRecord, Achievement, LibraryItem, Designation, _ImmutableObjectStorageCreateCertificateResult, _ImmutableObjectStorageRefillResult, _ImmutableObjectStorageRefillInformation } from "../backend";
import { MemberStatus, UserRole } from "../backend";

const now = BigInt(Date.now()) * BigInt(1000000);

const mockMember: Member = {
  id: BigInt(1),
  photoBlob: { getBytes: async () => new Uint8Array(), getDirectURL: () => "", withUploadProgress: (fn: (p: number) => void) => ({ getBytes: async () => new Uint8Array(), getDirectURL: () => "", withUploadProgress: (fn2: (p: number) => void) => ({} as any) }) } as any,
  status: MemberStatus.approved,
  approvedAt: now,
  designation: "সভাপতি",
  rejectionReason: "",
  fullName: "মোহাম্মদ আলী",
  email: "ali@example.com",
  joinReason: "ছাত্রদলের আদর্শে বিশ্বাসী",
  phone: "+8801711000001",
  fullAddress: "কপিলমুনি, পাইকগাছা, খুলনা",
  registeredAt: now,
  adminNotes: "",
};

const mockStats: MemberStats = {
  total: BigInt(142),
  joinedToday: BigInt(3),
  joinedYesterday: BigInt(7),
  pendingCount: BigInt(5),
};

const mockMessages: ChatMessage[] = [
  {
    id: BigInt(1),
    text: "আস-সালামু আলাইকুম সবাইকে!",
    senderName: "রফিকুল ইসলাম",
    senderPhotoUrl: "",
    timestamp: now - BigInt(60000000000),
  },
  {
    id: BigInt(2),
    text: "ওয়ালাইকুম আস-সালাম ভাই। আজকের সভার সময় কী?",
    senderName: "করিম উদ্দিন",
    senderPhotoUrl: "",
    timestamp: now - BigInt(30000000000),
  },
  {
    id: BigInt(3),
    text: "বিকেল ৩টায় কপিলমুনি বাজারে। সবাই উপস্থিত থাকবেন।",
    senderName: "মোহাম্মদ আলী",
    senderPhotoUrl: "",
    timestamp: now,
  },
];

const mockNotices: Notice[] = [
  {
    id: BigInt(1),
    title: "জরুরি সভার নোটিশ",
    content: "আগামীকাল বিকেল ৩টায় ২নং কপিলমুনি ইউনিয়ন ছাত্রদলের জরুরি সভা অনুষ্ঠিত হবে। সকল সদস্যদের উপস্থিত থাকার অনুরোধ করা হচ্ছে।",
    date: now,
    author: "মোহাম্মদ আলী",
    archived: false,
  },
  {
    id: BigInt(2),
    title: "নতুন সদস্য নিবন্ধন চলছে",
    content: "ছাত্রদলে যোগ দিতে ইচ্ছুক সকল ছাত্রদের নিবন্ধন করার আহ্বান জানানো হচ্ছে।",
    date: now - BigInt(86400000000000),
    author: "সাধারণ সম্পাদক",
    archived: false,
  },
];

const mockDesignations: Designation[] = [
  { id: BigInt(1), title: "আহ্বায়ক", rank: BigInt(1) },
  { id: BigInt(2), title: "সিনিয়র যুগ্ম আহ্বায়ক", rank: BigInt(2) },
  { id: BigInt(3), title: "যুগ্ম আহ্বায়ক", rank: BigInt(3) },
  { id: BigInt(4), title: "সাধারণ সম্পাদক", rank: BigInt(4) },
  { id: BigInt(5), title: "সদস্য", rank: BigInt(5) },
];

const mockAlumni: AlumniRecord[] = [
  {
    id: BigInt(1),
    name: "আব্দুল হামিদ",
    designation: "সাবেক সভাপতি",
    yearsActive: "২০১৫-২০১৮",
    currentStatus: "বর্তমানে ব্যবসায়ী",
  },
];

const mockAchievements: Achievement[] = [
  {
    id: BigInt(1),
    title: "জাতীয় মেধা পুরস্কার",
    description: "ছাত্রদলের পক্ষ থেকে জাতীয় মেধা পুরস্কার অর্জন",
    memberName: "করিম উদ্দিন",
    date: now,
  },
];

const mockLibraryItems: LibraryItem[] = [
  {
    id: BigInt(1),
    title: "BNP ইশতেহার ২০২৪",
    description: "বাংলাদেশ জাতীয়তাবাদী দলের নির্বাচনী ইশতেহার",
    category: "রাজনৈতিক দলিল",
    uploadedDate: now,
    fileBlob: { getBytes: async () => new Uint8Array(), getDirectURL: () => "", withUploadProgress: (fn: (p: number) => void) => ({} as any) } as any,
  },
];

const mockGalleryPhotos: GalleryPhoto[] = [
  {
    id: BigInt(1),
    caption: "বার্ষিক সম্মেলন ২০২৪",
    uploaderName: "মোহাম্মদ আলী",
    uploadedDate: now,
    photoBlob: { getBytes: async () => new Uint8Array(), getDirectURL: () => "https://picsum.photos/400/300?random=1", withUploadProgress: (fn: (p: number) => void) => ({} as any) } as any,
  },
  {
    id: BigInt(2),
    caption: "স্বাধীনতা দিবস র‍্যালি",
    uploaderName: "রফিকুল ইসলাম",
    uploadedDate: now - BigInt(86400000000000),
    photoBlob: { getBytes: async () => new Uint8Array(), getDirectURL: () => "https://picsum.photos/400/300?random=2", withUploadProgress: (fn: (p: number) => void) => ({} as any) } as any,
  },
];

const mockMembers: Member[] = [
  mockMember,
  {
    ...mockMember,
    id: BigInt(2),
    fullName: "রফিকুল ইসলাম",
    designation: "সিনিয়র যুগ্ম আহ্বায়ক",
    email: "rafiq@example.com",
    phone: "+8801711000002",
  },
  {
    ...mockMember,
    id: BigInt(3),
    fullName: "করিম উদ্দিন",
    designation: "যুগ্ম আহ্বায়ক",
    email: "karim@example.com",
    phone: "+8801711000003",
  },
  {
    ...mockMember,
    id: BigInt(4),
    fullName: "আনিসুর রহমান",
    designation: "সাধারণ সম্পাদক",
    email: "anis@example.com",
    phone: "+8801711000004",
  },
  {
    ...mockMember,
    id: BigInt(5),
    fullName: "জাহিদুল ইসলাম",
    designation: "সদস্য",
    status: MemberStatus.pending,
    email: "jahid@example.com",
    phone: "+8801711000005",
  },
];

export const mockBackend: backendInterface = {
  addAchievement: async (payload) => ({ id: BigInt(2), ...payload, photoBlob: payload.photoBlob as any, date: now }),
  addAlumni: async (payload) => ({ id: BigInt(2), ...payload, photoBlob: payload.photoBlob as any }),
  addDesignation: async (title, rank) => ({ id: BigInt(10), title, rank }),
  addGalleryPhoto: async (payload) => ({ id: BigInt(3), ...payload, uploadedDate: now }),
  addLibraryItem: async (payload) => ({ id: BigInt(2), ...payload, uploadedDate: now }),
  adminLogin: async (email, password) => email === "xzrmunna33@gmail.com" ? "mock-admin-token-123" : null,
  approveMember: async () => true,
  archiveNotice: async () => true,
  assignCallerUserRole: async () => undefined,
  createNotice: async (payload) => ({ id: BigInt(3), ...payload, date: now, archived: false }),
  deleteAchievement: async () => true,
  deleteAlumni: async () => true,
  deleteChatMessage: async () => true,
  deleteDesignation: async () => true,
  deleteGalleryPhoto: async () => true,
  deleteLibraryItem: async () => true,
  deleteMember: async () => true,
  deleteNotice: async () => true,
  getCallerUserRole: async () => UserRole.guest,
  getChatMessages: async () => mockMessages,
  getMember: async () => mockMember,
  getMemberStats: async () => mockStats,
  getMyMemberProfile: async () => mockMember,
  isCallerAdmin: async () => false,
  listAchievements: async () => mockAchievements,
  listAlumni: async () => mockAlumni,
  listDesignations: async () => mockDesignations,
  listGalleryPhotos: async () => mockGalleryPhotos,
  listLibraryItems: async () => mockLibraryItems,
  listMembers: async () => mockMembers,
  listMembersByStatus: async (status) => mockMembers.filter(m => m.status === status),
  listNotices: async () => mockNotices,
  registerMember: async () => BigInt(6),
  rejectMember: async () => true,
  sendChatMessage: async (payload) => ({ id: BigInt(4), ...payload, timestamp: now }),
  updateMember: async () => true,
  validateAdminSession: async (token) => token === "mock-admin-token-123",
  _immutableObjectStorageBlobsAreLive: async (_hashes: Array<Uint8Array>) => [] as boolean[],
  _immutableObjectStorageBlobsToDelete: async () => [] as Uint8Array[],
  _immutableObjectStorageConfirmBlobDeletion: async (_blobs: Array<Uint8Array>) => undefined,
  _immutableObjectStorageCreateCertificate: async (_blobHash: string): Promise<_ImmutableObjectStorageCreateCertificateResult> => ({ method: "", blob_hash: "" }),
  _immutableObjectStorageRefillCashier: async (_refillInformation: _ImmutableObjectStorageRefillInformation | null): Promise<_ImmutableObjectStorageRefillResult> => ({}),
  _immutableObjectStorageUpdateGatewayPrincipals: async () => undefined,
  _initializeAccessControl: async () => undefined,
};
