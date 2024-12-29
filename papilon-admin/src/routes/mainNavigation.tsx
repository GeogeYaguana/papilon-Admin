// src/routes.tsx
import React from 'react';
import { createBrowserRouter, RouterProvider, RouteObject, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import { AuthService } from '../services/AuthService';
import CreateProduct from '../pages/CreateProduct';
import EditProduct from '../pages/EditProduct'; // <--- Importar el componente de edición
import RegistrarFactura from '../pages/RegistrarFactura';
import Facturas from '../pages/Facturas';
import Canjes from '../pages/Canjes'; // <--- Importar el componente Canjes
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/create-product',
    element: (
      <ProtectedRoute>
        <CreateProduct />
      </ProtectedRoute>
    ),
  },
  // Nueva ruta para editar producto
  {
    path: '/edit-product/:id', // :id es el parámetro dinámico
    element: (
      <ProtectedRoute>
        <EditProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: '/registrar-factura', // Ruta para Registrar Factura
    element: (
      <ProtectedRoute>
        <RegistrarFactura />
      </ProtectedRoute>
    ),
  },
  {
    path: '/facturas', // <--- Nueva ruta para el componente Facturas
    element: (
      <ProtectedRoute>
        <Facturas />
      </ProtectedRoute>
    ),
  },
  {
    path: '/canjes', // <--- Nueva ruta para el componente Canjes
    element: (
      <ProtectedRoute>
        <Canjes />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

const router = createBrowserRouter(routes);

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
