"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comentario_controller_1 = require("../controllers/comentario.controller");
const router = express_1.default.Router();
router.post("/crear", comentario_controller_1.crearComentario);
router.get("/curso/:idCurso", comentario_controller_1.obtenerComentariosPorCurso);
exports.default = router;
