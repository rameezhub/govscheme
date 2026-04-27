import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/layout/ProtectedRoute';

import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import DashboardPage      from './pages/DashboardPage';
import SchemesPage        from './pages/SchemesPage';
import SchemeDetailPage   from './pages/SchemeDetailPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ProfilePage        from './pages/ProfilePage';
import AdminPage          from './pages/AdminPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"            element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register"         element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/dashboard"        element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/schemes"          element={<ProtectedRoute><SchemesPage /></ProtectedRoute>} />
      <Route path="/schemes/:id"      element={<ProtectedRoute><SchemeDetailPage /></ProtectedRoute>} />
      <Route path="/recommendations"  element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
      <Route path="/profile"          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/admin"            element={<AdminRoute><AdminPage /></AdminRoute>} />
      <Route path="/"                 element={<Navigate to="/dashboard" replace />} />
      <Route path="*"                 element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1A1F36',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              padding: '12px 16px',
              maxWidth: '360px',
            },
            success: {
              iconTheme: { primary: '#2E7D32', secondary: '#FFFFFF' },
            },
            error: {
              iconTheme: { primary: '#C62828', secondary: '#FFFFFF' },
            },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
