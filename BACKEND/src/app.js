import express from "express";
import cors from "cors";
import registroUsuarioRoutes from "./routes/registroUsuario.routes.js"; // ajusta la ruta según dónde esté tu server.js
import registroCursoRoutes from "./routes/registroCurso.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Servidor corriendo correctamente en el puerto 4000. ¡Accede a las rutas /api/!",
    status: "ok"
  });
});


// montar las rutas de usuario
app.use("/api/usuarios", registroUsuarioRoutes);
app.use("/api/cursos",registroCursoRoutes)

app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});