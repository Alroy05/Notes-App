import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
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

  // Check auth status on initial load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />} 
        />
        <Route 
          path="/verify-email" 
          element={<VerifyEmail />} 
        />

        {/* Protected routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<NotesList />} />
          <Route path="notes">
            <Route path="new" element={<NoteForm />} />
            <Route path=":id" element={<NoteDetail />} />
            <Route path=":id/edit" element={<NoteForm />} />
          </Route>
        </Route>

        <Route path="/settings" element={<Settings />} />

        <Route 
          path="/*" 
          element={isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />} 
        />

        {/* Catch-all route */}
        <Route 
          path="*" 
          element={isAuthenticated ? <NotFound /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;