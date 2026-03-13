import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { LoginForm } from './features/auth/LoginForm';
import { RegisterForm } from './features/auth/RegisterForm';
import { UploadForm } from './features/uploads/UploadForm';
import { UploadList } from './features/uploads/UploadList';
import { Button } from './components/Button';
import { tokenStorage } from './api/token';
import { setUnauthorizedHandler } from './api/client';
import './App.css';

const APP_TITLE = 'Video Upload System';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2000,
      retry: 1,
    },
  },
});

function App() {
  const [token, setToken] = useState(() => tokenStorage.get());
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    setUnauthorizedHandler(() => {
      tokenStorage.remove();
      setToken('');
      queryClient.clear();
    });
  }, []);

  const handleLoginSuccess = (newToken: string) => {
    tokenStorage.set(newToken);
    setToken(newToken);
    queryClient.invalidateQueries();
  };

  const handleLogout = () => {
    tokenStorage.remove();
    setToken('');
    queryClient.clear();
  };

  if (!token) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="authPage">
          <h1 className="authTitle">{APP_TITLE}</h1>
          {authView === 'login' ? (
            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setAuthView('register')}
            />
          ) : (
            <RegisterForm onSwitchToLogin={() => setAuthView('login')} />
          )}
        </div>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <header className="header">
          <h1>{APP_TITLE}</h1>
          <Button variant="secondary" onClick={handleLogout}>
            Sign Out
          </Button>
        </header>

        <main className="main">
          <section className="section">
            <h2>Upload Video</h2>
            <UploadForm />
          </section>

          <section className="section">
            <h2>Your Uploads</h2>
            <UploadList />
          </section>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
