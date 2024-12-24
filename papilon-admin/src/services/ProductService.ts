import axios from 'axios';

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

export class ProductService {
  static async getProductsByUser(id_usuario: number): Promise<Product[]> {
    const response = await axios.get<Product[]>(`http://localhost:5000/productos/usuario/${id_usuario}`);
    return response.data;
  }

  static async createProduct(productData: Omit<Product, 'id_producto'>): Promise<Product> {
    const response = await axios.post<Product>(
      'http://localhost:5000/productos',
      productData
    );
    return response.data;
  }

  static async updateProduct(id_producto: number, productData: Partial<Product>): Promise<Product> {
    const response = await axios.put<Product>(
      `http://localhost:5000/productos/${id_producto}`,
      productData
    );
    return response.data;
  }

  static async deleteProduct(id_producto: number): Promise<void> {
    await axios.delete(`http://localhost:5000/productos/${id_producto}`);
  }
}
