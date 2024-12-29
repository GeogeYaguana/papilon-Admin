// src/pages/EditProduct/EditProduct.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase'; // Ajusta la ruta a tu config de Firebase
import { Product, ProductService, UpdateProductData } from '../services/ProductService';
import { Categoria, CategoriaService } from '../services/CategoriaService';
import { useAuth } from '../hooks/useAuth';
import styles from './EditProduct.module.css'; // Opcional: estilos con CSS Modules

const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  useAuth();
  const { id } = useParams<{ id: string }>(); // :id_producto en la ruta
  const id_producto = Number(id);

  // Estados para el producto
  const [product, setProduct] = useState<Product | null>(null);

  // Estados para edición
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [puntosNecesario, setPuntosNecesario] = useState<number | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [disponibilidad, setDisponibilidad] = useState<boolean>(true);
  const [descuento, setDescuento] = useState<string | null>(null);
  const [idCategoria, setIdCategoria] = useState<number | null>(null);

  // Categorías
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Estado de carga
  const [isLoading, setIsLoading] = useState(false);

  // Cargar el producto al montar
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await ProductService.getProductById(id_producto);
        setProduct(data);

        // Inicializar estados del formulario
        setNombre(data.nombre);
        setDescripcion(data.descripcion || '');
        setPrecio(data.precio);
        setPuntosNecesario(data.puntos_necesario);
        setDisponibilidad(data.disponibilidad);
        setDescuento(data.descuento);
        setIdCategoria(data.id_categoria); // Podría ser null
      } catch (error) {
        console.error(error);
        alert('Error al cargar el producto');
        navigate('/dashboard');
      }
    };

    fetchProduct();
  }, [id_producto, navigate]);

  // Cargar categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categoriasData = await CategoriaService.getCategorias();
        setCategorias(categoriasData);
      } catch (error) {
        console.error(error);
        alert('Error al obtener las categorías');
      }
    };
    fetchCategorias();
  }, []);

  // Manejo de cambio de imagen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFotoFile(e.target.files[0]);
    }
  };

  // Manejo de envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let fotoUrl: string | null = null;

      if (fotoFile) {
        // Subir nueva imagen a Firebase
        const storageRef = ref(storage, `productos/${Date.now()}_${fotoFile.name}`);
        await uploadBytes(storageRef, fotoFile);
        fotoUrl = await getDownloadURL(storageRef);
      }

      // Crear objeto con los campos a actualizar
      const updateData: UpdateProductData = {};

      // Solo enviar campos si han sido cambiados o si el usuario los ha editado
      if (nombre !== product?.nombre) updateData.nombre = nombre;
      if (descripcion !== product?.descripcion) updateData.descripcion = descripcion;
      if (precio !== product?.precio) updateData.precio = precio;
      if (puntosNecesario !== product?.puntos_necesario) updateData.puntos_necesario = puntosNecesario;
      if (disponibilidad !== product?.disponibilidad) updateData.disponibilidad = disponibilidad;
      if (descuento !== product?.descuento) updateData.descuento = descuento;
      if (idCategoria !== product?.id_categoria) updateData.id_categoria = idCategoria;

      // Si se subió una nueva imagen
      if (fotoUrl !== null) {
        updateData.foto_url = fotoUrl;
      }

      // Llamar al servicio para actualizar
      await ProductService.updateProduct(id_producto, updateData);

      alert('Producto actualizado exitosamente');
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('Error al actualizar el producto');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Si el producto aún no se ha cargado
  if (!product) {
    return <p>Cargando producto...</p>;
  }

  return (
    <div className={styles.editProductContainer}>
      <h1>Editar Producto</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="nombre">Nombre del Producto</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="precio">Precio</label>
          <input
            id="precio"
            type="number"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="puntos_necesario">Puntos Necesarios</label>
          <input
            id="puntos_necesario"
            type="number"
            value={puntosNecesario !== null ? puntosNecesario : ''}
            onChange={(e) => setPuntosNecesario(e.target.value ? parseInt(e.target.value) : null)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="descuento">Descuento (%)</label>
          <input
            id="descuento"
            type="number"
            step="0.01"
            value={descuento || ''}
            onChange={(e) => setDescuento(e.target.value ? e.target.value : null)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="disponibilidad">Disponibilidad</label>
          <select
            id="disponibilidad"
            value={disponibilidad ? 'true' : 'false'}
            onChange={(e) => setDisponibilidad(e.target.value === 'true')}
          >
            <option value="true">Disponible</option>
            <option value="false">No Disponible</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="categoria">Categoría</label>
          <select
            id="categoria"
            value={idCategoria !== null ? idCategoria : ''}
            onChange={(e) => setIdCategoria(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">-- Selecciona una categoría --</option>
            {categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Imagen Actual</label>
          {product.foto_url ? (
            <img src={product.foto_url} alt={product.nombre} className={styles.currentImage} />
          ) : (
            <p>No hay imagen</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="foto">Cambiar Foto</label>
          <input
            id="foto"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <p>(Si seleccionas un nuevo archivo, la imagen actual se reemplazará)</p>
        </div>

        <button type="submit" disabled={isLoading} className={styles.submitButton}>
          {isLoading ? 'Actualizando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
