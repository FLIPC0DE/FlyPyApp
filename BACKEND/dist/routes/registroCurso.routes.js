"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registroCurso_controller_1 = require("../controllers/registroCurso.controller");
const router = express_1.default.Router();
router.post("/registrarCurso", registroCurso_controller_1.registrarCurso);
router.get("/listarCursos", registroCurso_controller_1.obtenerCursos); // 👈 Nueva ruta
exports.default = router;
