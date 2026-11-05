import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DesktopWindow from './DesktopWindow';

export default function RutaProtegida({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e5e5ea] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs font-medium text-gray-600 tracking-wide">
            Verificando sesión CineDa...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DesktopWindow>{children}</DesktopWindow>;
}

