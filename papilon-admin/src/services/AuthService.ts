// src/services/AuthService.ts

import axiosInstance from './axiosInstance';

interface LoginResponse {
  message: string;
  token: string;
  id_usuario: number;
  tipo_usuario: string;
}

export class AuthService {
  /**
   * Realiza una solicitud de inicio de sesión al backend
   * @param usuario_nombre Nombre de usuario
   * @param password Contraseña
   * @returns Promesa que resuelve en los datos de autenticación si es exitoso
   */
  static async login(usuario_nombre: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post<LoginResponse>('/login', {
        usuario_nombre,
        password,
      });

      // Guardar el token y otros datos en el almacenamiento local
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('id_usuario', response.data.id_usuario.toString());
      localStorage.setItem('tipo_usuario', response.data.tipo_usuario);

      return response.data;
    } catch (error: any) {
      // Manejar errores y lanzar un mensaje apropiado
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Error al conectar con el servidor');
      }
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  static logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('tipo_usuario');
    console.log('Sesión cerrada');
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns true si está autenticado, false en caso contrario
   */
  static isAuthenticated(): boolean {
    return localStorage.getItem('authToken') !== null;
  }

  /**
   * Obtiene el token de autenticación
   * @returns Token o null si no existe
   */
  static getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Obtiene el ID del usuario
   * @returns ID del usuario o null si no existe
   */
  static getUserId(): number | null {
    const id = localStorage.getItem('id_usuario');
    return id ? parseInt(id, 10) : null;
  }

  /**
   * Obtiene el tipo de usuario
   * @returns Tipo de usuario o null si no existe
   */
  static getUserType(): string | null {
    return localStorage.getItem('tipo_usuario');
  }
}
