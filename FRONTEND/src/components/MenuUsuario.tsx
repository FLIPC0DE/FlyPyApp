import { useContext, useState, useEffect, useRef } from "react";
//import { jwtDecode } from "jwt-decode";
import { AutenticacionContexto } from "../context/AutenticacionContexto";

// 👇 Tipo para los datos que esperas del token JWT
// interface DecodedToken {
//   //id: number;
//   email: string;
//   nombre: string;
//   id_rol: number;
//   //exp?: number;
// }

function MenuUsuario() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AutenticacionContexto)!;
  //const [user, setUser] = useState<DecodedToken | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // 👇 Manejar clic fuera del menú
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 👇 Obtener datos del token guardado al iniciar sesión
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        //const decoded = jwtDecode<DecodedToken>(token);
        //setUser(decoded);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    //window.location.href = "/login"; // redirige al login
    console.log("token eliminado");
    logout();
    //setUser(null);
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Botón (avatar o inicial del usuario) */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold hover:bg-gray-600 transition"
      >
        {user?.nombre ? user.nombre[0].toUpperCase() : "U"}
      </button>

      {/* Menú desplegable */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-800">
              {user?.nombre || "Usuario"}
            </p>
          </div>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
            Perfil
          </button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
            Configuración
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default MenuUsuario;
