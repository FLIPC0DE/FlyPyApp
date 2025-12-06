import { apiRoutes } from "@/lib/api";

export interface EstadoInscripcion {
  inscrito: boolean;
  estado: string | null;
  progress?: number;
  fecha_inscripcion?: string;
}

export interface InscripcionResponse {
  message: string;
  inscripcion: any;
  esReinscripcion?: boolean;
}

/**
 * Servicio para operaciones de inscripción
 * Separation of Concerns: Toda la lógica de API relacionada con inscripciones
 */
export class InscripcionService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Inscribir o reinscribir a un curso
   */
  static async inscribirACurso(idCurso: number): Promise<InscripcionResponse> {
    const response = await fetch(apiRoutes.inscripciones.inscribir, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ id_curso: idCurso }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Token inválido o expirado");
      }
      const error = await response.json();
      throw new Error(error.error || "Error al inscribirse al curso");
    }

    return response.json();
  }

  /**
   * Obtener cursos en los que el usuario está inscrito
   */
  static async obtenerCursosInscritos(): Promise<any[]> {
    const response = await fetch(apiRoutes.inscripciones.misCursos, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Token inválido o expirado");
      }
      throw new Error("Error al obtener cursos inscritos");
    }

    return response.json();
  }

  /**
   * Obtener el estado de inscripción en un curso específico
   */
  static async obtenerEstadoInscripcion(idCurso: number): Promise<EstadoInscripcion> {
    const response = await fetch(apiRoutes.inscripciones.estado(idCurso), {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Token inválido o expirado");
      }
      // Si no hay inscripción, retornar estado por defecto
      return { inscrito: false, estado: null };
    }

    return response.json();
  }

  /**
   * Cancelar inscripción a un curso
   */
  static async cancelarInscripcion(idCurso: number): Promise<{ message: string }> {
    const response = await fetch(apiRoutes.inscripciones.cancelar, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ id_curso: idCurso }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Token inválido o expirado");
      }
      const error = await response.json();
      throw new Error(error.error || "Error al cancelar inscripción");
    }

    return response.json();
  }
}

