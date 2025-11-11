/**import { NavLink } from "react-router-dom";

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

import React, { useState } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  User,
  Plus,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  name: string;
  icon: React.ReactNode;
  subItems?: string[];
}

const Sidebar: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const navItems: NavItem[] = [
    {
      name: "Student Dashboard",
      icon: <LayoutDashboard />,
      subItems: ["Overview", "Stats", "Progress"],
    },
    {
      name: "Teacher Dashboard",
      icon: <GraduationCap />,
      subItems: ["Students", "Assignments", "Reports"],
    },
    {
      name: "Browse Courses",
      icon: <BookOpen />,
      subItems: ["All Courses", "Categories", "Recommended"],
    },
    {
      name: "Profile",
      icon: <User />,
      subItems: ["View Profile", "Settings"],
    },
  ];

  const enrolledCourses = ["Intro to Python", "Data Analysis 101"];

  const toggleMenu = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <aside className="bg-[#0f172a] text-slate-100 w-64 h-screen flex flex-col border-r border-slate-800 shadow-xl">
      {/* Header *}
      <div className="flex items-center justify-between p-6 text-lg font-semibold tracking-tight border-b border-slate-800">
        <span>Lista de Cursos</span>
        <button
          title="Add new"
          className="bg-emerald-600 hover:bg-emerald-500 p-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Navigation /}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item, index) => (
          <div key={item.name}>
            {/* Main Button /}
            <button
              onClick={() => toggleMenu(index)}
              className={`flex items-center justify-between w-full gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                openIndex === index
                  ? "bg-emerald-600/20 text-emerald-400"
                  : "hover:bg-slate-800 text-slate-300 hover:text-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5">{item.icon}</span>
                {item.name}
              </div>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>

            {/* Submenu /}
            <AnimatePresence>
              {openIndex === index && item.subItems && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="ml-10 mt-1 space-y-1">
                    {item.subItems.map((sub) => (
                      <button
                        key={sub}
                        className="block w-full text-left text-slate-400 hover:text-emerald-400 hover:bg-slate-800 px-3 py-1.5 rounded-md text-xs transition"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* My Enrollments /}
      <div className="px-6 text-xs uppercase tracking-wide text-slate-500 mt-2 mb-1">
        My Enrollments
      </div>

      <div className="px-4 pb-6 space-y-2">
        {enrolledCourses.map((course) => (
          <button
            key={course}
            className="block w-full text-left text-slate-300 hover:text-slate-100 hover:bg-slate-800 px-4 py-2.5 rounded-md text-sm transition"
          >
            {course}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
import { useContext } from "react";
import { AutenticacionContexto } from "@/context/AutenticacionContexto";
import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  User,
  Plus,
  ChevronDown,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  name: string;
  icon: React.ReactNode;
  subItems?: string[];
}

const Sidebar: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
   const [cursos, setCursos] = useState<Curso[]>([]); // 👈 Cursos desde el backend

  // Estados del formulario
  const [tituloCurso, settitulo_curso] = useState("");
  const [fechaInicio, setfechaInicio] = useState("");
  const [fechaFin, setfechaFin] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const { user } = useContext(AutenticacionContexto)!;

  const toggleMenu = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const navItems: NavItem[] = [
    {
      name: "Student Dashboard",
      icon: <LayoutDashboard />,
      subItems: ["Overview", "Stats", "Progress"],
    },
    {
      name: "Teacher Dashboard",
      icon: <GraduationCap />,
      subItems: ["Students", "Assignments", "Reports"],
    },
    {
      name: "Browse Courses",
      icon: <BookOpen />,
      subItems: ["All Courses", "Categories", "Recommended"],
    },
    {
      name: "Profile",
      icon: <User />,
      subItems: ["View Profile", "Settings"],
    },
  ];

  const enrolledCourses = ["Intro to Python", "Data Analysis 101"];

  // --- Manejo del formulario ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const idUsuario = user?.userId;
    console.log({ idUsuario, fechaInicio, fechaFin, descripcion, tituloCurso });
    console.log('hasta aqui llego');
    const stringToDate = (str: string) => {
      const [year, month, day] = str.split("-").map(Number);
      return new Date(year, month - 1, day);
    };

    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const inicio = stringToDate(fechaInicio);
      const fin = stringToDate(fechaFin);

      if (inicio < hoy) return alert("La fecha de inicio no puede ser anterior a hoy.");
      if (fin < hoy) return alert("La fecha fin no puede ser anterior a hoy.");
      if (fin <= inicio) return alert("La fecha fin debe ser mayor a la fecha de inicio.");

      const response = await fetch("http://localhost:3000/api/cursos/registrarCurso", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUsuario, fechaInicio, fechaFin, descripcion, tituloCurso }),
          });

      const data = await response.json();
      console.log("🔍 Respuesta del servidor:", data);

      if (response.ok) {
        alert("Curso registrado con éxito ✅");
        console.log("Curso:", data);
        setShowModal(false);
        settitulo_curso("");
        setfechaInicio("");
        setfechaFin("");
        setDescripcion("");
      } else {
        alert(data.error || "Error al registrar curso");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <>
      {/* Sidebar principal }
      <aside className="bg-[#0f172a] text-slate-100 w-64 h-screen flex flex-col border-r border-slate-800 shadow-xl">
        {/* Header }
        <div className="flex items-center justify-between p-6 text-lg font-semibold tracking-tight border-b border-slate-800">
          <span>Lista de Cursos</span>
          <button
            title="Agregar nuevo"
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 p-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Navegación }
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item, index) => (
            <div key={item.name}>
              <button
                onClick={() => toggleMenu(index)}
                className={`flex items-center justify-between w-full gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  openIndex === index
                    ? "bg-emerald-600/20 text-emerald-400"
                    : "hover:bg-slate-800 text-slate-300 hover:text-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5">{item.icon}</span>
                  {item.name}
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>

              {/* Submenú }
              <AnimatePresence>
                {openIndex === index && item.subItems && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-10 mt-1 space-y-1">
                      {item.subItems.map((sub) => (
                        <button
                          key={sub}
                          className="block w-full text-left text-slate-400 hover:text-emerald-400 hover:bg-slate-800 px-3 py-1.5 rounded-md text-xs transition"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Cursos inscritos }
        <div className="px-6 text-xs uppercase tracking-wide text-slate-500 mt-2 mb-1">
          Mis Cursos
        </div>
        <div className="px-4 pb-6 space-y-2">
          {enrolledCourses.map((course) => (
            <button
              key={course}
              className="block w-full text-left text-slate-300 hover:text-slate-100 hover:bg-slate-800 px-4 py-2.5 rounded-md text-sm transition"
            >
              {course}
            </button>
          ))}
        </div>
      </aside>

      {/* Modal con tu formulario }
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-[#1e293b] rounded-2xl p-6 w-[600px] text-white shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Botón cerrar }
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-semibold mb-4">Crear Nuevo Curso</h2>

              {/* --- FORMULARIO --- }
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="tituloCurso" className="block text-gray-300 mb-2">
                    Título del Curso
                  </label>
                  <input
                    id="tituloCurso"
                    type="text"
                    placeholder="Ej. Python para Principiantes"
                    className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={tituloCurso}
                    required
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      settitulo_curso(e.target.value)
                    }
                  />
                </div>

                <div>
                  <label htmlFor="descripcion" className="block text-gray-300 mb-2">
                    Descripción del Curso
                  </label>
                  <textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Escribe una breve descripción..."
                    required
                    className="w-full p-3 h-24 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fechaInicio" className="block mb-2 text-gray-300">
                      Fecha de Inicio
                    </label>
                    <input
                      id="fechaInicio"
                      type="date"
                      className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      value={fechaInicio}
                      required
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setfechaInicio(e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor="fechaFin" className="block mb-2 text-gray-300">
                      Fecha de Fin
                    </label>
                    <input
                      id="fechaFin"
                      type="date"
                      className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      value={fechaFin}
                      required
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setfechaFin(e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Botones }
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 transition"
                  >
                    Crear Curso
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;**/
import React, { useState, useEffect, ChangeEvent, FormEvent, useContext } from "react";
import { AutenticacionContexto } from "@/context/AutenticacionContexto";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  User,
  Plus,
  ChevronDown,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Curso {
  id_curso: number;
  titulo_curso: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
}

const Sidebar: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [cursos, setCursos] = useState<Curso[]>([]); // 👈 Cursos desde el backend

  // Formulario
  const [tituloCurso, settitulo_curso] = useState("");
  const [fechaInicio, setfechaInicio] = useState("");
  const [fechaFin, setfechaFin] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const { user } = useContext(AutenticacionContexto)!;

  // 🔹 Obtener cursos al montar el componente
  useEffect(() => {
    obtenerCursos();
  }, []);

  const obtenerCursos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cursos/listarCursos");
      const data = await res.json();
      setCursos(data);
    } catch (error) {
      console.error("Error al obtener cursos:", error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const idUsuario = user?.userId;

    try {
      const response = await fetch("http://localhost:3000/api/cursos/registrarCurso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUsuario, fechaInicio, fechaFin, descripcion, tituloCurso }),
      });

      const data = await response.json();
      console.log("🔍 Respuesta del servidor:", data);

      if (response.ok) {
        alert("Curso registrado con éxito ✅");
        setShowModal(false);
        settitulo_curso("");
        setfechaInicio("");
        setfechaFin("");
        setDescripcion("");

        // 🔄 Actualizar la lista de cursos
        obtenerCursos();
      } else {
        alert(data.error || "Error al registrar curso");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside className="bg-[#0f172a] text-slate-100 w-64 h-screen flex flex-col border-r border-slate-800 shadow-xl">
        <div className="flex items-center justify-between p-6 text-lg font-semibold tracking-tight border-b border-slate-800">
          <span>Lista de Cursos</span>
          <button
            title="Agregar nuevo"
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 p-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Mis Cursos dinámicos */}
        <div className="px-6 text-xs uppercase tracking-wide text-slate-500 mt-4 mb-2">
          Mis Cursos
        </div>
        <div className="px-4 pb-6 space-y-2 flex-1 overflow-y-auto">
          {cursos.length > 0 ? (
            cursos.map((curso) => (
              <button
                key={curso.id_curso}
                className="block w-full text-left text-slate-300 hover:text-slate-100 hover:bg-slate-800 px-4 py-2.5 rounded-md text-sm transition"
              >
                {curso.titulo_curso}
              </button>
            ))
          ) : (
            <p className="text-slate-500 text-sm italic px-4">No hay cursos registrados.</p>
          )}
        </div>
      </aside>

      {/* Modal para crear curso */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-[#1e293b] rounded-2xl p-6 w-[600px] text-white shadow-2xl relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-semibold mb-4">Crear Nuevo Curso</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Título del Curso</label>
                  <input
                    type="text"
                    value={tituloCurso}
                    onChange={(e) => settitulo_curso(e.target.value)}
                    required
                    className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Descripción</label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                    className="w-full p-3 h-24 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-gray-300">Fecha de Inicio</label>
                    <input
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setfechaInicio(e.target.value)}
                      required
                      className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-300">Fecha de Fin</label>
                    <input
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setfechaFin(e.target.value)}
                      required
                      className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 transition"
                  >
                    Crear Curso
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;

