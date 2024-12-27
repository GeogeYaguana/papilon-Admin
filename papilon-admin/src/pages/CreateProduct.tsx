// src/pages/CreateProduct/CreateProduct.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { ProductService,Product } from '../services/ProductService';
import { Categoria,CategoriaService } from '../services/CategoriaService';
import { useAuth } from '../hooks/useAuth';
import styles from './CreateProduct.module.css'; // Opcional: estilos CSS Module

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth(); // Obtener el estado de AuthContext

  const [idLocal, setIdLocal] = useState<number | null>(null);

  // Estados para cada campo del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [puntosNecesario, setPuntosNecesario] = useState<number | null>(null);
  const [descuento, setDescuento] = useState<string | null>(null);
  const [disponibilidad, setDisponibilidad] = useState<boolean>(true);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [idCategoria, setIdCategoria] = useState<number | null>(null);

  // Estado para categorías
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Para manejar el estado de carga
  const [isLoading, setIsLoading] = useState(false);

  // Obtener id_local al montar el componente
  useEffect(() => {
    const fetchLocal = async () => {
      if (state.userId) {
        try {
          const localId = await ProductService.getLocalByUser(state.userId);
          setIdLocal(localId);
        } catch (error) {
          console.error(error);
          alert('Error al obtener el local asociado al usuario');
          navigate('/dashboard'); // Redirigir si no hay local
        }
      }
    };
    fetchLocal();
  }, [state.userId, navigate]);

  // Obtener categorías al montar el componente
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

  // Manejo del campo de imagen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFotoFile(e.target.files[0]);
    }
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (idLocal === null) {
      alert('No se ha podido obtener el local. Intenta de nuevo.');
      return;
    }

    if (idCategoria === null) {
      alert('Por favor, selecciona una categoría');
      return;
    }

    setIsLoading(true);

    try {
      let fotoUrl = '';

      // 1. Subir imagen a Firebase (si el usuario seleccionó una)
      if (fotoFile) {
        const storageRef = ref(storage, `productos/${Date.now()}_${fotoFile.name}`);
        await uploadBytes(storageRef, fotoFile);
        fotoUrl = await getDownloadURL(storageRef);
      }

      // 2. Preparar la data para crear el producto
      const newProductData: Omit<Product, 'id_producto'> = {
        id_categoria: idCategoria, // Usar el id_categoria seleccionado
        id_local: idLocal,         // Usar el id_local obtenido
        nombre,
        descripcion,
        precio,                    // Llega como string, tu backend lo parsea
        puntos_necesario: puntosNecesario,
        foto_url: fotoUrl || null,
        disponibilidad,
        descuento,
        fecha_creacion: null,      // El backend lo genera
      };

      // 3. Llamar a tu servicio para crear el producto
      await ProductService.createProduct(newProductData);

      alert('Producto creado exitosamente');
      // 4. Redirigir al dashboard u otra ruta
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Error al crear producto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.createProductContainer}>
      <h1>Crear Producto</h1>
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
            required
          >
            <option value="">-- Selecciona una categoría --</option>
            {categorias.map((categoria) => (
              <option key={categoria.id_categoria} value={categoria.id_categoria}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="foto">Foto del Producto</label>
          <input
            id="foto"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" disabled={isLoading} className={styles.submitButton}>
          {isLoading ? 'Creando...' : 'Crear Producto'}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
