import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Button } from '../../components/Button';
import styles from './UserIdInput.module.css';

interface UserIdInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function UserIdInput({ value, onChange }: UserIdInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isEditing, setIsEditing] = useState(!value);

  const handleSave = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onChange(trimmed);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    setIsEditing(true);
  };

  if (!isEditing && value) {
    return (
      <div className={styles.display}>
        <span className={styles.label}>User:</span>
        <span className={styles.value}>{value}</span>
        <Button variant="secondary" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
        <Button variant="danger" onClick={handleClear}>
          Clear
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.input}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter User ID"
        className={styles.field}
        autoFocus
      />
      <Button onClick={handleSave} disabled={!inputValue.trim()}>
        Save
      </Button>
    </div>
  );
}
