import { apiRoutes } from "@/lib/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  codigoVerificacion: string;
  id_rol?: number;
}

export interface AuthResponse {
  token: string;
  user: {
    id_usuario: number;
    nombre: string;
    email: string;
    rol_global?: string;
    id_rol?: number;
  };
  needsRole?: boolean;
  redirectTo?: string;
}

/**
 * Servicio para operaciones de autenticación
 * Separation of Concerns: Toda la lógica de API relacionada con auth
 */
export class AuthService {
  private static getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
    };
  }

  /**
   * Inicia sesión con email y contraseña
   */
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(apiRoutes.auth.login, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al iniciar sesión");
    }

    return response.json();
  }

  /**
   * Registra un nuevo usuario
   */
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(apiRoutes.auth.register, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al registrar usuario");
    }

    return response.json();
  }

  /**
   * Cierra sesión
   */
  static async logout(): Promise<void> {
    const token = localStorage.getItem("token");
    
    if (!token) return;

    try {
      await fetch(apiRoutes.auth.logout, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor:", error);
    } finally {
      localStorage.removeItem("token");
    }
  }

  /**
   * Valida si un token es válido
   */
  static async validarToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(apiRoutes.usuarios.perfil, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}

