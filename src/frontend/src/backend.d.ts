import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface CreateAlumniPayload {
    photoBlob?: ExternalBlob;
    yearsActive: string;
    name: string;
    designation: string;
    currentStatus: string;
}
export interface GalleryPhoto {
    id: bigint;
    photoBlob: ExternalBlob;
    uploadedDate: Timestamp;
    uploaderName: string;
    caption: string;
}
export type Timestamp = bigint;
export interface CreateNoticePayload {
    title: string;
    content: string;
    author: string;
}
export interface CreateAchievementPayload {
    photoBlob?: ExternalBlob;
    title: string;
    description: string;
    memberName: string;
}
export interface SendMessagePayload {
    text: string;
    senderPhotoUrl: string;
    senderName: string;
}
export interface RegisterMemberPayload {
    photoBlob: ExternalBlob;
    designation: string;
    fullName: string;
    email: string;
    joinReason: string;
    phone: string;
    fullAddress: string;
}
export type MemberId = bigint;
export interface AlumniRecord {
    id: bigint;
    photoBlob?: ExternalBlob;
    yearsActive: string;
    name: string;
    designation: string;
    currentStatus: string;
}
export interface Achievement {
    id: bigint;
    photoBlob?: ExternalBlob;
    title: string;
    date: Timestamp;
    description: string;
    memberName: string;
}
export interface ChatMessage {
    id: bigint;
    text: string;
    senderPhotoUrl: string;
    timestamp: Timestamp;
    senderName: string;
}
export interface UpdateMemberPayload {
    photoBlob: ExternalBlob;
    designation: string;
    fullName: string;
    email: string;
    joinReason: string;
    phone: string;
    fullAddress: string;
    adminNotes: string;
}
export interface SiteSettings {
    adminSignature: string;
    centerName: string;
    siteName: string;
    upazilaName: string;
    unionName: string;
}
export interface Notice {
    id: bigint;
    title: string;
    content: string;
    date: Timestamp;
    author: string;
    archived: boolean;
}
export interface MemberStats {
    pendingCount: bigint;
    total: bigint;
    joinedYesterday: bigint;
    joinedToday: bigint;
}
export interface Member {
    id: MemberId;
    photoBlob: ExternalBlob;
    status: MemberStatus;
    adminSignature?: string;
    approvedAt?: Timestamp;
    designation: string;
    rank: bigint;
    rejectionReason: string;
    fullName: string;
    email: string;
    joinReason: string;
    phone: string;
    fullAddress: string;
    registeredAt: Timestamp;
    adminNotes: string;
}
export interface LibraryItem {
    id: bigint;
    title: string;
    uploadedDate: Timestamp;
    fileBlob: ExternalBlob;
    description: string;
    category: string;
}
export interface Designation {
    id: bigint;
    title: string;
    rank: bigint;
}
export interface CreateLibraryItemPayload {
    title: string;
    fileBlob: ExternalBlob;
    description: string;
    category: string;
}
export interface CreateGalleryPhotoPayload {
    photoBlob: ExternalBlob;
    uploaderName: string;
    caption: string;
}
export enum MemberStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAchievement(payload: CreateAchievementPayload): Promise<Achievement>;
    addAlumni(payload: CreateAlumniPayload): Promise<AlumniRecord>;
    addDesignation(title: string, rank: bigint): Promise<Designation>;
    addGalleryPhoto(payload: CreateGalleryPhotoPayload): Promise<GalleryPhoto>;
    addLibraryItem(payload: CreateLibraryItemPayload): Promise<LibraryItem>;
    adminLogin(password: string): Promise<string | null>;
    approveMember(id: MemberId, adminSignature: string | null): Promise<boolean>;
    archiveNotice(id: bigint): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createNotice(payload: CreateNoticePayload): Promise<Notice>;
    deleteAchievement(id: bigint): Promise<boolean>;
    deleteAlumni(id: bigint): Promise<boolean>;
    deleteChatMessage(id: bigint): Promise<boolean>;
    deleteDesignation(id: bigint): Promise<boolean>;
    deleteGalleryPhoto(id: bigint): Promise<boolean>;
    deleteLibraryItem(id: bigint): Promise<boolean>;
    deleteMember(id: MemberId): Promise<boolean>;
    deleteNotice(id: bigint): Promise<boolean>;
    getCallerUserRole(): Promise<UserRole>;
    getChatMessages(limit: bigint): Promise<Array<ChatMessage>>;
    getMember(id: MemberId): Promise<Member | null>;
    getMemberStats(): Promise<MemberStats>;
    getMyMemberProfile(): Promise<Member | null>;
    getSiteSettings(): Promise<SiteSettings>;
    isCallerAdmin(): Promise<boolean>;
    listAchievements(): Promise<Array<Achievement>>;
    listAlumni(): Promise<Array<AlumniRecord>>;
    listDesignations(): Promise<Array<Designation>>;
    listGalleryPhotos(): Promise<Array<GalleryPhoto>>;
    listLibraryItems(): Promise<Array<LibraryItem>>;
    listMembers(): Promise<Array<Member>>;
    listMembersByStatus(status: MemberStatus): Promise<Array<Member>>;
    listNotices(includeArchived: boolean): Promise<Array<Notice>>;
    registerMember(payload: RegisterMemberPayload): Promise<MemberId>;
    rejectMember(id: MemberId, reason: string): Promise<boolean>;
    sendChatMessage(payload: SendMessagePayload): Promise<ChatMessage>;
    updateMember(id: MemberId, payload: UpdateMemberPayload): Promise<boolean>;
    updateMemberDesignation(id: MemberId, newDesignation: string, newRank: bigint): Promise<boolean>;
    updateSiteSettings(newSettings: SiteSettings): Promise<void>;
    validateAdminSession(token: string): Promise<boolean>;
}
