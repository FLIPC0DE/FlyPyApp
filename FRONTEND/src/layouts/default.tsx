import { Link } from "@heroui/link";
import { Navbar } from "@/components/navbar";
import { useContext, useEffect } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import {
  AutenticacionContexto,
  DecodedToken,
} from "@/context/autenticacionContexto";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser } = useContext(AutenticacionContexto)!;
  const location = useLocation();

  // Decodificar token si existe
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser(decoded);
      } catch (err) {
        console.error("Token inválido:", err);
      }
    }
  }, [user, setUser]);

  // Toasts de bienvenida / logout
  useEffect(() => {
    const welcome = sessionStorage.getItem("showWelcomeToast");
    if (welcome) {
      sessionStorage.removeItem("showWelcomeToast");
    }

    const logout = sessionStorage.getItem("showLogoutToast");
    if (logout) {
      sessionStorage.removeItem("showLogoutToast");
    }
  }, []);

  // Redirección si el usuario no tiene rol
  useEffect(() => {
    if (user && !user.rol_global && location.pathname !== "/seleccionar-rol") {
      window.location.href = "/seleccionar-rol";
    }
  }, [user, location.pathname]);

  // Generar breadcrumbs dinámicos
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />

      {/* Breadcrumbs debajo del Navbar, solo si no estamos en "/" */}
      {location.pathname !== "/" && (
        <div className="container mx-auto max-w-7xl px-6 pt-4">
          <Breadcrumbs>
            <BreadcrumbItem key="home">
              <Link href="/">Inicio</Link>
            </BreadcrumbItem>
            {pathSegments.map((segment, index) => {
              const href = "/" + pathSegments.slice(0, index + 1).join("/");
              const isLast = index === pathSegments.length - 1;
              return (
                <BreadcrumbItem key={href}>
                  {isLast ? (
                    <span className="text-default-500 capitalize">{segment}</span>
                  ) : (
                    <Link href={href} className="capitalize">
                      {segment}
                    </Link>
                  )}
                </BreadcrumbItem>
              );
            })}
          </Breadcrumbs>
        </div>
      )}

      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-6">
        {children}
      </main>

      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://github.com/FLIPC0DE"
          title="FLIPC0DE GitHub Homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">FLIPC0DE</p>
        </Link>
      </footer>
    </div>
  );
}
