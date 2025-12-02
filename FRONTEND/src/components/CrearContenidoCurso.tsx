import React, { useState } from "react";
import { useContext } from "react";
// Asegúrate de que esta importación sea correcta
import { useCurso } from "@/context/CursoContexto"; 

type BlockType = "text" | "image" | "video" | "audio" | "slides" | "playground";

interface ContentBlock {
  id: string;
  type: BlockType;
  content: string; 
  files: File[] | null; 
  title: string; 
}

export default function ContentBuilder(): JSX.Element {
  const { topicoSeleccionado } = useCurso();
  
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);

  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type,
      content: "",
      files: null, // Inicializar con null
      title: "", 
    };
    setContentBlocks((prev) => [...prev, newBlock]);
  };

  const updateBlock = (id: string, changes: Partial<ContentBlock>) => {
    // Estructura de inmutabilidad correcta y revisada
    setContentBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...changes } : b))
    );
  };

  const removeBlock = (id: string) => {
    setContentBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  // 🛑 NUEVA FUNCIÓN: Eliminar un archivo específico de un bloque
  const removeFileFromBlock = (blockId: string, fileIndexToRemove: number) => {
    setContentBlocks((prev) =>
      prev.map((block) => {
        if (block.id === blockId && block.files) {
          // Crear un nuevo array de archivos sin el archivo en el índice especificado
          const updatedFiles = block.files.filter((_, idx) => idx !== fileIndexToRemove);
          // Si no quedan archivos, establecer 'files' en null
          return { ...block, files: updatedFiles.length > 0 ? updatedFiles : null };
        }
        return block;
      })
    );
  };

const guardarContenido = async () => {
  if (!topicoSeleccionado) {
    return alert("Selecciona un tópico primero.");
  }

  const formData = new FormData();
  formData.append("id_topico", topicoSeleccionado.toString());

  contentBlocks.forEach((block, index) => {
    formData.append(`blocks[${index}][title]`, block.title); 
    formData.append(`blocks[${index}][type]`, block.type);
    formData.append(`blocks[${index}][content]`, block.content);

    // Enviar MÚLTIPLES ARCHIVOS: Iterar sobre 'files'
    if (block.files && block.files.length > 0) {
        block.files.forEach((file) => {
             // Usar el campo blocks[i][file] para que Multer lo capture
             formData.append(`blocks[${index}][file]`, file); 
        });
    }
  });

  try {
    const response = await fetch("http://localhost:3000/api/contenidos/agregarContenido", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
        alert("Contenido guardado exitosamente!");
    } else {
        alert(`Error al guardar: ${result.mensaje || 'Error desconocido'}`);
        console.error("Backend Error:", result.error);
    }
  } catch (error) {
      console.error("Fetch Error:", error);
      alert("Error de conexión con el servidor.");
  }
};


  return (
    
    <div className="min-h-screen p-10 bg-slate-900 text-slate-100">
      <h1 className="text-3xl font-semibold mb-6">Contenido</h1>
      <button
          onClick={guardarContenido}
          className="mb-6 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold transition duration-150"
        >
          💾 Guardar contenido en Tópico
        </button>
        
      {/* TOOLBAR (sin cambios) */}
      <div className="flex flex-wrap gap-3 border-b border-slate-700 pb-4 mb-6">
        <button onClick={() => addBlock("text")} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition duration-150">➕ Texto</button>
        <button onClick={() => addBlock("image")} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition duration-150">🖼 Imagen</button>
        <button onClick={() => addBlock("video")} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition duration-150">🎥 Video</button>
        <button onClick={() => addBlock("audio")} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition duration-150">🎧 Audio</button>
        <button onClick={() => addBlock("slides")} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition duration-150">📑 Slides</button>
        <button onClick={() => addBlock("playground")} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition duration-150">🐍 Playground</button>
      </div>

      {/* LISTA DE BLOQUES */}
      <div className="space-y-4">
        {contentBlocks.map((block) => {
          
          // Helper para el display de archivos
          const fileCount = block.files ? block.files.length : 0;
          const fileNameDisplay = fileCount > 0 
            ? `${fileCount} archivo(s) seleccionado(s)`
            : `📁 Seleccionar ${block.type}`;

          return (
          <div
            key={block.id}
            className="bg-slate-800 border border-slate-700 rounded-lg p-5 shadow-lg"
          >
            {/* HEADER DEL BLOQUE */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold capitalize">
                Bloque: **{block.type}**
              </span>

              <button
                onClick={() => removeBlock(block.id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-bold transition duration-150"
              >
                ✖ Eliminar
              </button>
            </div>
            
            {/* CAMPO DE TÍTULO */}
            <div className="mb-4">
                <label htmlFor={`title-${block.id}`} className="block text-sm font-medium text-slate-400 mb-1">
                    Título del Bloque
                </label>
                <input
                    id={`title-${block.id}`}
                    type="text"
                    className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-lg font-semibold placeholder-slate-500"
                    placeholder={`Escribe el título para el contenido de tipo ${block.type}`}
                    value={block.title} 
                    onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                />
            </div>

            {/* CONTENIDO DEL BLOQUE */}
            
            {/* TEXT */}
            {block.type === "text" && (
              <textarea
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 h-32"
                placeholder="Escribe tu texto..."
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              />
            )}
            
            {/* Bloques MULTIMEDIA */}
            {(block.type === "image" || block.type === "video" || block.type === "audio" || block.type === "slides") && (
                <div className="space-y-4">
                    {/* Botón de subida de archivo */}
                    <div className="p-3 border border-slate-700 rounded-md">
                        <label 
                            htmlFor={`file-upload-${block.id}`}
                            className="inline-block px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg cursor-pointer transition duration-150"
                        >
                            {fileNameDisplay}
                        </label>
                        <input
                            id={`file-upload-${block.id}`}
                            type="file"
                            accept={block.type === 'image' ? 'image/*' : block.type === 'video' ? 'video/*' : block.type === 'audio' ? 'audio/*' : '.pdf,.ppt,.pptx'}
                            multiple={block.type === 'image'} // Solo 'multiple' para imágenes
                            className="hidden"
                            onChange={(e) => {
                                const selectedFiles = Array.from(e.target.files || []);
                                const existingFiles = block.files || [];

                                let newFiles: File[] | null;
                                
                                if (block.type === 'image') {
                                    newFiles = [...existingFiles, ...selectedFiles];
                                } else {
                                    // Para otros tipos, se reemplaza el archivo
                                    newFiles = selectedFiles.length > 0 ? [selectedFiles[0]] : null;
                                }

                                updateBlock(block.id, { files: newFiles }); 
                                e.target.value = ''; // Limpiar el input para permitir subir el mismo archivo de nuevo
                            }}
                        />
                        
                        {/* PREVISUALIZACIÓN Y BOTÓN DE ELIMINAR (Solo para IMAGEN) */}
                        {block.type === 'image' && block.files && block.files.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-3">
                                {block.files.map((file, idx) => (
                                    <div key={idx} className="relative group">
                                        <img 
                                            src={URL.createObjectURL(file)} 
                                            className="max-h-24 w-auto rounded-md object-cover border border-slate-600" 
                                            alt={`Preview ${idx + 1}`} 
                                        />
                                        {/* 🛑 BOTÓN DE ELIMINAR */}
                                        <button
                                            onClick={() => removeFileFromBlock(block.id, idx)}
                                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                            title="Eliminar imagen"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* PREVISUALIZACIÓN ÚNICA (Video, Audio, Slides) */}
                        {block.type !== 'image' && block.files && block.files.length > 0 && (
                            <div className="mt-4">
                                {block.type === "video" && (<video controls className="max-h-60 rounded-md" src={URL.createObjectURL(block.files[0])} />)}
                                {block.type === "audio" && (<audio controls src={URL.createObjectURL(block.files[0])} className="w-full" />)}
                                {block.type === "slides" && (<p className="text-slate-300">Archivo cargado: **{block.files[0].name}**</p>)}
                            </div>
                        )}
                    </div>
                    
                    {/* Textarea de descripción (Cuerpo) */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Cuerpo / Descripción</h3>
                        <textarea
                            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 h-24"
                            placeholder={`Escribe la descripción o cuerpo para este ${block.type}...`}
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        />
                    </div>
                </div>
            )}

            {/* PLAYGROUND */}
            {block.type === "playground" && (
              <textarea
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 font-mono h-40"
                placeholder="Escribe tu código Python..."
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              />
            )}
          </div>
        )})}
      </div>
    </div>
  );
}