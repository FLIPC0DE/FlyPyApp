import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ title, startDate, endDate });
  };

  return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 text-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">

          {/* Grid para los campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Title */}
            <div>
              <label htmlFor="title" className="block mb-2 text-gray-300">
                Titulo del Curso
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter course title"
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
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
              className="w-full p-3 h-32 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
          </div>
            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block mb-2 text-gray-300">
                Fecha de Inicio
              </label>
              <input
                id="startDate"
                type="date"
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
                value={startDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setStartDate(e.target.value)
                }
              />
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block mb-2 text-gray-300">
                Fecha de Fin
              </label>
              <input
                id="endDate"
                type="date"
                className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-green-400 focus:outline-none"
                value={endDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEndDate(e.target.value)
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
