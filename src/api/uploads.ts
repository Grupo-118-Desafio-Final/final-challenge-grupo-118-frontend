import { apiClient } from './client';
import type {
  CreateUploadRequest,
  CreateUploadResponse,
  PresignedUrlsResponse,
  CompleteUploadRequest,
  UploadResponse,
  PagedResponse,
} from './types';

export const uploadsApi = {
  createUpload: (request: CreateUploadRequest) =>
    apiClient<CreateUploadResponse>('/uploads', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  getPresignedUrls: (uploadId: string) =>
    apiClient<PresignedUrlsResponse>(`/uploads/${uploadId}/presigned-urls`),

  completeUpload: (uploadId: string, request: CompleteUploadRequest) =>
    apiClient<void>(`/uploads/${uploadId}/complete`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  getUploads: (page = 1, pageSize = 10) =>
    apiClient<PagedResponse<UploadResponse>>(
      `/uploads?page=${page}&pageSize=${pageSize}`
    ),

  getUpload: (uploadId: string) =>
    apiClient<UploadResponse>(`/uploads/${uploadId}`),

  abortUpload: (uploadId: string) =>
    apiClient<void>(`/uploads/${uploadId}`, { method: 'DELETE' }),
};
