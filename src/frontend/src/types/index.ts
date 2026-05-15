import type { MemberStatus, Timestamp } from "@/backend";

export type { MemberStatus, Timestamp };

export interface Member {
  id: bigint;
  photoBlob: { getDirectURL(): string };
  status: MemberStatus;
  approvedAt?: Timestamp;
  designation: string;
  rejectionReason: string;
  fullName: string;
  email: string;
  joinReason: string;
  phone: string;
  fullAddress: string;
  registeredAt: Timestamp;
  adminNotes: string;
}

export interface ChatMessage {
  id: bigint;
  text: string;
  senderPhotoUrl: string;
  timestamp: Timestamp;
  senderName: string;
}

export interface Notice {
  id: bigint;
  title: string;
  content: string;
  date: Timestamp;
  author: string;
  archived: boolean;
}

export interface GalleryPhoto {
  id: bigint;
  photoBlob: { getDirectURL(): string };
  uploadedDate: Timestamp;
  uploaderName: string;
  caption: string;
}

export interface AlumniRecord {
  id: bigint;
  photoBlob?: { getDirectURL(): string };
  yearsActive: string;
  name: string;
  designation: string;
  currentStatus: string;
}

export interface Achievement {
  id: bigint;
  photoBlob?: { getDirectURL(): string };
  title: string;
  date: Timestamp;
  description: string;
  memberName: string;
}

export interface LibraryItem {
  id: bigint;
  title: string;
  uploadedDate: Timestamp;
  fileBlob: { getDirectURL(): string };
  description: string;
  category: string;
}

export interface Designation {
  id: bigint;
  title: string;
  rank: bigint;
}

export interface MemberStats {
  pendingCount: bigint;
  total: bigint;
  joinedYesterday: bigint;
  joinedToday: bigint;
}

export type AdminSession = {
  token: string;
  email: string;
  expiresAt: number;
};
