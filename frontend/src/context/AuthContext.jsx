import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const TOKEN_KEY = 'cineda_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar sesión activa al montar el contexto
  useEffect(() => {
    let isMounted = true;

    const verifyToken = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        if (isMounted) {
          setUsuario(null);
          setToken(null);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await authService.me();
        if (isMounted) {
          const user = response?.usuario || response?.data || response;
          setUsuario(user);
          setToken(storedToken);
        }
      } catch (error) {
        console.warn('Sesión previa inválida o expirada:', error.message);
        localStorage.removeItem(TOKEN_KEY);
        if (isMounted) {
          setToken(null);
          setUsuario(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, []);

  // Iniciar sesión
  const login = useCallback(async (email, password) => {
    const response = await authService.login({ email, password });
    const newToken = response?.token;
    const user = response?.usuario || response?.data?.usuario || null;

    if (!newToken) {
      throw new Error('No se recibió el token de autenticación del servidor');
    }

    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUsuario(user);

    return response;
  }, []);

  // Registrar usuario
  const register = useCallback(async (data) => {
    const response = await authService.register(data);
    return response;
  }, []);

  // Cerrar sesión
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUsuario(null);
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }, []);

  const value = {
    token,
    usuario,
    isAuthenticated: Boolean(token && usuario),
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}

