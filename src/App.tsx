import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { UserIdInput } from './features/auth/UserIdInput';
import { UploadForm } from './features/uploads/UploadForm';
import { UploadList } from './features/uploads/UploadList';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2000,
      retry: 1,
    },
  },
});

function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') || '');
  const [planId, setPlanId] = useState(() => localStorage.getItem('planId') || '');

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
    // Invalidate queries when user changes
    queryClient.invalidateQueries();
  }, [userId]);

  useEffect(() => {
    if (planId) {
      localStorage.setItem('planId', planId);
    } else {
      localStorage.removeItem('planId');
    }
  }, [planId]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <header className="header">
          <h1>Video Upload System</h1>
          <UserIdInput
            userId={userId}
            onUserIdChange={setUserId}
            planId={planId}
            onPlanIdChange={setPlanId}
          />
        </header>

        {userId && planId ? (
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
        ) : (
          <div className="auth-prompt">
            <p>Please enter a User ID and Plan ID to continue</p>
          </div>
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
