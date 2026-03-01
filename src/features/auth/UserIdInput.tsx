import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Button } from '../../components/Button';
import styles from './UserIdInput.module.css';

interface UserIdInputProps {
  userId: string;
  onUserIdChange: (value: string) => void;
  planId: string;
  onPlanIdChange: (value: string) => void;
}

export function UserIdInput({ userId, onUserIdChange, planId, onPlanIdChange }: UserIdInputProps) {
  const [userInput, setUserInput] = useState(userId);
  const [planInput, setPlanInput] = useState(planId);
  const [isEditing, setIsEditing] = useState(!userId || !planId);

  const handleSave = () => {
    const trimmedUser = userInput.trim();
    const trimmedPlan = planInput.trim();
    if (trimmedUser && trimmedPlan) {
      onUserIdChange(trimmedUser);
      onPlanIdChange(trimmedPlan);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  const handleClear = () => {
    setUserInput('');
    setPlanInput('');
    onUserIdChange('');
    onPlanIdChange('');
    setIsEditing(true);
  };

  if (!isEditing && userId && planId) {
    return (
      <div className={styles.display}>
        <span className={styles.label}>User:</span>
        <span className={styles.value}>{userId}</span>
        <span className={styles.label}>Plan:</span>
        <span className={styles.value}>{planId}</span>
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
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter User ID"
        className={styles.field}
        autoFocus
      />
      <input
        type="text"
        value={planInput}
        onChange={(e) => setPlanInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter Plan ID"
        className={styles.field}
      />
      <Button onClick={handleSave} disabled={!userInput.trim() || !planInput.trim()}>
        Save
      </Button>
    </div>
  );
}
