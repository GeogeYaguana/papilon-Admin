// src/pages/Dashboard/Dashboard.tsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthService } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { ProductService, Product } from '../services/ProductService';
import ProductCard from '../components/ProductCard/ProductCard';
import axiosInstance from '../services/axiosInstance';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout, state } = useAuth(); // Asumiendo que obtienes userId de state.userId
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>('');
  const [, setFacturas] = useState<any[]>([]);

  // 1. Cargar productos para este usuario local
  useEffect(() => {
    if (state.userId) {
      ProductService.getProductsByUser(state.userId)
        .then((response) => {
          setProducts(response);
        })
        .catch((err) => {
          console.error(err);
          setError('Error al obtener productos');
        });
    }
  }, [state.userId]);

  // 2. Manejar cierre de sesión
  const handleLogout = () => {
    AuthService.logout();
    logout(); // Si estás usando un AuthContext
    navigate('/login'); // Redirigir a login
  };

  // 3. Manejar creación de nuevo producto
  const handleCreateProduct = () => {
    navigate('/create-product');
    // o abrir un modal, dependiendo de tu diseño
  };

  // 4. Manejar edición de producto
  const handleEditProduct = (product: Product) => {
    // Ejemplo: redirigir a /edit-product/[id_producto]
    navigate(`/edit-product/${product.id_producto}`);
  };

  // 5. Manejar eliminación de producto
  const handleDeleteProduct = async (id_producto: number) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar este producto?');
    if (!confirmar) return;

    try {
      await ProductService.deleteProduct(id_producto);
      // Actualizar el estado local para quitar ese producto
      setProducts((prev) => prev.filter((p) => p.id_producto !== id_producto));
    } catch (err) {
      console.error(err);
      alert('Error al eliminar el producto');
    }
  };

  // 6. Manejar ver canjes
  const handleViewCanjes = () => {
    navigate('/canjes');
  };

  // 7. Manejar registrar factura
  const handleRegisterFactura = () => {
    navigate('/registrar-factura');
  };

  // 8. Manejar ver facturas
  const handleViewFacturas = async () => {
    try {
      const response = await axiosInstance.get(`/facturas/usuario/${state.userId}`);
      setFacturas(response.data.facturas);
      navigate('/facturas', { state: { facturas: response.data.facturas } });
    } catch (err: any) {
      console.error(err);
      alert(
        err.response?.data?.error ||
          'Error al obtener facturas para este usuario'
      );
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>Bienvenido al Dashboard</h1>
        <div className={styles.actions}>
          <button className={styles.createButton} onClick={handleCreateProduct}>
            Crear Producto
          </button>
          <button className={styles.viewCanjesButton} onClick={handleViewCanjes}>
            Ver Canjes
          </button>
          <button
            className={styles.registerFacturaButton}
            onClick={handleRegisterFactura}
          >
            Registrar Factura
          </button>
          <button
            className={styles.viewFacturasButton}
            onClick={handleViewFacturas}
          >
            Ver Facturas
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.productGrid}>
        {products.map((product) => (
          <ProductCard
            key={product.id_producto}
            product={product}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
