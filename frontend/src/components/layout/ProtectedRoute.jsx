import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Loader() {
  return (
    <div className="min-h-screen bg-gov-bg flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-full animate-spin"
        style={{ border: '3px solid #E8EFFC', borderTopColor: '#1A4FA0' }} />
      <p className="text-gov-muted text-sm font-medium">Loading YojanaPath…</p>
    </div>
  );
}

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/login" replace />;
}
export function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}
export function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return !user ? children : <Navigate to="/dashboard" replace />;
}
