/**import { Router } from 'express';
import { agregarContenido } from '../controllers/contenido.controller';
import { uploadMiddleware } from '../middlewares/multerConfig'; // 👈 Importar el middleware

const router = Router();

// Aplica el middleware ANTES de tu controlador
router.post('/agregarContenido', uploadMiddleware, agregarContenido);

export default router;**/
import { Router } from "express";
import { agregarContenido } from "../controllers/contenido.controller";
import { uploadCloud } from "../middlewares/cloudinaryUpload"; 
// Asegúrate de que 'uploadCloud' sea la instancia de Multer que usa Cloudinary

const router = Router();

// 🛑 Definir los campos que Multer debe esperar
// Necesitamos un array que le diga a Multer que el campo 'blocks[i][file]' 
// puede tener múltiples archivos (maxCount: 100).
// Extendemos esto para los primeros 10 bloques.

const MAX_BLOCKS_TO_HANDLE = 10;
const fieldsToUpload = Array.from({ length: MAX_BLOCKS_TO_HANDLE }, (_, i) => ({
    name: `blocks[${i}][file]`,
    maxCount: 100, // Permite hasta 100 archivos por bloque (imagen, video, etc.)
}));


router.post(
  "/agregarContenido",
  // 🛑 USAR uploadCloud.fields() con el array de campos
  uploadCloud.fields(fieldsToUpload), 
  agregarContenido
);

export default router;
