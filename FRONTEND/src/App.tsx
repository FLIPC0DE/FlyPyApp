import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import PlaygroundPage from "@/pages/playground";
import AboutPage from "@/pages/about";
import NotFoundPage from "./pages/404";
import CoursesPage from "./pages/curso";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import DashboardPage from "./pages/usario/dashboard";
import MyCoursesPage from "./pages/usario/my-courses";
import ProgressPage from "./pages/usario/progress";
import CheckpointsPage from "./pages/usario/checkpoints";
import AnalyticsPage from "./pages/usario/analytics";
import SettingsPage from "./pages/settings";
import HelpPage from "./pages/help";
import ProfilePage from "./pages/usario/profile";
import SeleccionarRolPage from "./pages/seleccionarRol";
import OAuthRedirectPage from "./pages/oauth/redirect";
import RutaProtegida from "./layouts/rutaProtegida";
import EditarPerfilPage from "./pages/usario/editarPerfil";
import CambiarContraseñaPage from "./pages/usario/cambiarContraseña";
import RecuperarContraseñaPage from "./pages/auth/recuperarContraseña";
import CursoDetallePage from "./pages/curso/detalle";
import CrearCursoPage from "./pages/curso/crearCurso";
import EditarCursoPage from "./pages/curso/editarCurso";

function App() {
  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<IndexPage />} path="/" />
        <Route element={<CoursesPage />} path="/cursos" />
        <Route element={<CursoDetallePage />} path="/cursos/:id" />
        <Route element={<PlaygroundPage />} path="/playground" />
        <Route element={<AboutPage />} path="/sobre-nosotros" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />
        <Route element={<RecuperarContraseñaPage />} path="/recuperar" />

        {/* Rutas transitorias (no requieren protección) */}
        <Route element={<OAuthRedirectPage />} path="/oauth-redirect" />
        <Route element={<SeleccionarRolPage />} path="/seleccionar-rol" />

        {/* Rutas privadas protegidas */}
        <Route
          path="/panel-de-control"
          element={
            <RutaProtegida>
              <DashboardPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/cursos/crear-curso"
          element={
            <RutaProtegida
              rolesPermitidos={["DOCENTE_EJECUTOR", "ADMINISTRADOR"]}
            >
              <CrearCursoPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/cursos/:id/editar"
          element={
            <RutaProtegida
              rolesPermitidos={[
                "ADMINISTRADOR",
                "DOCENTE_EJECUTOR",
                "DOCENTE_EDITOR",
                "ADMIN_AYUDANTE",
              ]}
            >
              <EditarCursoPage />
            </RutaProtegida>
          }
        />

        <Route
          path="/mis-cursos"
          element={
            <RutaProtegida
              rolesPermitidos={[
                "ESTUDIANTE",
                "DOCENTE_EJECUTOR",
                "ADMINISTRADOR",
              ]}
            >
              <MyCoursesPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/perfil"
          element={
            <RutaProtegida>
              <ProfilePage />
            </RutaProtegida>
          }
        />
        <Route
          path="/editar-perfil"
          element={
            <RutaProtegida>
              <EditarPerfilPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/cambiar-contraseña"
          element={
            <RutaProtegida>
              <CambiarContraseñaPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/progreso"
          element={
            <RutaProtegida rolesPermitidos={["ESTUDIANTE"]}>
              <ProgressPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/checkpoints"
          element={
            <RutaProtegida rolesPermitidos={["ESTUDIANTE", "DOCENTE_EJECUTOR"]}>
              <CheckpointsPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/analitica"
          element={
            <RutaProtegida
              rolesPermitidos={["DOCENTE_EJECUTOR", "ADMINISTRADOR"]}
            >
              <AnalyticsPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/configuracion"
          element={
            <RutaProtegida>
              <SettingsPage />
            </RutaProtegida>
          }
        />
        <Route
          path="/ayuda"
          element={
            <RutaProtegida>
              <HelpPage />
            </RutaProtegida>
          }
        />

        {/* Ruta 404 - Not Found */}
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </>
  );
}

export default App;
