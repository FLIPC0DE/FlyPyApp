const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const apiRoutes = {
  auth: {
    login: `${BASE_URL}/api/auth/login`,
    register: `${BASE_URL}/api/auth/register`,
    logout: `${BASE_URL}/api/auth/logout`,
    recuperar: `${BASE_URL}/api/auth/recuperar`,
    validarRecuperacion: `${BASE_URL}/api/auth/recuperar/validar`,
    cambiarPassword: `${BASE_URL}/api/auth/recuperar/cambiar`,
  },
  verificacion: {
    enviar: `${BASE_URL}/api/verificacion/enviar`,
    validar: `${BASE_URL}/api/verificacion/validar`,
  },
  usuarios: {
    perfil: `${BASE_URL}/api/usuarios/perfil`,
    actualizarPerfil: `${BASE_URL}/api/usuarios/perfil`,
    actualizarPassword: `${BASE_URL}/api/usuarios/password`,
    dashboard: `${BASE_URL}/api/usuarios/dashboard`,
    rol: `${BASE_URL}/api/usuarios/rol`,
  },
  oauth: {
    google: `${BASE_URL}/api/oauth/google`,
    microsoft: `${BASE_URL}/api/oauth/microsoft`,
    github: `${BASE_URL}/api/oauth/github`,
  },
};
