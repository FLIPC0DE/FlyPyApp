export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "FlyPy",
  description: "Plataforma universitaria de cursos Python con playground interactivo y sistema de evaluación avanzado.",
  navItems: [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Cursos",
      href: "/cursos",
    },
    {
      label: "Playground",
      href: "/playground",
    },
    {
      label: "Sobre Nosotros",
      href: "/sobre-nosotros",
    },
  ],
  navMenuItems: [
    {
      label: "Mi Perfil",
      href: "/perfil",
    },
    {
      label: "Dashboard",
      href: "/panel-de-control",
    },
    {
      label: "Mis Cursos",
      href: "/mis-cursos",
    },
    {
      label: "Progreso",
      href: "/progreso",
    },
    {
      label: "Checkpoints",
      href: "/checkpoints",
    },
    {
      label: "Analytics",
      href: "/analitica",
    },
    {
      label: "Configuración",
      href: "/configuracion",
    },
    {
      label: "Ayuda y Soporte",
      href: "/ayuda",
    },
    {
      label: "Cerrar Sesión",
      href: "/cerrar-sesion",
    },
  ],
  links: {
    github: "https://github.com/FLIPC0DE/FlyPyApp",
    docs: "https://docs.pyfly.com",
    support: "mailto:soporte@pyfly.com",
  },
};