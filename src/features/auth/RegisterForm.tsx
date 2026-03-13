import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../../components/Button';
import { register } from '../../api/auth';
import styles from './AuthForm.module.css';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await register({
        name,
        lastName,
        email,
        // Parse as local date (appending time) to avoid UTC offset shifting the calendar day
        birthDate: new Date(`${birthDate}T00:00:00`).toISOString(),
        password,
      });

      if (result.error) {
        setError(result.errorMessage || 'Registration failed');
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Account Created</h2>
        <p className={styles.successMessage}>
          Your account has been created successfully. You can now sign in.
        </p>
        <Button onClick={onSwitchToLogin}>Go to Sign In</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Account</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>First Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="João"
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="lastName" className={styles.label}>Last Name</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={styles.input}
              placeholder="Silva"
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="reg-email" className={styles.label}>Email</label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="birthDate" className={styles.label}>Date of Birth</label>
          <input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className={styles.input}
            max={new Date().toISOString().split('T')[0]}
            min="1900-01-01"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="reg-password" className={styles.label}>Password</label>
          <input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="••••••••"
            minLength={8}
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <Button
          type="submit"
          disabled={loading || !name || !lastName || !email || !birthDate || !password}
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>

      <p className={styles.switch}>
        Already have an account?{' '}
        <button type="button" className={styles.switchLink} onClick={onSwitchToLogin}>
          Sign In
        </button>
      </p>
    </div>
  );
}
