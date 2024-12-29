import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import { ClienteService } from '../services/ClienteService';
import styles from './Canjes.module.css';

interface DetalleCanje {
  id_detalle_canje: number;
  id_producto: number;
  cantidad: number;
  puntos_totales: number;
  valor: string;
  fecha_creacion: string;
  producto: {
    id_producto: number;
    nombre: string;
    puntos_necesario: number;
  };
}

interface Canje {
  id_canje: number;
  id_cliente: number;
  id_local: number;
  estado: string;
  puntos_utilizados: number;
  fecha: string;
  local: {
    id_local: number;
    nombre_local: string;
    direccion: string;
  };
  detalles: DetalleCanje[];
}

const Canjes: React.FC = () => {
  const { state } = useAuth();
  const [canjes, setCanjes] = useState<Canje[]>([]);
  const [clientes, setClientes] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [estados, setEstados] = useState<string[]>([]);
  const [canjeSeleccionado, setCanjeSeleccionado] = useState<number | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<string>('');

  // Cargar canjes al montar
  useEffect(() => {
    const fetchCanjes = async () => {
      setLoading(true);
      setError('');
      try {
        // Llamada a la API para obtener los canjes
        const response = await axiosInstance.get<{ canjes: Canje[] }>(`/canjes/local/usuario/${state.userId}`);
        const canjesData = response.data.canjes;

        // Obtener IDs únicos de clientes
        const clienteIds = [...new Set(canjesData.map((canje) => canje.id_cliente))];

        // Obtener los nombres de los clientes usando la nueva ruta
        const clientePromises = clienteIds.map((id_cliente) => ClienteService.getClienteNombre(id_cliente));
        const clientesData = await Promise.all(clientePromises);

        // Crear un objeto con los nombres de los clientes
        const clienteNames = clienteIds.reduce((acc, id_cliente, index) => {
          acc[id_cliente] = clientesData[index];
          return acc;
        }, {} as Record<number, string>);

        setClientes(clienteNames);
        setCanjes(canjesData);
      } catch (err: any) {
        console.error(err);
        setError('Error al cargar los canjes asociados al local');
      } finally {
        setLoading(false);
      }
    };

    if (state.userId) {
      fetchCanjes();
    }
  }, [state.userId]);

  // Cargar estados de canje
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await axiosInstance.get<{ values: string[] }>('/enums/estado_canje');
        setEstados(response.data.values);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los estados de canje');
      }
    };

    fetchEstados();
  }, []);

  // Manejar cambio de estado de canje
  const handleChangeEstado = async () => {
    if (!canjeSeleccionado || !nuevoEstado) return;

    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.put(`/canjes/${canjeSeleccionado}`, { estado: nuevoEstado });

      if (response.status === 200) {
        // Actualizar el estado local de los canjes
        setCanjes((prevCanjes) =>
          prevCanjes.map((canje) =>
            canje.id_canje === canjeSeleccionado ? { ...canje, estado: nuevoEstado } : canje
          )
        );
        setCanjeSeleccionado(null);
        setNuevoEstado('');
      }
    } catch (err: any) {
      console.error(err);
      setError('Error al actualizar el estado del canje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.canjesContainer}>
      <h1>Lista de Canjes</h1>
      {loading && <p className={styles.loading}>Cargando...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && canjes.length === 0 && <p>No se encontraron canjes</p>}

      <table className={styles.canjesTable}>
        <thead>
          <tr>
            <th>Nombre Cliente</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Local</th>
            <th>Detalles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {canjes.map((canje) => (
            <tr key={canje.id_canje}>
              <td>{clientes[canje.id_cliente] || 'Cargando...'}</td>
              <td>{new Date(canje.fecha).toLocaleDateString()}</td>
              <td>{canje.estado}</td>
              <td>{canje.local.nombre_local}</td>
              <td>
                {canje.detalles.map((detalle) => (
                  <div key={detalle.id_detalle_canje}>
                    Producto: {detalle.producto.nombre}, Cantidad: {detalle.cantidad}, 
                    Puntos Totales: {detalle.puntos_totales}, Valor: {detalle.valor}
                  </div>
                ))}
              </td>
              <td>
                <button
                  className={styles.changeEstadoButton}
                  onClick={() => setCanjeSeleccionado(canje.id_canje)}
                >
                  Cambiar Estado
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {canjeSeleccionado && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Cambiar Estado</h2>
            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              className={styles.selectEstado}
            >
              <option value="">-- Selecciona un estado --</option>
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
                </option>
              ))}
            </select>
            <div className={styles.modalActions}>
              <button className={styles.confirmButton} onClick={handleChangeEstado}>
                Confirmar
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setCanjeSeleccionado(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canjes;
