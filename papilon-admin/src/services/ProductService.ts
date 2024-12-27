// src/services/ProductService.ts

import axiosInstance from './axiosInstance';

/**
 * Interfaz que representa la estructura de tu Producto
 */
export interface Product {
  id_producto: number;
  id_categoria: number | null;
  id_local: number;
  nombre: string;
  descripcion: string | null;
  precio: string; // '100.50', por ejemplo
  puntos_necesario: number | null;
  foto_url: string | null;
  disponibilidad: boolean;
  descuento: string | null;
  fecha_creacion: string | null;
}

/**
 * Interfaz para la respuesta del endpoint de Local
 */
export interface LocalResponse {
  success: boolean;
  data: {
    id_local: number;
  };
}

export class ProductService {
  /**
   * Obtiene todos los productos de un usuario (tipo local)
   * GET /productos/usuario/:id_usuario
   */
  static async getProductsByUser(id_usuario: number): Promise<Product[]> {
    const response = await axiosInstance.get<Product[]>(`/productos/usuario/${id_usuario}`);
    return response.data;
  }

  /**
   * Obtiene el id_local asociado a un id_usuario
   * GET /locales/usuario/:id_usuario
   */
  static async getLocalByUser(id_usuario: number): Promise<number> {
    const response = await axiosInstance.get<LocalResponse>(`/locales/usuario/${id_usuario}`);
    if (response.data.success && response.data.data.id_local) {
      return response.data.data.id_local;
    } else {
      throw new Error('No se pudo obtener el id_local del usuario');
    }
  }

  /**
   * Crea un nuevo producto
   * POST /productos
   */
  static async createProduct(productData: Omit<Product, 'id_producto'>): Promise<Product> {
    const response = await axiosInstance.post<Product>('/producto', productData);
    return response.data;
  }

  /**
   * Actualiza un producto
   * PUT /productos/:id_producto
   */
  static async updateProduct(id_producto: number, productData: Partial<Product>): Promise<Product> {
    const response = await axiosInstance.put<Product>(`/productos/${id_producto}`, productData);
    return response.data;
  }

  /**
   * Elimina un producto
   * DELETE /productos/:id_producto
   */
  static async deleteProduct(id_producto: number): Promise<void> {
    await axiosInstance.delete(`/producto/${id_producto}`);
  }
}
