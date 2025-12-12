"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarTokenMock = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generarTokenMock = (payload = {}) => {
    return jsonwebtoken_1.default.sign({
        userId: 1,
        nombre: "Mocked User",
        rol_global: "ESTUDIANTE",
        ...payload,
    }, "clave-secreta", { expiresIn: "1h" });
};
exports.generarTokenMock = generarTokenMock;
