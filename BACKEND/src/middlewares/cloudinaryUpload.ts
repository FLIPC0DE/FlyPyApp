import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { Request } from 'express'; // Importación para tipado
import * as dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno (si no lo haces globalmente)
dotenv.config(); 

// Configuración de Cloudinary
// ASEGÚRATE DE QUE ESTAS VARIABLES ESTÉN EN TU .env y sean CORRECTAS
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración del Storage Engine de Multer para Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  // Tipado explícito para evitar errores de TypeScript (ts(7006))
  params: async (req: Request, file: Express.Multer.File) => { 
    const folder = 'curso-contenidos'; 
    let resource_type: "image" | "video" | "raw" = "raw";

    // Determinar el tipo de recurso basado en MIME type
    if (file.mimetype.startsWith('image')) {
      resource_type = 'image';
    } else if (file.mimetype.startsWith('video')) {
      resource_type = 'video';
    } else if (file.mimetype.startsWith('audio')) {
      // Audio también se sube a veces como 'raw' o 'video', 
      // si falla, puedes forzar 'raw' aquí.
      resource_type = 'raw'; 
    } else if (file.mimetype.includes('pdf') || path.extname(file.originalname).match(/\.(ppt|pptx)$/i)) {
      // PDF o PPTX (Slides) se suben como 'raw'
      resource_type = 'raw';
    }

    return {
      folder: folder,
      resource_type: resource_type,
      // Usar el nombre de campo para evitar colisiones y un ID único
      public_id: file.fieldname + '-' + Date.now(), 
    };
  },
});

// Exportamos Multer con .any() para manejar múltiples archivos con diferentes fieldnames
export const uploadCloud = multer({ storage: storage });