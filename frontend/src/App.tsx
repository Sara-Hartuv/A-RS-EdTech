import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import ProductsPage from "./pages/ProductsPage";
import { CartPage } from "./pages/CartPage";
import { useAuthStore } from "./store/authStore";

function App() {
  const isAuthenticated = useAuthStore((s) => !!s.user && !!s.token);

  return (
    <MainLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/student" replace /> : <LoginPage />} 
        />

        {/* Protected Routes - Student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Teacher & Admin */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={['teacher', 'admin']}>
              <TeacherDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - All authenticated users */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CartPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
