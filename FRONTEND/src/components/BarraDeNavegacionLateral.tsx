import React, { useState, useEffect, FormEvent, useContext } from "react";
import { AutenticacionContexto } from "@/context/AutenticacionContexto";
import { Plus, X, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurso } from "../context/CursoContexto";


interface Curso {
  id_curso: number;
  titulo_curso: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
}
interface Modulo {
  id_modulo: number;
  id_curso: number;
  nombre: string;
  descripcion?: string;
}

const Sidebar: React.FC = () => {
    const TIPOS_VALIDOS = [
    "TEXTO_IMAGEN",
    "TEXTO_VIDEO",
    "TEXTO_SLIDES",
    "TEXTO_AUDIO",
    "PLAYGROUND",
    "VIDEO_PLAYGROUND",
    "IMAGE_PLAYGROUND"
  ];


  const { user } = useContext(AutenticacionContexto)!;
  
  const { setModuloSeleccionado } = useCurso();

  // Verificar si el usuario es ESTUDIANTE (no puede crear cursos)
  const esEstudiante = user?.rol_global === "ESTUDIANTE";


  // Cursos y módulos
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [modulos, setModulos] = useState<Record<number, any[]>>({});
  const [cursoExpandido, setCursoExpandido] = useState<number | null>(null);

  // Crear curso modal (ya existente)
  const [showModal, setShowModal] = useState(false);
  const [tituloCurso, setTituloCurso] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  //topicos
  const {topicoSeleccionado, setTopicoSeleccionado } = useCurso();
  //const [topicoSeleccionado, setTopicoSeleccionado] = useState<number | null>(null);
  const [topicos, setTopicos] = useState<Record<number, any[]>>({});
  const [moduloSeleccionadoParaTopico, setModuloSeleccionadoParaTopico] = useState<Modulo | null>(null);
  const [showTopicoModal, setShowTopicoModal] = useState(false);
  const [tituloTopico, setTituloTopico] = useState("");
  const [descripcionTopico, setDescripcionTopico] = useState("");
  const [tipoTopico, setTipoTopico] = useState(""); // podría ser string o enum según tu backend
  const [disponibleDesde, setDisponibleDesde] = useState("");
  const [disponibleHasta, setDisponibleHasta] = useState("");

  // Comentarios modal
  const [showCursoModal, setShowCursoModal] = useState<Curso | null>(null);
  const [comentario, setComentario] = useState("");

  // Módulo modal (solo nombre)
  const [showModuloModal, setShowModuloModal] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>(null);
  const [tituloModulo, setTituloModulo] = useState("");

  // ---------- Fetchs ----------
  const obtenerCursos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cursos/listarCursos");
      const data = await res.json();
      setCursos(data);
    } catch (error) {
      console.error("Error al obtener cursos:", error);
    }
  };

const obtenerModulosPorCurso = async (idCurso: number) => {
  try {
    const res = await fetch(`http://localhost:3000/api/modulos/listarModulos/${idCurso}`);
    const modulosData = await res.json();
    setModulos(prev => ({ ...prev, [idCurso]: modulosData }));

    // Por cada módulo, obtener sus tópicos
    modulosData.forEach(async (modulo: Modulo) => {
      try {
        const resTopicos = await fetch(`http://localhost:3000/api/topicos/listarTopicos/${modulo.id_modulo}`);
        const topicosData = await resTopicos.json();
        setTopicos(prev => ({ ...prev, [modulo.id_modulo]: topicosData }));
      } catch (error) {
        console.error("Error al obtener tópicos del módulo", modulo.id_modulo, error);
      }
    });

  } catch (error) {
    console.error("Error al obtener módulos:", error);
  }
};


  useEffect(() => {
    obtenerCursos();
  }, []);

  // ---------- Toggle curso (acordeón) ----------
  const toggleCurso = (curso: Curso) => {
    if (cursoExpandido === curso.id_curso) {
      setCursoExpandido(null);
    } else {
      setCursoExpandido(curso.id_curso);
      obtenerModulosPorCurso(curso.id_curso);
    }
  };

  // ---------- Crear curso ----------
  const handleCrearCurso = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const idUsuario = user?.userId;
    try {
      const response = await fetch("http://localhost:3000/api/cursos/registrarCurso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUsuario, fechaInicio, fechaFin, descripcion, tituloCurso }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Curso registrado con éxito ✅");
        setShowModal(false);
        setTituloCurso("");
        setDescripcion("");
        setFechaInicio("");
        setFechaFin("");
        obtenerCursos();
      } else {
        alert(data.error || "Error al registrar curso");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  // ---------- Registrar comentario (original restaurado) ----------
  const registrarComentario = async (curso: Curso) => {
    if (!comentario.trim()) {
      alert("Por favor escribe un comentario.");
      return;
    }

    const payload = {
      id_curso: curso.id_curso,
      id_usuario: user?.userId,
      contenido: comentario,
    };

    try {
      const res = await fetch("http://localhost:3000/api/comentarios/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Comentario registrado correctamente");
        setComentario("");
        setShowCursoModal(null);
      } else {
        alert(data.error || "Error al registrar comentario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema con el servidor.");
    }
  };

  const handleEnviarComentario = (curso: Curso) => {
    registrarComentario(curso);
  };

  // ---------- Registrar módulo (solo nombre) ----------
  const registrarModulo = async () => {
    if (!cursoSeleccionado) return alert("Selecciona un curso");
    if (!tituloModulo.trim()) return alert("Escribe un nombre para el módulo");
    
    try {
      const response = await fetch("http://localhost:3000/api/modulos/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: tituloModulo,
          id_curso: cursoSeleccionado.id_curso,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Módulo creado con éxito.");
        setShowModuloModal(false);
        setTituloModulo("");
        // refrescar módulos del curso creado
        obtenerModulosPorCurso(cursoSeleccionado.id_curso);
      } else {
        alert(data.error || "Error al crear módulo");
      }
    } catch (error) {
      console.error("Error al registrar módulo:", error);
    }
  };

  const obtenerTopicosPorModulo = async (idModulo: number) => {
  try {
    const res = await fetch(`http://localhost:3000/api/topicos/listarTopicos/${idModulo}`);
    const data = await res.json();
    setTopicos(prev => ({ ...prev, [idModulo]: data }));
  } catch (error) {
    console.error("Error al obtener tópicos:", error);
  }
  };

  const registrarTopico = async () => {
  if (!moduloSeleccionadoParaTopico) return alert("Selecciona un módulo");
  if (!tituloTopico.trim()) return alert("Escribe un título para el tópico");

  try {
    console.log("id modulo",moduloSeleccionadoParaTopico.id_modulo, "id curso",moduloSeleccionadoParaTopico.id_curso);
    const response = await fetch("http://localhost:3000/api/topicos/crear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
        titulo: tituloTopico,
        descripcion: descripcionTopico,
        tipo: tipoTopico,
        disponible_desde: disponibleDesde || null,
        disponible_hasta: disponibleHasta || null,
        id_modulo: moduloSeleccionadoParaTopico.id_modulo,
        id_curso: moduloSeleccionadoParaTopico.id_curso
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Tópico creado con éxito.");
      setShowTopicoModal(false);
      setTituloTopico("");
      setDescripcionTopico("");
      // refrescar tópicos del módulo creado
      obtenerTopicosPorModulo(moduloSeleccionadoParaTopico.id_modulo);
    } else {
      alert(data.error || "Error al crear tópico");
    }
  } catch (error) {
    console.error("Error al registrar tópico:", error);
  }
};


  return (
    <>
      {/* Sidebar principal */}
      <aside className="bg-[#0f172a] text-slate-100 w-90 h-screen flex flex-col border-r border-slate-800 shadow-xl">
        <div className="flex items-center justify-between p-6 text-lg font-semibold tracking-tight border-b border-slate-800">
          <span>Lista de Cursos</span>
          {!esEstudiante && (
            <button
              title="Agregar nuevo curso"
              onClick={() => setShowModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 p-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        <div className="px-6 text-xs uppercase tracking-wide text-slate-500 mt-4 mb-2">
          Mis Cursos
        </div>
        <div className="px-4 pb-6 space-y-2 flex-1 overflow-y-auto">
          {cursos.map(curso => (
            <div key={curso.id_curso} className="bg-slate-800 rounded-lg">
              <button
                onClick={() => toggleCurso(curso)}
                className="flex items-center justify-between w-full px-4 py-3 text-left text-slate-200 hover:bg-slate-700 rounded-lg"
              >
                <span className="text-emerald-400">
                  {cursoExpandido === curso.id_curso ? "▲" : "▼"}
                </span>

                <span className="font-medium">{curso.titulo_curso}</span>

                <MessageSquare
                  onClick={(e) => {
                    e.stopPropagation(); // evitar toggle al abrir modal de comentario
                    setShowCursoModal(curso);
                  }}
                  className="w-4 h-4 text-emerald-400"
                />
              </button>

              {cursoExpandido === curso.id_curso && (
                  <div className="px-6 py-3 space-y-3 bg-slate-900 rounded-b-lg">
                    {modulos[curso.id_curso]?.length > 0 ? (
                      modulos[curso.id_curso].map((modulo) => (
                        <div key={modulo.id_modulo} className="bg-slate-700 px-4 py-3 rounded-lg text-slate-300">
                          <h3 className="font-semibold text-emerald-400">{modulo.nombre}</h3>

                          {/* Listado de tópicos */}
                        {topicos[modulo.id_modulo]?.length > 0 ? (
                          topicos[modulo.id_modulo].map((topico) => (
                            <div 
                                key={topico.id_topico} 
                                className={`ml-4 py-1 text-sm text-slate-200 cursor-pointer rounded px-2 ${
                                  topicoSeleccionado === topico.id_topico ? "bg-emerald-600 text-white" : "hover:bg-slate-600"
                                }`}
                                onClick={() => {
                                    setTopicoSeleccionado(topico.id_topico);   // Seleccionas el tópico globalmente
                                    setModuloSeleccionado(modulo);             // Guardas el módulo actual
                                  }}
                              >
                                {topico.titulo}
                              </div>
                          ))
                        ) : (
                          <p className="ml-4 text-slate-500 text-sm">Este módulo no tiene tópicos.</p>
                        )}

                          <button
                            onClick={() => {
                              setModuloSeleccionadoParaTopico(modulo);
                              setShowTopicoModal(true);
                            }}
                            className="mt-2 text-sm bg-emerald-600 hover:bg-emerald-500 p-1 rounded"
                          >
                            + Añadir tópico
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm">Este curso no tiene módulos.</p>
                    )}

                    <button
                      onClick={() => {
                        setCursoSeleccionado(curso);
                        setShowModuloModal(true);
                      }}
                      className="w-full mt-3 bg-emerald-600 hover:bg-emerald-500 p-2 rounded-lg text-white transition"
                    >
                      + Añadir módulo
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>
      </aside>

      {/* ---------------- Modal para crear módulo (solo nombre) ---------------- */}
      <AnimatePresence>
        {showModuloModal && cursoSeleccionado && (
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
              transition={{ duration: 0.2 }}
              className="bg-[#1e293b] rounded-2xl p-6 w-[420px] text-white shadow-2xl relative"
            >
              <button
                onClick={() => setShowModuloModal(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-semibold mb-3">Añadir módulo</h3>
              <p className="text-sm text-slate-400 mb-4">Curso: <span className="text-emerald-300">{cursoSeleccionado.titulo_curso}</span></p>

              <div className="space-y-3">
                <input
                  type="text"
                  value={tituloModulo}
                  onChange={(e) => setTituloModulo(e.target.value)}
                  placeholder="Nombre del módulo"
                  className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-emerald-500"
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModuloModal(false)}
                    className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={registrarModulo}
                    className="px-4 py-2 bg-emerald-600 rounded-md hover:bg-emerald-500"
                  >
                    Crear módulo
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- Modal para crear curso (igual que tu original) ---------------- */}
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

              <form onSubmit={handleCrearCurso} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Título del Curso</label>
                  <input
                    type="text"
                    value={tituloCurso}
                    onChange={(e) => setTituloCurso(e.target.value)}
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
                      onChange={(e) => setFechaInicio(e.target.value)}
                      required
                      className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-300">Fecha de Fin</label>
                    <input
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
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

      {/* ---------------- Modal de comentario por curso (restaurado) ---------------- */}
      <AnimatePresence>
        {showCursoModal && (
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
              className="bg-[#1e293b] rounded-2xl p-6 w-[500px] text-white shadow-2xl relative"
            >
              <button
                onClick={() => setShowCursoModal(null)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-semibold mb-4 text-emerald-400">
                {showCursoModal.titulo_curso}
              </h2>
              <p className="text-sm text-slate-400 mb-4">{showCursoModal.descripcion}</p>

              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escribe un comentario..."
                className="w-full p-3 h-32 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none mb-4"
              />

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCursoModal(null)}
                  className="px-5 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleEnviarComentario(showCursoModal!)}
                  className="px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 transition"
                >
                  Enviar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
  {showTopicoModal && moduloSeleccionadoParaTopico && (
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
        transition={{ duration: 0.2 }}
        className="bg-[#1e293b] rounded-2xl p-6 w-[420px] text-white shadow-2xl relative"
      >
        <button
          onClick={() => setShowTopicoModal(false)}
          className="absolute top-3 right-3 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold mb-3">Añadir Tópico</h3>
        <p className="text-sm text-slate-400 mb-4">
          Módulo: <span className="text-emerald-300">{moduloSeleccionadoParaTopico.nombre}</span>
        </p>

        <div className="space-y-3">
          <input
            type="text"
            value={tituloTopico}
            onChange={(e) => setTituloTopico(e.target.value)}
            placeholder="Título del tópico"
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-emerald-500"
          />
          <textarea
            value={descripcionTopico}
            onChange={(e) => setDescripcionTopico(e.target.value)}
            placeholder="Descripción (opcional)"
            className="w-full p-3 h-20 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-emerald-500"
          />

          {/* Nuevo: Tipo */}
          <select
            value={tipoTopico}
            onChange={(e) => setTipoTopico(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Selecciona un tipo</option>
            <option value="TEXTO_IMAGEN">Texto + Imagen</option>
            <option value="TEXTO_VIDEO">Texto + Video</option>
            <option value="TEXTO_SLIDES">Texto + Slides</option>
            <option value="TEXTO_AUDIO">Texto + Audio</option>
            <option value="PLAYGROUND">Playground</option>
            <option value="VIDEO_PLAYGROUND">Video Playground</option>
            <option value="IMAGE_PLAYGROUND">Imagen Playground</option>
          </select>

          {/* Nuevas fechas */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm text-gray-300">Disponible desde</label>
              <input
                type="date"
                value={disponibleDesde}
                onChange={(e) => setDisponibleDesde(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300">Disponible hasta</label>
              <input
                type="date"
                value={disponibleHasta}
                onChange={(e) => setDisponibleHasta(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowTopicoModal(false)}
              className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              onClick={registrarTopico}
              className="px-4 py-2 bg-emerald-600 rounded-md hover:bg-emerald-500"
            >
              Crear tópico
            </button>
          </div>
        </div>

      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </>
  );
};

export default Sidebar;
