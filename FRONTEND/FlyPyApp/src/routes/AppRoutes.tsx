import { Routes, Route } from "react-router-dom";
import BarrasDeNavegacion from "../components/BarrasDeNavegacion";
import  PaginaCrearCurso from "../pages/PaginaCrearCurso";
import  PaginaDeRegistro from "../pages/PaginaDeRegistro";

const AppRoutes = () => {
  return (
    <BarrasDeNavegacion>
      <Routes>
        <Route path="/" element={<PaginaCrearCurso />} />
        <Route path="/crear-curso" element={<PaginaCrearCurso />} />
        <Route path="/registrarse" element={<PaginaDeRegistro />} />
      </Routes>
    </BarrasDeNavegacion>
  );
};

export default AppRoutes;
