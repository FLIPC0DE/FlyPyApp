"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**import { Router } from 'express';
import { agregarContenido } from '../controllers/contenido.controller';
import { uploadMiddleware } from '../middlewares/multerConfig'; // 👈 Importar el middleware

const router = Router();

// Aplica el middleware ANTES de tu controlador
router.post('/agregarContenido', uploadMiddleware, agregarContenido);

export default router;**/
const express_1 = require("express");
const contenido_controller_1 = require("../controllers/contenido.controller");
const cloudinaryUpload_1 = require("../middlewares/cloudinaryUpload");
// Asegúrate de que 'uploadCloud' sea la instancia de Multer que usa Cloudinary
const router = (0, express_1.Router)();
// 🛑 Definir los campos que Multer debe esperar
// Necesitamos un array que le diga a Multer que el campo 'blocks[i][file]' 
// puede tener múltiples archivos (maxCount: 100).
// Extendemos esto para los primeros 10 bloques.
const MAX_BLOCKS_TO_HANDLE = 20; // o el número máximo de bloques que esperas
const fieldsToUpload = Array.from({ length: MAX_BLOCKS_TO_HANDLE }, (_, i) => ({
    name: `blocks[${i}][file]`,
    maxCount: 100,
}));
router.post("/agregarContenido", cloudinaryUpload_1.uploadCloud.any(), // <- permite cualquier campo de archivo
contenido_controller_1.agregarContenido);
router.get("/obtenerContenidoPorTopico/:id_topico", contenido_controller_1.obtenerContenidosPorTopico);
router.put("/editarContenidoPorTopico/:id", cloudinaryUpload_1.uploadCloud.any(), contenido_controller_1.editarContenido);
router.delete("/eliminarContenido/:id_contenido", contenido_controller_1.eliminarContenido);
exports.default = router;
