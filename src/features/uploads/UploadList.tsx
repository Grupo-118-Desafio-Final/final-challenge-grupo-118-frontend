import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadsApi } from '../../api/uploads';
import { UploadItem } from './UploadItem';
import { Button } from '../../components/Button';
import type { UploadResponse } from '../../api/types';
import styles from './UploadList.module.css';

const TERMINAL_STATUSES = new Set<UploadResponse['status']>(['Completed', 'Failed']);
const TERMINAL_PROCESSING = new Set<UploadResponse['processingStatus']>(['Processed', 'Failed']);

function allSettled(items: UploadResponse[]): boolean {
  return items.every(
    (u) => TERMINAL_STATUSES.has(u.status) && TERMINAL_PROCESSING.has(u.processingStatus)
  );
}

export function UploadList() {
  const [page, setPage] = useState(1);
  const [confirmAbortId, setConfirmAbortId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error, isRefetching, refetch } = useQuery({
    queryKey: ['uploads', page],
    queryFn: () => uploadsApi.getUploads(page, 10),
    refetchInterval: (query) => {
      const items = query.state.data?.items ?? [];
      return items.length > 0 && allSettled(items) ? false : 5000;
    },
  });

  const abortMutation = useMutation({
    mutationFn: uploadsApi.abortUpload,
    onSuccess: () => {
      setConfirmAbortId(null);
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
    },
    onError: () => {
      setConfirmAbortId(null);
    },
  });

  if (isLoading) {
    return <div className={styles.loading}>Loading uploads...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <span>Failed to load uploads.</span>
        <Button variant="secondary" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        No uploads yet. Upload a video to get started.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {isRefetching && <div className={styles.refreshing}>Refreshing...</div>}

      <div className={styles.list}>
        {items.map((upload) => (
          <UploadItem
            key={upload.id}
            upload={upload}
            confirmingAbort={confirmAbortId === upload.id}
            abortPending={abortMutation.isPending && confirmAbortId === upload.id}
            onRequestAbort={() => setConfirmAbortId(upload.id)}
            onConfirmAbort={() => abortMutation.mutate(upload.id)}
            onCancelAbort={() => setConfirmAbortId(null)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Button
            variant="secondary"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
