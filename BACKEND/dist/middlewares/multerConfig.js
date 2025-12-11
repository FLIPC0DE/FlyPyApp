"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configuración de almacenamiento
const storage = multer_1.default.diskStorage({
    // Asegúrate de que esta ruta sea correcta y que la carpeta exista
    destination: (req, file, cb) => {
        // Nota: 'uploads/' es relativo al directorio donde se ejecuta Node.js
        cb(null, path_1.default.join(process.cwd(), "public/uploads")); // Recomendado usar path.join y ruta absoluta
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + path_1.default.extname(file.originalname));
    },
});
// 1. Exporta la instancia de Multer configurada.
const uploadInstance = (0, multer_1.default)({ storage });
// 2. Exporta el middleware que manejará la subida.
// Usamos .any() porque los archivos vienen con diferentes nombres (blocks[i][file]).
exports.uploadMiddleware = uploadInstance.any();
