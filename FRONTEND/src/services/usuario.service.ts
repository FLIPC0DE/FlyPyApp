import { apiRoutes } from "@/lib/api";

export interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  rol_global?: string;
  id_rol?: number;
  avatar_url?: string;
}

export interface ActualizarRolRequest {
  rol_global: string;
}

export interface ActualizarRolResponse {
  user: Usuario;
  token: string;
}

/**
 * Servicio para operaciones de usuario
 * Separation of Concerns: Toda la lógica de API relacionada con usuarios
 */
export class UsuarioService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Obtiene el perfil del usuario autenticado
   */
  static async obtenerPerfil(): Promise<Usuario> {
    const response = await fetch(apiRoutes.usuarios.perfil, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Token inválido o expirado");
      }
      throw new Error("Error al obtener perfil");
    }

    return response.json();
  }

  /**
   * Actualiza el rol del usuario autenticado
   */
  static async actualizarRol(rol: string): Promise<ActualizarRolResponse> {
    const response = await fetch(apiRoutes.usuarios.rol, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ rol_global: rol }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Token inválido o expirado");
      }
      const error = await response.json();
      throw new Error(error.error || "Error al actualizar rol");
    }

    return response.json();
  }

  /**
   * Actualiza el perfil del usuario
   */
  static async actualizarPerfil(data: {
    nombre?: string;
    institucion?: string;
    carrera?: string;
  }): Promise<{ success: boolean }> {
    const response = await fetch(apiRoutes.usuarios.actualizarPerfil, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Token inválido o expirado");
      }
      throw new Error("Error al actualizar perfil");
    }

    return response.json();
  }

  /**
   * Obtiene el dashboard del usuario según su rol
   */
  static async obtenerDashboard(): Promise<any> {
    const response = await fetch(apiRoutes.usuarios.dashboard, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Token inválido o expirado");
      }
      throw new Error("Error al obtener dashboard");
    }

    return response.json();
  }

  /**
   * Obtiene el perfil completo con estadísticas según el rol
   */
  static async obtenerPerfilCompleto(): Promise<any> {
    const response = await fetch(apiRoutes.usuarios.perfilCompleto, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Token inválido o expirado");
      }
      throw new Error("Error al obtener perfil completo");
    }

    return response.json();
  }
}

