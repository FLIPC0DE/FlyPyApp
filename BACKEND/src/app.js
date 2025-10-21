import express from "express";
import cors from "cors";
import registroUsuarioRoutes from "./routes/registroUsuario.routes.js"; // ajusta la ruta según dónde esté tu server.js
import registroCursoRoutes from "./routes/registroCurso.routes.js";
import autenticacion from "./routes/autenticacion.routes.js";
import dotenv from "dotenv";
dotenv.config();

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
app.use("/api/auth", autenticacion);

app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});