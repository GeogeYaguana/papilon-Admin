import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FacturaService, CreateFacturaData } from '../services/FacturaService';
import { ProductService, Product } from '../services/ProductService';
import styles from './RegistrarFactura.module.css';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../services/axiosInstance';

const RegistrarFactura: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const idUsuarioLocal = state.userId; // Usuario local autenticado

  // Estados para la factura
  const [idCliente, setIdCliente] = useState<number | ''>('');
  const [estado, setEstado] = useState<string>('');
  const [detalles, setDetalles] = useState<DetalleFacturaInput[]>([
    { id_producto: '', precio_unitario: 0, cantidad: 1 },
  ]);

  // Lista de productos y estados posibles
  const [productos, setProductos] = useState<Product[]>([]);
  const [estadosFactura, setEstadosFactura] = useState<string[]>([]);

  // Estados para manejo de errores y éxito
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Tipos
  interface DetalleFacturaInput {
    id_producto: number | '';
    precio_unitario: number;
    cantidad: number;
  }

  // Calcular total dinámicamente
  const total = detalles.reduce(
    (acc, detalle) => acc + detalle.precio_unitario * detalle.cantidad,
    0
  );

  // Cargar productos y estados al montar
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [productosData, estadosResponse] = await Promise.all([
          ProductService.getProductsByUser(idUsuarioLocal || 1),
          axiosInstance.get('/enums/estado_factura'),
        ]);
        setProductos(productosData);
        setEstadosFactura(estadosResponse.data.values);
      } catch (err) {
        console.error(err);
        setError('Error al cargar productos o estados');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idUsuarioLocal]);

  // Manejar cambios en los detalles
  const handleDetalleChange = (
    index: number,
    field: keyof DetalleFacturaInput,
    value: any
  ) => {
    const updatedDetalles = [...detalles];
    updatedDetalles[index][field] = value;

    if (field === 'id_producto') {
      const producto = productos.find((p) => p.id_producto === Number(value));
      updatedDetalles[index].precio_unitario = producto
        ? parseFloat(producto.precio)
        : 0;
    }

    setDetalles(updatedDetalles);
  };

  const addDetalle = () => {
    setDetalles([
      ...detalles,
      { id_producto: '', precio_unitario: 0, cantidad: 1 },
    ]);
  };

  const removeDetalle = (index: number) => {
    const updatedDetalles = [...detalles];
    updatedDetalles.splice(index, 1);
    setDetalles(updatedDetalles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!idCliente) {
      setError('Por favor, ingresa el ID del cliente');
      return;
    }

    if (!estado.trim()) {
      setError('Por favor, selecciona el estado de la factura');
      return;
    }

    if (detalles.length === 0) {
      setError('La factura debe tener al menos un detalle');
      return;
    }

    for (let detalle of detalles) {
      if (!detalle.id_producto) {
        setError('Por favor, selecciona un producto en todos los detalles');
        return;
      }
      if (detalle.cantidad <= 0) {
        setError('La cantidad debe ser al menos 1');
        return;
      }
    }

    const detalle_facturas = detalles.map((detalle) => ({
      id_producto: Number(detalle.id_producto),
      precio_unitario: detalle.precio_unitario,
      cantidad: detalle.cantidad
    }));

    const facturaData: CreateFacturaData = {
      id_cliente: Number(idCliente),
      id_usuario_local: Number(idUsuarioLocal),
      estado: estado.trim(),
      total,
      detalle_facturas,
    };

    try {
      await FacturaService.createFacturaWithDetalle(facturaData);
      setSuccess('Factura registrada exitosamente');
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err.response?.data);
      setError(err.response?.data?.error || 'Error al registrar la factura');
    }
};


  return (
    <div className={styles.registrarFacturaContainer}>
      <h1>Registrar Factura</h1>
      {loading && <p className={styles.loading}>Cargando...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="cliente">ID del Cliente</label>
          <input
            id="cliente"
            type="number"
            value={idCliente}
            onChange={(e) => setIdCliente(e.target.value ? Number(e.target.value) : '')}
            placeholder="Ingresa el ID del cliente"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
          >
            <option value="">-- Selecciona un estado --</option>
            {estadosFactura.map((estado) => (
              <option key={estado} value={estado}>
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.detallesContainer}>
          <h2>Detalles de Factura</h2>
          {detalles.map((detalle, index) => (
            <div key={index} className={styles.detalleRow}>
              <div className={styles.formGroup}>
                <label htmlFor={`producto-${index}`}>Producto</label>
                <select
                  id={`producto-${index}`}
                  value={detalle.id_producto}
                  onChange={(e) =>
                    handleDetalleChange(index, 'id_producto', e.target.value)
                  }
                  required
                >
                  <option value="">-- Selecciona un producto --</option>
                  {productos.map((producto) => (
                    <option key={producto.id_producto} value={producto.id_producto}>
                      {producto.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor={`cantidad-${index}`}>Cantidad</label>
                <input
                  type="number"
                  id={`cantidad-${index}`}
                  value={detalle.cantidad}
                  onChange={(e) =>
                    handleDetalleChange(index, 'cantidad', Number(e.target.value))
                  }
                  min="1"
                  required
                />
              </div>
              {detalles.length > 1 && (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeDetalle(index)}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button type="button" className={styles.addButton} onClick={addDetalle}>
            Añadir Detalle
          </button>
        </div>
        <div className={styles.totalContainer}>
          <h3>Total: ${total.toFixed(2)}</h3>
        </div>
        <button type="submit" className={styles.submitButton}>
          Registrar Factura
        </button>
      </form>
    </div>
  );
};

export default RegistrarFactura;
