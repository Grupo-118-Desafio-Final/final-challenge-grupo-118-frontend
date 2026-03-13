import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../../components/Button';
import { login } from '../../api/auth';
import styles from './AuthForm.module.css';

interface LoginFormProps {
  onLoginSuccess: (token: string) => void;
  onSwitchToRegister: () => void;
}

export function LoginForm({ onLoginSuccess, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = await login(email, password);
      onLoginSuccess(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sign In</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="you@example.com"
            required
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="••••••••"
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <Button type="submit" disabled={loading || !email || !password}>
          {loading ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>

      <p className={styles.switch}>
        Don't have an account?{' '}
        <button type="button" className={styles.switchLink} onClick={onSwitchToRegister}>
          Register
        </button>
      </p>
    </div>
  );
}
