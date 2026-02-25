import { Button } from '../../components/Button';
import type { UploadState } from './useUpload';
import styles from './UploadProgress.module.css';

interface UploadProgressProps {
  state: UploadState;
  onAbort: () => void;
  onReset: () => void;
}

const statusMessages: Record<UploadState['status'], string> = {
  idle: '',
  preparing: 'Preparing upload...',
  uploading: 'Uploading...',
  completing: 'Completing upload...',
  complete: 'Upload complete!',
  error: 'Upload failed',
};

export function UploadProgress({ state, onAbort, onReset }: UploadProgressProps) {
  const isUploading = ['preparing', 'uploading', 'completing'].includes(state.status);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.fileName}>{state.fileName}</span>
        <span className={styles.status}>{statusMessages[state.status]}</span>
      </div>

      <div className={styles.progressBar}>
        <div
          className={`${styles.progressFill} ${state.status === 'error' ? styles.error : ''} ${state.status === 'complete' ? styles.complete : ''}`}
          style={{ width: `${state.progress}%` }}
        />
      </div>

      <div className={styles.footer}>
        <span className={styles.percent}>{Math.round(state.progress)}%</span>

        {isUploading && (
          <Button variant="danger" onClick={onAbort}>
            Cancel
          </Button>
        )}

        {(state.status === 'complete' || state.status === 'error') && (
          <Button variant="secondary" onClick={onReset}>
            Upload Another
          </Button>
        )}
      </div>

      {state.error && <p className={styles.errorMessage}>{state.error}</p>}
    </div>
  );
}
