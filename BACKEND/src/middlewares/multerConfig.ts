import multer from "multer";
import path from "path";
import { Request } from "express"; // Importación opcional para tipado

// Configuración de almacenamiento
const storage = multer.diskStorage({
  // Asegúrate de que esta ruta sea correcta y que la carpeta exista
  destination: (req: Request, file: Express.Multer.File, cb) => {
    // Nota: 'uploads/' es relativo al directorio donde se ejecuta Node.js
    cb(null, path.join(process.cwd(), "public/uploads")); // Recomendado usar path.join y ruta absoluta
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// 1. Exporta la instancia de Multer configurada.
const uploadInstance = multer({ storage });

// 2. Exporta el middleware que manejará la subida.
// Usamos .any() porque los archivos vienen con diferentes nombres (blocks[i][file]).
export const uploadMiddleware = uploadInstance.any();