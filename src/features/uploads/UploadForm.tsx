import { DropZone } from '../../components/DropZone';
import { UploadProgress } from './UploadProgress';
import { useUpload } from './useUpload';
import styles from './UploadForm.module.css';

export function UploadForm() {
  const upload = useUpload();

  const handleFileSelect = (file: File) => {
    upload.uploadFile(file);
  };

  const showProgress = upload.status !== 'idle';

  return (
    <div className={styles.container}>
      {!showProgress ? (
        <DropZone onFileSelect={handleFileSelect} />
      ) : (
        <UploadProgress state={upload} onAbort={upload.abort} onReset={upload.reset} />
      )}
    </div>
  );
}
