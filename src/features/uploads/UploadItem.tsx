import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import type { UploadResponse } from '../../api/types';
import styles from './UploadItem.module.css';

interface UploadItemProps {
  upload: UploadResponse;
  onAbort?: (id: string) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

export function UploadItem({ upload, onAbort }: UploadItemProps) {
  const canAbort = ['Pending', 'Uploading'].includes(upload.status);

  return (
    <div className={styles.item}>
      <div className={styles.info}>
        <span className={styles.fileName}>{upload.fileName}</span>
        <span className={styles.meta}>
          {formatFileSize(upload.fileSize)} • {formatDate(upload.createdAt)}
        </span>
      </div>

      <div className={styles.actions}>
        <StatusBadge status={upload.status} />
        {canAbort && onAbort && (
          <Button variant="danger" onClick={() => onAbort(upload.id)}>
            Abort
          </Button>
        )}
      </div>

      {upload.errorMessage && (
        <p className={styles.error}>{upload.errorMessage}</p>
      )}
    </div>
  );
}
