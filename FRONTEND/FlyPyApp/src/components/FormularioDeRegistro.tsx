const FormularioDeRegistro = () => {
  return (
    <form className="bg-red shadow-md rounded p-6 w-96">
      <h2 className="text-2xl font-bold mb-6 text-center">Crear Cuenta</h2>

      {/* Nombre */}
      <label className="block mb-2">Nombre</label>
      <input
        type="text"
        placeholder="Enter your name"
        className="w-full p-2 border rounded mb-4"
      />

      {/* Email */}
      <label className="block mb-2">Email</label>
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full p-2 border rounded mb-4"
      />

      {/* Password */}
      <label className="block mb-2">Contraseña</label>
      <input
        type="password"
        placeholder="Enter your password"
        className="w-full p-2 border rounded mb-4"
      />

      {/* Confirm Password */}
      <label className="block mb-2">Confirmar Contraseña</label>
      <input
        type="password"
        placeholder="Re-enter your password"
        className="w-full p-2 border rounded mb-4"
      />

      {/* Botón principal */}
      <button className="w-full bg-blue-500 text-white p-2 rounded">
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
        <button className="flex-1 bg-red-500 text-white p-2 rounded mr-2">
          Google
        </button>
        <button className="flex-1 bg-black text-white p-2 rounded mr-2">
          Apple
        </button>
        <button className="flex-1 bg-blue-600 text-white p-2 rounded">
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
