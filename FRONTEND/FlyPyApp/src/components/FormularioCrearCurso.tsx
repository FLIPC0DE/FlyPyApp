import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

const CreateCourse = () => {
  const [tituloCurso, settitulo_curso] = useState("");
  const [fechaInicio, setfechaInicio] = useState("");
  const [fechaFin, setfechaFin] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let idUsuario = 1
    console.log({ idUsuario, fechaInicio, fechaFin, descripcion, tituloCurso });
    
  
    try {
      
      const response = await fetch("http://localhost:4000/api/cursos/registrarCurso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUsuario, fechaInicio, fechaFin, descripcion, tituloCurso }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Curso registrado con éxito ✅");
        console.log("Usuario:", data);
      } else {
        alert(data.error || "Error al registrar curso");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 text-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">

          {/* Grid para los campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course titulo_curso */}
            <div>
              <label htmlFor="tituloCurso" className="block mb-2 text-gray-300">
                Titulo del Curso
              </label>
              <input
                id="tituloCurso"
                type="text"
                placeholder="Enter course titulo_curso"
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
                value={tituloCurso}
                required
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  settitulo_curso(e.target.value)
                }
              />
            </div>

          {/* Descripción */}
          <div className="mb-4">
          <label htmlFor="descripcion" className="block text-gray-300 mb-2">
              Descripción del Curso
          </label>
          <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Escribe una breve descripción del curso..."
              required
              className="w-full p-3 h-32 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
          </div>
            {/* Start Date */}
            <div>
              <label htmlFor="fechaInicio" className="block mb-2 text-gray-300">
                Fecha de Inicio
              </label>
              <input
                id="fechaInicio"
                type="date"
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
                value={fechaInicio}
                required
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setfechaInicio(e.target.value)
                }
              />
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="fechaFin" className="block mb-2 text-gray-300">
                Fecha de Fin
              </label>
              <input
                id="fechaFin"
                type="date"
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
                value={fechaFin}
                required
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setfechaFin(e.target.value)
                }
              />
            </div>
          </div>
          {/*
        
          <div className="mt-6">
            <label htmlFor="teachers" className="block mb-2 text-gray-300">
              Invite Teachers
            </label>
            <input
              id="teachers"
              type="text"
              placeholder="Enter teacher emails separated by commas"
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
              value={teachers}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTeachers(e.target.value)
              }
            />
          </div>
          */}

          {/* Botones */}
          <div className="flex justify-end mt-8 space-x-4">
            <button
              type="button"
              className="px-6 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-green-500 hover:bg-green-400 transition"
            >
              Crear Curso
            </button>
          </div>
        </form>
      </div>

  );
};

export default CreateCourse;
