import "dotenv/config";
import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.routes";
import usuarioRouter from "./routes/usuario.routes";
import oauthRouter from "./routes/oauth.routes";
import verificacionRouter from "./routes/verificacion.routes";
import registrarCursoRouter from "./routes/registroCurso.routes";
import registrarComentarioRouter from "./routes/comentario.routes";
import registrarModuloRouter from "./routes/modulo.routes";
import registrarTopicoRouter from "./routes/topico.routes";
import contenidoRouter from "./routes/contenido.routes";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("PyFly backend funcionando 🚀");
});

app.use("/api/auth", authRouter);
app.use("/api/verificacion", verificacionRouter);
app.use("/api/usuarios", usuarioRouter);
app.use("/api/oauth", oauthRouter);
app.use("/api/cursos", registrarCursoRouter);
app.use("/api/comentarios", registrarComentarioRouter);
app.use("/api/modulos", registrarModuloRouter);
app.use("/api/topicos", registrarTopicoRouter);
app.use("/api/contenidos", contenidoRouter);


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use((req, res) => res.status(404).json({ error: "No encontrado" }));

app.use((err: any, _req: express.Request, res: express.Response, _next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Error interno del servidor" });
});

export default app;
