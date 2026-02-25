import { useState, useCallback, useRef } from 'react';
import { uploadsApi } from '../../api/uploads';
import type { PartInfo } from '../../api/types';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB

export type UploadState = {
  status: 'idle' | 'preparing' | 'uploading' | 'completing' | 'complete' | 'error';
  progress: number;
  uploadId: string | null;
  error: string | null;
  fileName: string | null;
};

export function useUpload() {
  const [state, setState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
    uploadId: null,
    error: null,
    fileName: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setState({
        status: 'preparing',
        progress: 0,
        uploadId: null,
        error: null,
        fileName: file.name,
      });

      const totalParts = Math.ceil(file.size / CHUNK_SIZE);

      // 1. Create upload
      const createResponse = await uploadsApi.createUpload({
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
        totalParts,
      });

      if (signal.aborted) throw new Error('Upload cancelled');

      setState((s) => ({ ...s, uploadId: createResponse.uploadId }));

      // 2. Get presigned URLs
      const { urls } = await uploadsApi.getPresignedUrls(createResponse.uploadId);

      if (signal.aborted) throw new Error('Upload cancelled');

      setState((s) => ({ ...s, status: 'uploading' }));

      // 3. Upload parts
      const parts: PartInfo[] = [];
      for (let i = 0; i < totalParts; i++) {
        if (signal.aborted) throw new Error('Upload cancelled');

        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const urlInfo = urls.find((u) => u.partNumber === i + 1);
        if (!urlInfo) throw new Error(`Missing presigned URL for part ${i + 1}`);

        const response = await fetch(urlInfo.url, {
          method: 'PUT',
          body: chunk,
          signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload part ${i + 1}: ${response.statusText}`);
        }

        // Azure Block Blob StageBlock doesn't return ETag like S3.
        // We use ETag if available, otherwise fallback to Content-MD5 or empty string.
        // The backend reconstructs block IDs from part numbers, so ETag is not strictly required.
        const etag = response.headers.get('ETag') || response.headers.get('x-ms-content-md5') || '';
        parts.push({ partNumber: i + 1, eTag: etag.replace(/"/g, '') });

        setState((s) => ({ ...s, progress: ((i + 1) / totalParts) * 100 }));
      }

      // 4. Complete upload
      setState((s) => ({ ...s, status: 'completing' }));
      await uploadsApi.completeUpload(createResponse.uploadId, { parts });

      setState((s) => ({ ...s, status: 'complete', progress: 100 }));
    } catch (error) {
      if (error instanceof Error && error.message === 'Upload cancelled') {
        setState((s) => ({
          ...s,
          status: 'idle',
          progress: 0,
          uploadId: null,
          error: null,
          fileName: null,
        }));
      } else {
        setState((s) => ({
          ...s,
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed',
        }));
      }
    }
  }, []);

  const abort = useCallback(async () => {
    abortControllerRef.current?.abort();

    if (state.uploadId) {
      try {
        await uploadsApi.abortUpload(state.uploadId);
      } catch {
        // Ignore abort errors
      }
    }

    setState({
      status: 'idle',
      progress: 0,
      uploadId: null,
      error: null,
      fileName: null,
    });
  }, [state.uploadId]);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      progress: 0,
      uploadId: null,
      error: null,
      fileName: null,
    });
  }, []);

  return { ...state, uploadFile, abort, reset };
}
