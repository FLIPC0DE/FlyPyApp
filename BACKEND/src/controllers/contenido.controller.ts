/**import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const agregarContenido = async (req: Request, res: Response) => {
 
  try {
    // 1. Accede directamente a las propiedades parseadas por Multer
    const { id_topico, blocks } = req.body;
    
    // Asegúrate de que blocks es un array (Multer a veces lo pasa como un array de un solo elemento si solo hay uno)
    const contentBlocks = Array.isArray(blocks) ? blocks : [blocks];
     
    // Ya tienes el array de bloques listo
    console.log('tamaño bloque', contentBlocks.length); // ¡Ahora debe ser 1 o más!
    
    const contenidosGuardados = [];
    
    // Obtén los archivos subidos
    const files = req.files as Express.Multer.File[] | undefined; 

    for (let i = 0; i < contentBlocks.length; i++) {
      const block = contentBlocks[i];
      let mediaUrl: string | null = null;
      
      // Buscar el archivo relacionado. El fieldname sigue siendo el índice aplanado.
      if (files && files.length > 0) {
        const fieldName = `blocks[${i}][file]`; // El nombre del campo que enviaste desde el Frontend
        const file = files.find(
          (f) => f.fieldname === fieldName
        );

        if (file) {
          mediaUrl = "/uploads/" + file.filename;
        }
      }
      
      console.log('Bloque a guardar:', block.type, block.content, mediaUrl);
      
      // Crear registro por bloque
      const nuevoContenido = await prisma.contenido.create({
        data: {
          id_topico: Number(id_topico),
          tipo: block.type ?? "texto",
          titulo: block.type ?? "sin título", 
          cuerpo: block.content ?? "",
          mediaUrl
        }
      });

      contenidosGuardados.push(nuevoContenido);
    }

  } catch (error) {
  }
};**/
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Definición de tipo para los archivos subidos por Cloudinary
interface MulterCloudinaryFile extends Express.Multer.File {
  path: string; // Cloudinary guarda la URL final del recurso en 'path'
}

// Interfaz para la estructura del cuerpo (parseada por Multer)
interface ContentBlockBody {
    type: string;
    content: string;
    title: string;
}

// Extender el tipo de Request
interface CustomRequest extends Request {
    body: {
        id_topico: string;
        blocks: ContentBlockBody[];
    }
}

// 🛑 Interfaz para el objeto req.files cuando se usa upload.fields()
interface FieldsFiles {
    [fieldname: string]: MulterCloudinaryFile[] | undefined;
}


export const agregarContenido = async (req: CustomRequest, res: Response) => {
  try {
    const { id_topico, blocks } = req.body;
    
    // Asegurar que blocks sea un array real
    const contentBlocks = Array.isArray(blocks) ? blocks : [blocks];
    
    const contenidosGuardados = [];
    
    // 🛑 1. Obtener los archivos usando el tipo FieldsFiles
    const filesByField = req.files as FieldsFiles | undefined;
    
    for (let i = 0; i < contentBlocks.length; i++) {
      const block = contentBlocks[i];
      
      // 🛑 2. Array para guardar todas las URLs de Cloudinary para este bloque
      const mediaUrls: string[] = []; 
      
      // El valor final que se guarda en la columna mediaUrl de la BD
      let mediaUrl: string | null = null;
      
      const fieldName = `blocks[${i}][file]`;
      
      // 3. Obtener todos los archivos subidos para este bloque específico
      const blockFiles = filesByField?.[fieldName];

      if (blockFiles && blockFiles.length > 0) {
        // 🛑 4. Si hay archivos, mapear todos a sus URLs de Cloudinary
        blockFiles.forEach(file => {
             mediaUrls.push(file.path);
        });
        
        // 🛑 5. Convertir el array de URLs a una cadena JSON para guardarla en la BD
        // Esto es necesario porque mediaUrl en tu BD es un string.
        mediaUrl = JSON.stringify(mediaUrls); 
      }

      // 6. Crear registro en la BD
      const nuevoContenido = await prisma.contenido.create({
        data: {
          id_topico: Number(id_topico),
          tipo: block.type ?? "texto",
          titulo: block.title ?? "sin título",
          cuerpo: block.content ?? "",
          mediaUrl, // mediaUrl ahora es un JSON string o null
        },
      });

      contenidosGuardados.push(nuevoContenido);
    }

    return res.json({
      ok: true,
      mensaje: "Contenido guardado usando Cloudinary (múltiples archivos) correctamente.",
      data: contenidosGuardados,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error al agregar contenido",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};