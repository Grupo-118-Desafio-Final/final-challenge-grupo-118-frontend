import type { ProcessingStatus } from '../api/types';
import styles from './ProcessingStatusBadge.module.css';

interface ProcessingStatusBadgeProps {
  status: ProcessingStatus;
}

const LABELS: Record<ProcessingStatus, string> = {
  NotStarted: 'Not Started',
  Processing: 'Processing',
  Processed: 'Processed',
  Failed: 'Failed',
};

export function ProcessingStatusBadge({ status }: ProcessingStatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[status.toLowerCase()]}`}>
      {LABELS[status]}
    </span>
  );
}
