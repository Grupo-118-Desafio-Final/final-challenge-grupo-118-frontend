import { Button } from '../../components/Button';
import type { UploadResponse, UploadStatus, ProcessingStatus } from '../../api/types';
import styles from './UploadItem.module.css';

interface UploadItemProps {
  upload: UploadResponse;
  confirmingAbort: boolean;
  abortPending: boolean;
  onRequestAbort: () => void;
  onConfirmAbort: () => void;
  onCancelAbort: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Collapses UploadStatus + ProcessingStatus into one human-readable label
 * with a single visual variant. This replaces the two confusing separate badges.
 */
type StatusVariant = 'pending' | 'active' | 'success' | 'error' | 'neutral';

function resolveStatus(
  uploadStatus: UploadStatus,
  processingStatus: ProcessingStatus
): { label: string; variant: StatusVariant } {
  if (uploadStatus === 'Failed') return { label: 'Upload failed', variant: 'error' };
  if (processingStatus === 'Failed') return { label: 'Processing failed', variant: 'error' };
  if (processingStatus === 'Processed') return { label: 'Ready to download', variant: 'success' };
  if (processingStatus === 'Processing') return { label: 'Processing frames...', variant: 'active' };
  if (uploadStatus === 'Completed') return { label: 'Queued for processing', variant: 'pending' };
  if (uploadStatus === 'Processing') return { label: 'Processing upload...', variant: 'active' };
  if (uploadStatus === 'Uploading') return { label: 'Uploading...', variant: 'active' };
  if (uploadStatus === 'Pending') return { label: 'Pending', variant: 'neutral' };
  return { label: uploadStatus, variant: 'neutral' };
}

export function UploadItem({
  upload,
  confirmingAbort,
  abortPending,
  onRequestAbort,
  onConfirmAbort,
  onCancelAbort,
}: UploadItemProps) {
  const canAbort = ['Pending', 'Uploading'].includes(upload.status);
  const canDownload = upload.processingStatus === 'Processed' && !!upload.zipBlobUrl;
  const { label, variant } = resolveStatus(upload.status, upload.processingStatus);

  return (
    <div className={styles.item}>
      <div className={styles.info}>
        <span className={styles.fileName} title={upload.fileName}>
          {upload.fileName}
        </span>
        <span className={styles.meta}>
          {formatFileSize(upload.fileSize)} &bull; {formatDate(upload.createdAt)}
        </span>
      </div>

      <div className={styles.right}>
        <span className={`${styles.statusBadge} ${styles[variant]}`}>{label}</span>

        <div className={styles.actions}>
          {canDownload && (
            <a href={upload.zipBlobUrl} download className={styles.downloadLink}>
              Download ZIP
            </a>
          )}

          {canAbort && !confirmingAbort && (
            <Button variant="danger" onClick={onRequestAbort}>
              Abort
            </Button>
          )}

          {canAbort && confirmingAbort && (
            <div className={styles.confirmRow}>
              <span className={styles.confirmText}>Abort this upload?</span>
              <Button variant="danger" onClick={onConfirmAbort} disabled={abortPending}>
                {abortPending ? 'Aborting...' : 'Yes, abort'}
              </Button>
              <Button variant="secondary" onClick={onCancelAbort} disabled={abortPending}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {upload.errorMessage && (
        <p className={styles.errorMessage}>{upload.errorMessage}</p>
      )}
    </div>
  );
}
