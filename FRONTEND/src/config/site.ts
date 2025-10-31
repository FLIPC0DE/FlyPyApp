export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "PyFly",
  description: "Plataforma universitaria de cursos Python con playground interactivo y sistema de evaluación avanzado.",
  navItems: [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Cursos",
      href: "/courses",
    },
    {
      label: "Playground",
      href: "/playground",
    },
    {
      label: "Sobre Nosotros",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Mi Perfil",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Mis Cursos",
      href: "/my-courses",
    },
    {
      label: "Progreso",
      href: "/progress",
    },
    {
      label: "Checkpoints",
      href: "/checkpoints",
    },
    {
      label: "Analytics",
      href: "/analytics",
    },
    {
      label: "Configuración",
      href: "/settings",
    },
    {
      label: "Ayuda y Soporte",
      href: "/help",
    },
    {
      label: "Cerrar Sesión",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/tu-organizacion/pyfly",
    docs: "https://docs.pyfly.com",
    support: "mailto:soporte@pyfly.com",
  },
};