import { NavLink } from "react-router-dom";

const BarraDeNavegacionLateral = () => {
    return (
      <aside className="w-64 bg-[#0f172a] text-gray-200 h-screen p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8 text-white">FlyPy</h1>
        <nav className="space-y-2">
          <button className="w-full text-left py-2 px-3 rounded hover:bg-[#1e293b] transition">
            📊 Dashboard
          </button>
          <NavLink
          to="/crear-curso"
          className={({ isActive }) =>
            `block px-4 py-2 rounded hover:bg-indigo-600 hover:text-white ${
              isActive ? "bg-indigo-700 text-white" : ""
            }`
          }
        >
          Crear Curso
        </NavLink>
        <NavLink
          to="/registrarse"
          className={({ isActive }) =>
            `block px-4 py-2 rounded hover:bg-indigo-600 hover:text-white ${
              isActive ? "bg-indigo-700 text-white" : ""
            }`
          }
        >
          Registrar Usuario
        </NavLink>
        <NavLink
          to="/iniciarSesion"
          className={({ isActive }) =>
            `block px-4 py-2 rounded hover:bg-indigo-600 hover:text-white ${
              isActive ? "bg-indigo-700 text-white" : ""
            }`
          }
        >
          Iniciar Sesion
        </NavLink>
        </nav>
      </aside>
    );
  };
  
  export default BarraDeNavegacionLateral;
  