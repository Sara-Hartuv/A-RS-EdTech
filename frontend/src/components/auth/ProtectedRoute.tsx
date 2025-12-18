// src/components/auth/ProtectedRoute.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import type { UserRole } from "../../types/user";

interface Props {
  children: ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles,
  redirectTo = "/login" 
}: Props) {
  // Use separate selectors instead of returning a new object on every render
  // This prevents infinite loops with React 18's useSyncExternalStore
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isLoading = useAuthStore((s) => s.isLoading);

  // While auth is initializing, don't redirect — allow initAuth to complete
  if (isLoading) return null;

  // Compute auth directly from state
  const authed = !!user && !!token;

  // Not authenticated - redirect to login
  if (!authed) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role permissions if specified
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // User doesn't have permission - redirect based on their role
    if (user.role === 'student') {
      return <Navigate to="/student" replace />;
    } else if (user.role === 'teacher') {
      return <Navigate to="/teacher" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // All checks passed - render children
  return <>{children}</>;
}
