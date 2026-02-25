import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadsApi } from '../../api/uploads';
import { UploadItem } from './UploadItem';
import { Button } from '../../components/Button';
import styles from './UploadList.module.css';

export function UploadList() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: ['uploads', page],
    queryFn: () => uploadsApi.getUploads(page, 10),
    refetchInterval: 5000,
  });

  const abortMutation = useMutation({
    mutationFn: uploadsApi.abortUpload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
    },
  });

  const handleAbort = (id: string) => {
    if (confirm('Are you sure you want to abort this upload?')) {
      abortMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading uploads...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        Failed to load uploads. Please try again.
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
          <UploadItem key={upload.id} upload={upload} onAbort={handleAbort} />
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
