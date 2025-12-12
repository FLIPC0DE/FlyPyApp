"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const usuario_routes_1 = __importDefault(require("./routes/usuario.routes"));
const oauth_routes_1 = __importDefault(require("./routes/oauth.routes"));
const verificacion_routes_1 = __importDefault(require("./routes/verificacion.routes"));
const registroCurso_routes_1 = __importDefault(require("./routes/registroCurso.routes"));
const comentario_routes_1 = __importDefault(require("./routes/comentario.routes"));
const modulo_routes_1 = __importDefault(require("./routes/modulo.routes"));
const topico_routes_1 = __importDefault(require("./routes/topico.routes"));
const contenido_routes_1 = __importDefault(require("./routes/contenido.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.send("PyFly backend funcionando 🚀");
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/verificacion", verificacion_routes_1.default);
app.use("/api/usuarios", usuario_routes_1.default);
app.use("/api/oauth", oauth_routes_1.default);
app.use("/api/cursos", registroCurso_routes_1.default);
app.use("/api/comentarios", comentario_routes_1.default);
app.use("/api/modulos", modulo_routes_1.default);
app.use("/api/topicos", topico_routes_1.default);
app.use("/api/contenidos", contenido_routes_1.default);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res) => res.status(404).json({ error: "No encontrado" }));
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || "Error interno del servidor" });
});
exports.default = app;
