// FRONTEND/src/types/curso.ts
export interface Curso {
  id_curso: number;
  titulo_curso: string;
  descripcion: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  slug: string;
  creador: {
    id_usuario: number;
    nombre: string;
    email: string;
    perfil?: {
      avatar_url?: string;
    };
  };
}
