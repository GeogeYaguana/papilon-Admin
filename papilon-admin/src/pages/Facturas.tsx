import React, { useState, useEffect } from 'react';
import { FacturaService, Factura } from '../services/FacturaService';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../services/axiosInstance';
import styles from './Facturas.module.css';

const Facturas: React.FC = () => {
  const { state } = useAuth(); // Obtener el ID del usuario del contexto
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [estados, setEstados] = useState<string[]>([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<number | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<string>('');

  // Cargar facturas al montar
  useEffect(() => {
    const fetchFacturas = async () => {
      setLoading(true);
      setError('');
      try {
        const facturasData = await FacturaService.getFacturasByUsuario(state.userId || 1);
        setFacturas(facturasData);
      } catch (err: any) {
        console.error(err);
        setError('Error al cargar las facturas');
      } finally {
        setLoading(false);
      }
    };

    if (state.userId) {
      fetchFacturas();
    }
  }, [state.userId]);

  // Cargar los estados de factura
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await axiosInstance.get<{ values: string[] }>('/enums/estado_factura');
        setEstados(response.data.values);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los estados de factura');
      }
    };
    fetchEstados();
  }, []);

  // Manejar cambio de estado de factura
  const handleChangeEstado = async () => {
    if (!facturaSeleccionada || !nuevoEstado) return;

    setLoading(true);
    setError('');

    try {

      // Actualizar el estado local de las facturas con la factura actualizada
      setFacturas((prevFacturas) =>
        prevFacturas.map((factura) =>
          factura.id_factura === facturaSeleccionada
            ? { ...factura, estado: nuevoEstado } // Actualiza solo el estado de la factura correspondiente
            : factura
        )
      );

      // Reinicia las variables de selección
      setFacturaSeleccionada(null);
      setNuevoEstado('');
    } catch (err: any) {
      console.error(err);
      setError('Error al actualizar el estado de la factura');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.facturasContainer}>
      <h1>Lista de Facturas</h1>
      {loading && <p className={styles.loading}>Cargando...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && facturas.length === 0 && <p>No se encontraron facturas</p>}

      <table className={styles.facturasTable}>
        <thead>
          <tr>
            <th>ID Factura</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura) => (
            <tr key={factura.id_factura}>
              <td>{factura.id_factura}</td>
              <td>${factura.total}</td>
              <td>{factura.estado}</td>
              <td>
                <button
                  className={styles.changeEstadoButton}
                  onClick={() => setFacturaSeleccionada(factura.id_factura)}
                >
                  Cambiar Estado
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para cambiar estado */}
      {facturaSeleccionada && (
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
                onClick={() => setFacturaSeleccionada(null)}
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

export default Facturas;
