/**
 * Configuración centralizada de roles y permisos
 * Facilita el mantenimiento y evita hardcodeo de roles en múltiples lugares
 */

export const ROLES = {
  ADMINISTRADOR: "ADMINISTRADOR",
  ADMIN_AYUDANTE: "ADMIN_AYUDANTE",
  DOCENTE_EJECUTOR: "DOCENTE_EJECUTOR",
  DOCENTE_EDITOR: "DOCENTE_EDITOR",
  ESTUDIANTE: "ESTUDIANTE",
} as const;

export type RolTipo = typeof ROLES[keyof typeof ROLES];

/**
 * Permisos por rol para diferentes acciones
 */
export const PERMISOS_POR_ROL = {
  [ROLES.ADMINISTRADOR]: {
    puedeCrearCurso: true,
    puedeEditarCurso: true,
    puedeEliminarCurso: true,
    puedeVerTodosLosCursos: true,
    puedeGestionarUsuarios: true,
    puedeVerAnalytics: true,
    puedeModerarComentarios: true,
  },
  [ROLES.ADMIN_AYUDANTE]: {
    puedeCrearCurso: true,
    puedeEditarCurso: true,
    puedeEliminarCurso: false,
    puedeVerTodosLosCursos: true,
    puedeGestionarUsuarios: true,
    puedeVerAnalytics: true,
    puedeModerarComentarios: true,
  },
  [ROLES.DOCENTE_EJECUTOR]: {
    puedeCrearCurso: true,
    puedeEditarCurso: true,
    puedeEliminarCurso: false,
    puedeVerTodosLosCursos: false,
    puedeGestionarUsuarios: false,
    puedeVerAnalytics: true,
    puedeModerarComentarios: false,
  },
  [ROLES.DOCENTE_EDITOR]: {
    puedeCrearCurso: false,
    puedeEditarCurso: true,
    puedeEliminarCurso: false,
    puedeVerTodosLosCursos: false,
    puedeGestionarUsuarios: false,
    puedeVerAnalytics: false,
    puedeModerarComentarios: false,
  },
  [ROLES.ESTUDIANTE]: {
    puedeCrearCurso: false,
    puedeEditarCurso: false,
    puedeEliminarCurso: false,
    puedeVerTodosLosCursos: false,
    puedeGestionarUsuarios: false,
    puedeVerAnalytics: false,
    puedeModerarComentarios: false,
  },
} as const;

/**
 * Roles que pueden acceder a cada ruta
 */
export const RUTAS_POR_ROL = {
  "/my-courses": [
    ROLES.ESTUDIANTE,
    ROLES.DOCENTE_EJECUTOR,
    ROLES.DOCENTE_EDITOR,
    ROLES.ADMIN_AYUDANTE,
    ROLES.ADMINISTRADOR,
  ],
  "/progress": [ROLES.ESTUDIANTE],
  "/checkpoints": [ROLES.ESTUDIANTE, ROLES.DOCENTE_EJECUTOR],
  "/analytics": [ROLES.DOCENTE_EJECUTOR, ROLES.ADMINISTRADOR],
  "/dashboard": [
    ROLES.ESTUDIANTE,
    ROLES.DOCENTE_EJECUTOR,
    ROLES.DOCENTE_EDITOR,
    ROLES.ADMIN_AYUDANTE,
    ROLES.ADMINISTRADOR,
  ],
} as const;

/**
 * Helper para verificar si un rol tiene un permiso específico
 */
export function tienePermiso(rol: RolTipo | undefined, permiso: keyof typeof PERMISOS_POR_ROL[typeof ROLES.ADMINISTRADOR]): boolean {
  if (!rol || !(rol in PERMISOS_POR_ROL)) return false;
  return PERMISOS_POR_ROL[rol as RolTipo][permiso] ?? false;
}

/**
 * Helper para obtener roles permitidos para una ruta
 */
export function obtenerRolesPermitidos(ruta: keyof typeof RUTAS_POR_ROL): RolTipo[] {
  // `RUTAS_POR_ROL` está declarado con `as const` por lo que sus arreglos son `readonly`.
  // Retornamos una copia mutable para evitar errores al asignarlo a `RolTipo[]` en call-sites.
  return [...(RUTAS_POR_ROL[ruta] ?? [])] as RolTipo[];
}

