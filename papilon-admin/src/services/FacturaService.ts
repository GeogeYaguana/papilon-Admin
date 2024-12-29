// src/services/FacturaService.ts

import axiosInstance from './axiosInstance';

export interface DetalleFactura {
  id_producto: number;
  precio_unitario: number;
  cantidad: number;
}

export interface Factura {
  id_factura: number;
  id_cliente: number;
  id_local: number;
  estado: string;
  total: number;
  detalle_facturas: DetalleFactura[];
}

export interface CreateFacturaData {
  id_cliente: number;
  estado: string;
  total: number;
  id_usuario_local: number, // Incluye el ID del usuario local
  detalle_facturas: Omit<DetalleFactura, 'subtotal'>[]; // 'subtotal' se calcula en el backend
}

export class FacturaService {
  /**
   * Crea una nueva factura con sus detalles
   * POST /facturas
   */
  static async createFacturaWithDetalle(data: CreateFacturaData): Promise<Factura> {
    const response = await axiosInstance.post<{
      message: string;
      factura: Factura;
    }>('/facturas', data);
    return response.data.factura;
  }

  /**
   * Obtiene todas las facturas asociadas a un local
   * GET /facturas/local/:id_local
   */
  static async getFacturasByLocal(id_local: number): Promise<Factura[]> {
    const response = await axiosInstance.get<Factura[]>(`/facturas/local/${id_local}`);
    return response.data;
  }
  static async getFacturasByUsuario(id_usuario: number): Promise<Factura[]> {
    const response = await axiosInstance.get<{ facturas: Factura[] }>(`/facturas/usuario/${id_usuario}`);
    return response.data.facturas;
  }
   static async updateFacturaEstado(id_factura: number, estado: string): Promise<Factura> {
    const response = await axiosInstance.put<Factura>(`/facturas/${id_factura}`, {
      estado,
      total: null,
      puntos_ganados: null,
    });
    return response.data;
  }

  /**
   * Actualiza una factura existente
   * PUT /facturas/:id_factura
   */
  static async updateFactura(id_factura: number, data: Partial<Factura>): Promise<Factura> {
    const response = await axiosInstance.put<Factura>(`/facturas/${id_factura}`, data);
    return response.data;
  }

  /**
   * Elimina una factura
   * DELETE /facturas/:id_factura
   */
  static async deleteFactura(id_factura: number): Promise<void> {
    await axiosInstance.delete(`/facturas/${id_factura}`);
  }
}
