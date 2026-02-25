import { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { ALLOWED_VIDEO_TYPES } from '../api/types';
import type { AllowedVideoType } from '../api/types';
import styles from './DropZone.module.css';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function DropZone({ onFileSelect, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidVideoType = (type: string): type is AllowedVideoType =>
    ALLOWED_VIDEO_TYPES.includes(type as AllowedVideoType);

  const handleFile = (file: File | undefined) => {
    setError(null);
    if (!file) return;

    if (!isValidVideoType(file.type)) {
      setError('Invalid file type. Please select a video file.');
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <div>
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ''} ${disabled ? styles.disabled : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_VIDEO_TYPES.join(',')}
          onChange={handleChange}
          hidden
          disabled={disabled}
        />
        <div className={styles.icon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <p className={styles.text}>Drag and drop a video file here, or click to select</p>
        <p className={styles.hint}>Supported: MP4, MPEG, MOV, AVI, WebM, MKV (max 5GB)</p>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
