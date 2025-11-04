import { Link } from "@heroui/link";
import { Navbar } from "@/components/navbar";
import { useContext, useEffect } from "react";
import { addToast } from "@heroui/react";
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

  useEffect(() => {
    const welcome = sessionStorage.getItem("showWelcomeToast");
    if (welcome) {
      addToast({
        title: "¡Bienvenido!",
        description: "Nos alegra verte de nuevo",
        color: "success",
      });
      sessionStorage.removeItem("showWelcomeToast");
    }

    const logout = sessionStorage.getItem("showLogoutToast");
    if (logout) {
      addToast({
        title: "Sesión cerrada",
        description: "Has salido correctamente",
        color: "warning",
      });
      sessionStorage.removeItem("showLogoutToast");
    }
  }, []);

  useEffect(() => {
    if (user && !user.rol_global && location.pathname !== "/seleccionar-rol") {
      // Si el usuario está logueado pero no tiene rol, redirigir
      window.location.href = "/seleccionar-rol";
    }
  }, [user, location.pathname]);

  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
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
          <p className="text-primary">FlipC0de</p>
        </Link>
      </footer>
    </div>
  );
}
