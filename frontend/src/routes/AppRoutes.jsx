import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RutaProtegida from '../components/RutaProtegida';
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import Dashboard from '../pages/Dashboard';
import DynamicCrudPage from '../pages/DynamicCrudPage';
import PeliculasPage from '../pages/PeliculasPage';
import CinesPage from '../pages/CinesPage';
import ProductosPage from '../pages/ProductosPage';

/**
 * AppRoutes centraliza la configuración de rutas de CineDa:
 * - Rutas Públicas: /login, /registro
 * - Rutas Protegidas: Dashboard (/), Vistas CRUD genéricas (/crud/:entityKey), y Vistas dedicadas
 * - Fallback: Cualquier ruta no definida redirige a /
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas Públicas de Autenticación */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      {/* Rutas Protegidas del Sistema */}
      <Route
        path="/"
        element={
          <RutaProtegida>
            <Dashboard />
          </RutaProtegida>
        }
      />

      <Route
        path="/crud/:entityKey"
        element={
          <RutaProtegida>
            <DynamicCrudPage />
          </RutaProtegida>
        }
      />

      {/* Rutas dedicadas existentes */}
      <Route
        path="/peliculas"
        element={
          <RutaProtegida>
            <PeliculasPage />
          </RutaProtegida>
        }
      />

      <Route
        path="/cines"
        element={
          <RutaProtegida>
            <CinesPage />
          </RutaProtegida>
        }
      />

      <Route
        path="/productos"
        element={
          <RutaProtegida>
            <ProductosPage />
          </RutaProtegida>
        }
      />

      {/* Redirección por defecto ante rutas desconocidas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

