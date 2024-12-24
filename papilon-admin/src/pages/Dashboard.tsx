// src/pages/Dashboard/Dashboard.tsx

import React, { useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import styles from './Dashboard.module.css';

interface Cliente {
  id_cliente: number;
  // Agrega otros campos según tu modelo de datos
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCliente = async () => {
      const id_usuario = AuthService.getUserId();
      if (id_usuario) {
        try {
          const response = await axiosInstance.get('/get_cliente', {
            params: { id_usuario },
          });
          setCliente(response.data);
        } catch (err: any) {
          setError(err.response?.data?.error || 'Error al obtener cliente');
        }
      }
    };

    fetchCliente();
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1>Bienvenido al Dashboard</h1>
      {error && <p className={styles.error}>{error}</p>}
      {cliente ? (
        <div className={styles.clienteInfo}>
          <p>ID Cliente: {cliente.id_cliente}</p>
          {/* Muestra otros datos del cliente según sea necesario */}
        </div>
      ) : (
        !error && <p>Cargando información del cliente...</p>
      )}
      <button className={styles.logoutButton} onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Dashboard;
