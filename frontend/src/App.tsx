import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';

/**
 * Application route tree:
 *
 *   /                   → redirect to /dashboard or /login
 *   /login              → public, redirects to /dashboard if already logged in
 *   /register           → public, redirects to /dashboard if already logged in
 *   /dashboard          → protected — requires valid JWT
 */
export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />

      {/* Public routes — redirect to dashboard if already authenticated */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />

      {/* Protected routes — must be authenticated */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Catch-all — redirect unknown paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
