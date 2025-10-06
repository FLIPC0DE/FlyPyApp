import { useState } from "react";

const FormularioDeRegistro = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [id_rol, setRol] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:4000/api/usuarios/registrarUsuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, id_rol}),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Usuario registrado con éxito ✅");
        console.log("Usuario:", data);
      } else {
        alert(data.error || "Error al registrar usuario");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-red shadow-md rounded p-6 w-96"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Crear Cuenta</h2>

      {/* Nombre */}
      <label className="block mb-2">Nombre</label>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Enter your name"
        className="w-full p-2 border rounded mb-4"
      />

      {/* Email */}
      <label className="block mb-2">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full p-2 border rounded mb-4"
      />

      {/* Password */}
      <label className="block mb-2">Contraseña</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        className="w-full p-2 border rounded mb-4"
      />

      {/* Confirm Password */}
      <label className="block mb-2">Confirmar Contraseña</label>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Re-enter your password"
        className="w-full p-2 border rounded mb-4"
      />

      {/* Caja de selección */}
      <label htmlFor="id_rol" className="block mb-2">Selecciona tu Rol</label>
      <select
        id="id_rol"
        value={id_rol}
        onChange={(e) => setRol(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">-- Selecciona un rol --</option>
        <option value={1}>Docente</option>
        <option value={2}>Estudiante</option>
        <option value={3}>Usuario</option>
      </select>

      {/* Botón principal */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Registrarse
      </button>

      {/* Línea divisoria */}
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-gray-400">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Botones sociales */}
      <div className="flex justify-between">
        <button type="button" className="flex-1 bg-red-500 text-white p-2 rounded mr-2">
          Google
        </button>
        <button type="button" className="flex-1 bg-black text-white p-2 rounded mr-2">
          Apple
        </button>
        <button type="button" className="flex-1 bg-blue-600 text-white p-2 rounded">
          Facebook
        </button>
      </div>

      {/* Enlace para iniciar sesión */}
      <p className="text-center text-sm mt-4">
        Ya tienes una cuenta?{" "}
        <a href="/login" className="text-blue-500">
          Iniciar Sesion
        </a>
      </p>
    </form>
  );
};

export default FormularioDeRegistro;
