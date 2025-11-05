import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";

import authRouter from "./routes/auth.routes";
import usuarioRouter from "./routes/usuario.routes";
import oauthRouter from "./routes/oauth.routes";
import verificacionRouter from "./routes/verificacion.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("PyFly backend funcionando 🚀");
});

app.use("/api/auth", authRouter);
app.use("/api/verificacion", verificacionRouter);
app.use("/api/usuarios", usuarioRouter);
app.use("/api/oauth", oauthRouter);

app.use((req, res) => res.status(404).json({ error: "No encontrado" }));

type ErrorWithStatus = Error & { status?: number };

app.use((err: unknown, _req: Request, res: Response, _next: unknown) => {
  void _next;

  const message = err instanceof Error ? err.message : "Error interno del servidor";
  const status = err instanceof Error && "status" in err
    ? (err as ErrorWithStatus).status ?? 500
    : 500;

  console.error("❌ Error global:", message);
  res.status(status).json({ error: message });
});

export default app;
