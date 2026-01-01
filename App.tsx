import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardHomePage } from './components/dashboard/DashboardHomePage';
import { BillingPage } from './components/dashboard/BillingPage';
import { useAuth } from './hooks/useAuth';
import { GoogleCallbackPage } from './components/auth/GoogleCallbackPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './components/auth/ResetPasswordPage';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div></div>; 
  }

  return isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />;
};

const AuthRedirect: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return null; 
    }
    
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AuthRedirect />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route path="/auth/callback" element={<GoogleCallbackPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardHomePage />} />
        <Route path="/billing" element={<BillingPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>

            <AppRoutes />
            <Toaster position="top-right" />
          </BrowserRouter>
        </AuthProvider>
    </ThemeProvider>
  );
};

export default App;