// Request types
export interface CreateUploadRequest {
  fileName: string;
  contentType: string;
  fileSize: number;
  totalParts: number;
}

export interface CompleteUploadRequest {
  parts: PartInfo[];
}

export interface PartInfo {
  partNumber: number;
  eTag: string;
}

// Response types
export interface CreateUploadResponse {
  uploadId: string;
  objectKey: string;
  status: UploadStatus;
}

export interface PresignedUrlsResponse {
  uploadId: string;
  urls: PresignedUrlInfo[];
}

export interface PresignedUrlInfo {
  partNumber: number;
  url: string;
}

export interface UploadResponse {
  id: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  status: UploadStatus;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export type UploadStatus = 'Pending' | 'Uploading' | 'Processing' | 'Completed' | 'Failed';

// Allowed video types
export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
  'video/x-matroska',
] as const;

export type AllowedVideoType = typeof ALLOWED_VIDEO_TYPES[number];
