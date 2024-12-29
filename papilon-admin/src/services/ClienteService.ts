// src/services/ClienteService.ts

import axiosInstance from './axiosInstance';

export interface Cliente {
  id_cliente: number;
  nombre: string;
  // Añade más campos según tu modelo de Cliente
}

export class ClienteService {
  /**
   * Obtiene todos los clientes
   * GET /clientes
   */
  static async getClientes(): Promise<Cliente[]> {
    const response = await axiosInstance.get<Cliente[]>('/clientes');
    return response.data;
  }

  /**
   * Obtiene un cliente por su ID
   * GET /clientes/:id_cliente
   */
  static async getClienteById(id_cliente: number): Promise<Cliente> {
    const response = await axiosInstance.get<Cliente>(`/clientes/${id_cliente}`);
    return response.data;
  }

  /**
   * Crea un nuevo cliente
   * POST /clientes
   */
  static async createCliente(data: Omit<Cliente, 'id_cliente'>): Promise<Cliente> {
    const response = await axiosInstance.post<Cliente>('/clientes', data);
    return response.data;
  }

  /**
   * Actualiza un cliente existente
   * PUT /clientes/:id_cliente
   */
  static async updateCliente(id_cliente: number, data: Partial<Cliente>): Promise<Cliente> {
    const response = await axiosInstance.put<Cliente>(`/clientes/${id_cliente}`, data);
    return response.data;
  }

  /**
   * Elimina un cliente
   * DELETE /clientes/:id_cliente
   */
  static async deleteCliente(id_cliente: number): Promise<void> {
    await axiosInstance.delete(`/clientes/${id_cliente}`);
  }
  /**
 * Obtiene el nombre de un cliente por su ID
 * GET /clientes/:id_cliente/nombre
 */
static async getClienteNombre(id_cliente: number): Promise<string> {
  const response = await axiosInstance.get<{ nombre: string }>(`/clientes/${id_cliente}/nombre`);
  return response.data.nombre;
}

}
