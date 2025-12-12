"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const modulo_controller_1 = require("../controllers/modulo.controller");
const router = express_1.default.Router();
router.post("/crear", modulo_controller_1.crearModulo);
router.get("/listarModulos/:idCurso", modulo_controller_1.obtenerModulosPorCurso);
router.delete("/eliminar/:idModulo", modulo_controller_1.eliminarModulo);
router.put("/editar/:idModulo", modulo_controller_1.editarModulo);
exports.default = router;
