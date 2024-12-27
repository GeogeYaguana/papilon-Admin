// src/services/CategoriaService.ts

export interface Categoria {
    id_categoria: number;
    nombre: string;
    descripcion: string | null;
    url_img: string | null;
  }
// src/services/CategoriaService.ts

// src/services/CategoriaService.ts

import axiosInstance from './axiosInstance';

/**
 * Interfaz que representa la estructura de una Categoría
 */
export interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string | null;
  url_img: string | null;
}

export class CategoriaService {
  /**
   * Obtiene todas las categorías
   * GET /categorias
   */
  static async getCategorias(): Promise<Categoria[]> {
    const response = await axiosInstance.get<Categoria[]>('/categorias');
    return response.data;
  }

  /**
   * Crea una nueva categoría
   * POST /categoria
   */
  static async createCategoria(categoriaData: Omit<Categoria, 'id_categoria'>): Promise<Categoria> {
    const response = await axiosInstance.post<Categoria>('/categoria', categoriaData);
    return response.data;
  }

  /**
   * Obtiene una categoría por su ID
   * GET /categoria/:id_categoria
   */
  static async getCategoria(id_categoria: number): Promise<Categoria> {
    const response = await axiosInstance.get<Categoria>(`/categoria/${id_categoria}`);
    return response.data;
  }

  /**
   * Actualiza una categoría
   * PUT /categoria/:id_categoria
   */
  static async updateCategoria(id_categoria: number, categoriaData: Partial<Categoria>): Promise<Categoria> {
    const response = await axiosInstance.put<Categoria>(`/categoria/${id_categoria}`, categoriaData);
    return response.data;
  }

  /**
   * Elimina una categoría
   * DELETE /categoria/:id_categoria
   */
  static async deleteCategoria(id_categoria: number): Promise<void> {
    await axiosInstance.delete(`/categoria/${id_categoria}`);
  }
}

  