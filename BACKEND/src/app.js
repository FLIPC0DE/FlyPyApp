import express from "express";
import cors from "cors";
import registroUsuarioRoutes from "./routes/registroUsuario.routes.js"; // ajusta la ruta según dónde esté tu server.js

const app = express();
app.use(cors());
app.use(express.json());

// montar las rutas de usuario
app.use("/api/usuarios", registroUsuarioRoutes);

app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});