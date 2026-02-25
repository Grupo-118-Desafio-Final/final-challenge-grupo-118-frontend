import type { UploadStatus } from '../api/types';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: UploadStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[status.toLowerCase()]}`}>
      {status}
    </span>
  );
}
