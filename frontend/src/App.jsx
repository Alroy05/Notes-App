import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './components/dashboard/DashboardLayout';
import NotesList from './pages/Dashboard/NotesList';
import NoteForm from './components/notes/NoteForm';
import NoteDetail from './pages/Dashboard/NoteDetail';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import VerifyEmail from './pages/Auth/VerifyEmail';
import NotFound from './pages/Error/NotFound';
import Loader from './components/common/Loader';
import Settings from './pages/Dashboard/Settings';
import { useEffect } from 'react';

function App() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const { theme } = useThemeStore();
  
  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  // Check auth status on initial load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <div className={`font-montserrat ${theme}`}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#1f2937' : '#fff',
            color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
            backdropFilter: 'blur(10px)',
            border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
            boxShadow: theme === 'dark' 
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' 
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
            {isAuthenticated && (
              <>
                <Route index element={<NotesList />} />
                <Route path="notes">
                  <Route path="new" element={<NoteForm />} />
                  <Route path=":id" element={<NoteDetail />} />
                  <Route path=":id/edit" element={<NoteForm />} />
                </Route>
                <Route path="settings" element={<Settings />} />
              </>
            )}
          </Route>
          
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Catch-all route */}
          <Route path="*" element={isAuthenticated ? <NotFound /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;