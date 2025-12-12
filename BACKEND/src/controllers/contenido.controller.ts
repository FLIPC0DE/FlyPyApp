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
import { v2 as cloudinary } from "cloudinary";

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
    const files = req.files as MulterCloudinaryFile[] | undefined;

    // Aseguramos que blocks sea un array
    const contentBlocks = Array.isArray(blocks) ? blocks : [blocks];
    const contenidosGuardados = [];

    for (let i = 0; i < contentBlocks.length; i++) {
      const block = contentBlocks[i];

      // Filtrar archivos que pertenecen a este bloque
      const blockFiles = files?.filter(f => f.fieldname === `blocks[${i}][file]`) ?? [];
      const mediaUrls = blockFiles.map(f => f.path);
      const mediaUrl = mediaUrls.length ? JSON.stringify(mediaUrls) : null;

      const nuevoContenido = await prisma.contenido.create({
        data: {
          id_topico: Number(id_topico),
          tipo: block.type ?? "texto",
          titulo: block.title ?? "sin título",
          cuerpo: block.content ?? "",
          mediaUrl,
        },
      });

      contenidosGuardados.push(nuevoContenido);
    }

    return res.json({
      ok: true,
      mensaje: "Contenido guardado correctamente.",
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


export const obtenerContenidosPorTopico = async (req: Request, res: Response) => {
  try {
    const { id_topico } = req.params;

    if (!id_topico) {
      return res.status(400).json({
        ok: false,
        mensaje: "El id_topico es requerido."
      });
    }

    const contenidos = await prisma.contenido.findMany({
      where: {
        id_topico: Number(id_topico),
      },
      orderBy: {
        id_contenido: "asc",
      }
    });

    const resultados = contenidos.map((c) => {
      
      let media: string[] = [];

      if (c.mediaUrl) {
        try {
          const parsed = JSON.parse(c.mediaUrl);

          if (Array.isArray(parsed)) {
            media = parsed;
          } else {
            media = [c.mediaUrl];
          }

        } catch {
          media = [c.mediaUrl];
        }
      }

      return {
        id: c.id_contenido,
        type: c.tipo,
        title: c.titulo,
        content: c.cuerpo,
        media,
      };
    });

    return res.json({
      ok: true,
      data: resultados,
    });

  } catch (error) {
    console.error("Error al obtener contenidos:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error al obtener contenidos por tópico",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};

// export const editarContenido = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { type, title, content, media } = req.body;

//     const actualizado = await prisma.contenido.update({
//       where: { id_contenido: Number(id) },
//       data: {
//         tipo: type,
//         titulo: title,
//         cuerpo: content,
//         mediaUrl: JSON.stringify(media),
//       },
//     });

//     return res.json({ ok: true, data: actualizado });

//   } catch (error) {
//     console.error("Error al editar:", error);
//     return res.status(500).json({ ok: false, mensaje: "Error al editar contenido" });
//   }
// };


// Función para obtener public_id desde la URL de Cloudinary
function obtenerPublicIdDeUrl(url: string): string | null {
  try {
    // Ej: https://res.cloudinary.com/demo/image/upload/v1699999999/folder/archivo.jpg
    const parts = url.split("/");
    const filename = parts[parts.length - 1]; // archivo.jpg
    const publicId = filename.split(".")[0]; // archivo
    // Si usas carpetas en Cloudinary, debes reconstruir la ruta completa relativa a la carpeta
    const folderPath = parts.slice(parts.indexOf("upload") + 1, parts.length - 1).join("/");
    return folderPath ? `${folderPath}/${publicId}` : publicId;
  } catch (e) {
    console.error("Error al extraer public_id:", e);
    return null;
  }
}

export const editarContenido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, title, content, existingMedia, mediaUrlsToRemove } = req.body;

    // Parsear arrays
    const existingMediaArr: string[] = existingMedia
      ? Array.isArray(existingMedia)
        ? existingMedia
        : JSON.parse(existingMedia)
      : [];

    const mediaToRemoveArr: string[] = mediaUrlsToRemove
      ? Array.isArray(mediaUrlsToRemove)
        ? mediaUrlsToRemove
        : JSON.parse(mediaUrlsToRemove)
      : [];

    // Archivos nuevos enviados vía Multer
    const files = req.files as Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined;

    let newMediaUrls: string[] = [];
    if (Array.isArray(files)) {
      newMediaUrls = files.map(f => (f as any).path);
    } else if (files && typeof files === "object") {
      for (const key in files) {
        newMediaUrls.push(...files[key].map(f => (f as any).path));
      }
    }

    // Eliminar archivos removidos de Cloudinary
    for (const url of mediaToRemoveArr) {
      const publicId = obtenerPublicIdDeUrl(url);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Combinar archivos existentes + nuevos
    const finalMedia = [...existingMediaArr, ...newMediaUrls];

    // Guardar en BD
    const actualizado = await prisma.contenido.update({
      where: { id_contenido: Number(id) },
      data: {
        tipo: type,
        titulo: title,
        cuerpo: content,
        mediaUrl: finalMedia.length > 0 ? JSON.stringify(finalMedia) : null,
      },
    });

    return res.json({ ok: true, data: actualizado, mensaje: "Contenido actualizado correctamente" });
  } catch (error) {
    console.error("Error al editar contenido:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error al editar contenido",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};



export const eliminarContenido = async (req: Request, res: Response) => {
  try {
    const { id_contenido } = req.params;

    if (!id_contenido) {
      return res.status(400).json({ ok: false, mensaje: "id_contenido requerido" });
    }

    // Antes de eliminar, obtener mediaUrl y eliminar archivos en Cloudinary
    const contenido = await prisma.contenido.findUnique({
      where: { id_contenido: Number(id_contenido) },
    });

    if (contenido?.mediaUrl) {
      try {
        const mediaArr: string[] = Array.isArray(contenido.mediaUrl)
          ? contenido.mediaUrl
          : JSON.parse(contenido.mediaUrl);

        for (const url of mediaArr) {
          const publicId = obtenerPublicIdDeUrl(url);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        }
      } catch (err) {
        console.error("Error eliminando archivos de Cloudinary antes de borrar contenido:", err);
      }
    }

    const deleted = await prisma.contenido.delete({
      where: { id_contenido: Number(id_contenido) },
    });

    return res.json({ ok: true, mensaje: "Contenido eliminado", data: deleted });
  } catch (error) {
    console.error("Error eliminando contenido:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error eliminando contenido",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
};




