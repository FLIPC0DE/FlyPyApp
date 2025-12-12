import { useState, useEffect } from "react";
import { useCurso } from "@/context/CursoContexto";

type BlockType = "text" | "image" | "video" | "audio" | "slides" | "playground";

interface ContentBlock {
  id: string;
  id_contenido?: number;
  isNew: boolean;
  isEdited: boolean;
  type: BlockType;
  title: string;
  content: string;
  output?: string;
  files: File[] | null;
  mediaUrls: string[];
  mediaUrlsToRemove?: string[]; // <-- Aquí la agregamos
}


export default function ContentBuilder(): JSX.Element {
  const { topicoSeleccionado } = useCurso();
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [pyodide, setPyodide] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (!pyodide) {
        const instance = await (window as any).loadPyodide();
        setPyodide(instance);
      }
    };
    load();
  }, []);

  // Cargar bloques existentes (igual)
  const cargarContenido = async () => {
  if (!topicoSeleccionado) {
    setContentBlocks([]);
    return;
  }

  try {
    const resp = await fetch(
      `http://localhost:3000/api/contenidos/obtenerContenidoPorTopico/${topicoSeleccionado}`
    );

    const data = await resp.json();
    if (!data.ok) return;

    const bloques = data.data.map((b: any) => ({
      id: crypto.randomUUID(),
      id_contenido: b.id,
      isNew: false,
      isEdited: false,
      type: b.type,
      title: b.title || "",
      content: b.content || "",
      files: null,
      mediaUrls: b.media
        ? Array.isArray(b.media)
          ? b.media
          : JSON.parse(b.media)
        : [],
    }));

    setContentBlocks(bloques);
  } catch (err) {
    console.error("Error cargando contenido:", err);
  }
};

// 2️⃣ useEffect solo llama a la función
useEffect(() => {
  cargarContenido();
}, [topicoSeleccionado]);
  // ──────────────────────────────────────────────────────────────
  // Helpers
  // ──────────────────────────────────────────────────────────────
  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      isNew: true,
      isEdited: false,
      type,
      title: "",
      content: "",
      files: null,
      mediaUrls: [],
    };
    setContentBlocks(prev => [...prev, newBlock]);
  };

  const markEditedIfNeeded = (block: ContentBlock, changes: Partial<ContentBlock>) =>
    !block.isNew ? { ...changes, isEdited: true } : changes;

  const updateBlock = (id: string, changes: Partial<ContentBlock>) => {
    setContentBlocks(prev =>
      prev.map(b => (b.id === id ? { ...b, ...markEditedIfNeeded(b, changes) } : b))
    );
  };

  const removeBlockLocal = (id: string) =>
    setContentBlocks(prev => prev.filter(b => b.id !== id));

  const removeBlock = async (id: string) => {
    const block = contentBlocks.find(b => b.id === id);
    if (!block) return;

    if (block.id_contenido) {
      if (!confirm("Eliminar este contenido y sus archivos permanentemente?")) return;

      try {
        const resp = await fetch(`http://localhost:3000/api/contenidos/eliminarContenido/${block.id_contenido}`, { method: "DELETE" });
        const result = await resp.json();
        if (resp.ok) removeBlockLocal(id);
        else alert(result.mensaje || "Error eliminando contenido");
      } catch (err) {
        console.error(err);
        alert("Error de conexión al eliminar contenido");
      }
    } else {
      removeBlockLocal(id);
    }
  };

const removeFileFromBlock = (blockId: string, index: number) => {
  setContentBlocks(prev =>
    prev.map(block => {
      if (block.id === blockId) {
        // Si es un archivo local
        if (block.files && index < (block.files?.length || 0)) {
          const updatedFiles = block.files.filter((_, i) => i !== index);
          return { ...block, files: updatedFiles.length ? updatedFiles : null, ...(block.isNew ? {} : { isEdited: true }) };
        }

        // Si es un archivo existente (Cloudinary)
        if (block.mediaUrls && index < (block.mediaUrls?.length || 0)) {
          const removedUrl = block.mediaUrls[index];
          const updatedMedia = block.mediaUrls.filter((_, i) => i !== index);

          const updatedRemoveList = block.mediaUrlsToRemove
            ? [...block.mediaUrlsToRemove, removedUrl]
            : [removedUrl];

          return { ...block, mediaUrls: updatedMedia, mediaUrlsToRemove: updatedRemoveList, isEdited: true };
        }
      }
      return block;
    })
  );
};


  // ──────────────────────────────────────────────────────────────
  // Guardar contenido (nuevos + editados)
  // ──────────────────────────────────────────────────────────────
  const guardarContenido = async () => {
  if (!topicoSeleccionado) return alert("Selecciona un tópico primero.");

  const nuevos = contentBlocks.filter(b => b.isNew);
  const editados = contentBlocks.filter(b => !b.isNew && b.isEdited);

  // ── Guardar bloques nuevos ──
  if (nuevos.length > 0) {
    const formData = new FormData();
    formData.append("id_topico", String(topicoSeleccionado));

    nuevos.forEach((b, idx) => {
      formData.append(`blocks[${idx}][type]`, b.type);
      formData.append(`blocks[${idx}][title]`, b.title);
      formData.append(`blocks[${idx}][content]`, b.content);

      if (b.files) {
        b.files.forEach(f => {
          formData.append(`blocks[${idx}][file]`, f); // coincidir con backend
        });
      }
    });

    try {
      const resp = await fetch(`http://localhost:3000/api/contenidos/agregarContenido`, {
        method: "POST",
        body: formData,
      });
      const result = await resp.json();
      if (!resp.ok) return alert(result.mensaje || "Error al guardar nuevos bloques");

      // Actualizar estado local
      setContentBlocks(prev =>
        prev.map(p => {
          const nuevo = result.data?.find((d: any) => d.tempId === p.id); // opcional, si envías tempId
          if (p.isNew && nuevo) {
            return {
              ...p,
              isNew: false,
              isEdited: false,
              id_contenido: nuevo.id,
              mediaUrls: nuevo.media ?? [],
              files: null,
            };
          }
          return p;
        })
      );
    } catch (err) {
      console.error(err);
      alert("Error de conexión al guardar nuevos bloques");
    }
  }

  // ── Guardar bloques editados ──
  for (const b of editados) {
    if (!b.id_contenido) continue;

    const formData = new FormData();
    formData.append("type", b.type);
    formData.append("title", b.title);
    formData.append("content", b.content);

    if (b.mediaUrls?.length) formData.append("existingMedia", JSON.stringify(b.mediaUrls));
    if (b.mediaUrlsToRemove?.length) formData.append("mediaUrlsToRemove", JSON.stringify(b.mediaUrlsToRemove));
    if (b.files?.length) b.files.forEach(file => formData.append(`blocks[0][file]`, file));

    try {
      const resp = await fetch(`http://localhost:3000/api/contenidos/editarContenidoPorTopico/${b.id_contenido}`, {
        method: "PUT",
        body: formData,
      });
      const result = await resp.json();
      if (!resp.ok) return alert(result.mensaje || "Error al actualizar bloque");

      setContentBlocks(prev =>
        prev.map(p =>
          p.id_contenido === b.id_contenido
            ? { ...p, isEdited: false, files: null, mediaUrls: result.data?.media ?? p.mediaUrls }
            : p
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error de conexión al actualizar bloque");
    }
  }
  alert("Guardado finalizado!");
  cargarContenido();
};

const runPython = async (code: string, setOutput: (msg: string) => void) => {
  if (!pyodide) {
    setOutput("⏳ Cargando Pyodide...");
    return;
  }

  try {
    let output = "";

    // Redirige stdout y stderr de Pyodide
    pyodide.setStdout({
      batched: (text: string) => {
        output += text;
      }
    });
    pyodide.setStderr({
      batched: (text: string) => {
        output += "Error: " + text;
      }
    });

    // Ejecuta el código Python
    const result = await pyodide.runPythonAsync(code);

    // Si la última expresión tiene resultado, lo agregamos
    if (result !== undefined && result !== null) {
      output += result.toString();
    }

    // Guardar la salida en el estado del bloque
    setOutput(output);

    // Limpiar redirecciones
    pyodide.setStdout({});
    pyodide.setStderr({});
  } catch (err: any) {
    setOutput("❌ Error:\n" + err.toString());
  }
};



  // ──────────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen p-10 bg-slate-900 text-slate-100">
      <h1 className="text-3xl font-semibold mb-6">Contenido</h1>

      <button
        onClick={guardarContenido}
        className="mb-6 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold transition duration-150 cursor-pointer"
      >
        💾 Guardar contenido
      </button>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 border-b border-slate-700 pb-4 mb-6">
        {["text","image","video","audio","slides","playground"].map(type => (
          <button
            key={type}
            onClick={() => addBlock(type as BlockType)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition duration-150 cursor-pointer"
          >
            {type === "text" ? "➕ Texto" :
             type === "image" ? "🖼 Imagen" :
             type === "video" ? "🎥 Video" :
             type === "audio" ? "🎧 Audio" :
             type === "slides" ? "📑 Slides" : "🐍 Playground"}
          </button>
        ))}
      </div>

      {/* Bloques */}
      <div className="space-y-6">
        {contentBlocks.map(block => {
          const fileCount = (block.files?.length || 0) + (block.mediaUrls?.length || 0);
          return (
            <div key={block.id} className="bg-slate-800 border border-slate-700 rounded-lg p-5 shadow-lg">
              <div className="flex justify-between mb-3 items-center">
                <div>
                  <span className="text-xl font-semibold mr-3">Bloque: {block.type}</span>
                  {block.isNew && <span className="text-xs bg-emerald-600 px-2 py-1 rounded ml-2">Nuevo</span>}
                  {!block.isNew && block.isEdited && <span className="text-xs bg-yellow-500 px-2 py-1 rounded ml-2">Editado</span>}
                </div>
                <button onClick={() => removeBlock(block.id)} className="bg-red-600 px-3 py-1 rounded cursor-pointer">✖ Eliminar</button>
              </div>

              <input
                type="text"
                value={block.title}
                placeholder="Título"
                className="w-full bg-slate-900 border border-slate-700 p-2 rounded mb-4"
                onChange={e => updateBlock(block.id, { title: e.target.value })}
              />

              {block.type === "text" && (
                <textarea
                  className="w-full bg-slate-900 border border-slate-700 rounded p-3 h-32"
                  value={block.content}
                  placeholder="Texto..."
                  onChange={e => updateBlock(block.id, { content: e.target.value })}
                />
              )}

              {(block.type === "image" || block.type === "video" || block.type === "audio" || block.type === "slides") && (
                <>
                  <label className="inline-block mb-3 px-4 py-2 bg-slate-700 rounded cursor-pointer">
                    📁 {fileCount} archivo(s)
                    <input
                      type="file"
                      className="hidden"
                      accept={
                        block.type === "image"
                          ? "image/*"
                          : block.type === "video"
                          ? "video/*"
                          : block.type === "audio"
                          ? "audio/*"
                          : ".pdf,.ppt,.pptx"
                      }
                      multiple
                      onChange={e => {
                        const selected = Array.from(e.target.files || []);
                        const existingFiles = block.files || [];
                        updateBlock(block.id, { files: [...existingFiles, ...selected] });
                        e.target.value = "";
                      }}
                    />
                  </label>

                  {/* Preview mediaUrls */}
                  {block.mediaUrls?.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-3">
                      {block.mediaUrls.map((url, idx) => (
                        <div key={idx} className="relative group">
                          {block.type === "image" && <img src={url} className="h-28 rounded border" />}
                          {block.type === "video" && <video controls className="h-40 rounded" src={url} />}
                          {block.type === "audio" && <audio controls src={url} />}
                          {block.type === "slides" && <a href={url} target="_blank" className="underline text-blue-300">{url.split("/").pop()}</a>}
                          <button onClick={() => removeFileFromBlock(block.id, idx)} className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110">✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Preview archivos locales */}
                  {block.files?.length! > 0 && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {block.files?.map((file, idx) => (
                        <div key={idx} className="relative group">
                          {block.type === "image" && <img src={URL.createObjectURL(file)} className="h-28 rounded border" />}
                          {block.type === "video" && <video controls className="h-40 rounded" src={URL.createObjectURL(file)} />}
                          {block.type === "audio" && <audio controls src={URL.createObjectURL(file)} />}
                          {block.type === "slides" && <p className="text-slate-300">{file.name}</p>}
                          <button onClick={() => removeFileFromBlock(block.id, idx)} className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110">✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <textarea
                    className="w-full bg-slate-900 border border-slate-700 rounded p-3 h-24"
                    value={block.content}
                    placeholder="Descripción..."
                    onChange={e => updateBlock(block.id, { content: e.target.value })}
                  />
                </>
              )}

              {block.type === "playground" && (
                <div className="space-y-3">
                  <label className="font-semibold text-lg">🐍 Python Playground</label>

                  {/* Editor */}
                  <textarea
                    className="w-full bg-slate-900 border border-slate-700 rounded p-3 h-40 font-mono"
                    value={block.content}
                    placeholder={`print("Hola Python!")`}
                    onChange={e => updateBlock(block.id, { content: e.target.value })}
                  />

                  {/* Botón ejecutar */}
                  <button
                    onClick={() =>
                      runPython(block.content, msg =>
                        updateBlock(block.id, { output: msg }) // ahora msg es un string
                      )
                    }
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-md font-bold"
                  >
                    ▶ Ejecutar
                  </button>

                  {/* Consola */}
                  <pre className="bg-black text-green-300 p-3 rounded h-32 overflow-auto whitespace-pre-wrap">
                    {block.output || "Salida..."}
                  </pre>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );

}

