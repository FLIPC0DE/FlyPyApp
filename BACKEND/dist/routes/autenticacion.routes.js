"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const autenticacion_controller_js_1 = require("../controllers/autenticacion.controller.js");
const router = express_1.default.Router();
router.post("/iniciarSesion", autenticacion_controller_js_1.iniciarSesion);
exports.default = router;
