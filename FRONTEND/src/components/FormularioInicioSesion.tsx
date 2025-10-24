import { useState } from "react";
import { useContext } from "react";
import { AutenticacionContexto } from "../context/AutenticacionContexto";
import type { DecodedToken } from "../context/AutenticacionContexto";
import {jwtDecode} from "jwt-decode"; // default import

export default function LoginPage() {
  /** 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("http://localhost:4000/api/auth/iniciarSesion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    console.log(data);

    if (res.ok) {
      localStorage.setItem("token", data.token);
      alert("Inicio de sesión exitoso");
    } else {
      alert(data.message);
    }
  };*/


  const { setUser } = useContext(AutenticacionContexto)!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/api/auth/iniciarSesion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email,password}),
    });
    
    const data = await response.json();
    console.log(data);

    if (data.token) {
      localStorage.setItem("token", data.token);
      //const decoded = jwtDecode(data.token);
      //setUser(decoded); // 🔥 Actualiza globalmente el usuario
      const decoded = jwtDecode<DecodedToken>(data.token);
      setUser(decoded);
    }
    //console.log(data);
   
    if (response.ok) {
      localStorage.setItem("token", data.token);
      setEmail("");
      setPassword("");
      alert("Inicio de sesión exitoso");
    } else {
      alert(data.message);
    }
  };


  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl shadow-md text-white w-96"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h1>
        <input
          className="w-full p-2 mb-3 rounded bg-gray-700 border border-gray-600"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 mb-3 rounded bg-gray-700 border border-gray-600"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded mt-2"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};
