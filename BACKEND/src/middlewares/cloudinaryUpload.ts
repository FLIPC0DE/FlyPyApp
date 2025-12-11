import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { Request } from 'express';
import * as dotenv from 'dotenv';
import path from 'path';

// Cargar .env
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: async (req: Request, file?: Express.Multer.File) => {

    // 🔥 Si NO hay archivo, devolvemos null para evitar el crash
    if (!file) return null as any;

    const folder = "curso-contenidos";
    let resource_type: "image" | "video" | "raw" = "raw";

    if (file.mimetype.startsWith("image")) {
      resource_type = "image";
    } else if (file.mimetype.startsWith("video")) {
      resource_type = "video";
    } else if (file.mimetype.startsWith("audio")) {
      resource_type = "video"; // 🔥 Cloudinary exige "video" para audio
    } else if (
      file.mimetype.includes("pdf") ||
      path.extname(file.originalname).match(/\.(ppt|pptx)$/i)
    ) {
      resource_type = "raw";
    }

    return {
      folder,
      resource_type,
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

export const uploadCloud = multer({ storage });
