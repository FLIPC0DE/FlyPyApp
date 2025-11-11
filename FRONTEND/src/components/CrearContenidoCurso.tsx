import React, { useState, ChangeEvent } from "react";

interface Module {
  id: number;
  title: string;
  topics: number;
}

interface TopicBlocks {
  text: boolean;
  image: boolean;
  video: boolean;
  slides: boolean;
  audio: boolean;
  playground: boolean;
}

interface Topic {
  title: string;
  availability: string;
  blocks: TopicBlocks;
  prerequisites: string;
  visibility: string;
}

export default function ContentBuilder(): JSX.Element {
  const [modules, setModules] = useState<Module[]>([
    { id: 1, title: "Module 1: Basics", topics: 3 },
    { id: 2, title: "Module 2: Control Flow", topics: 4 },
    { id: 3, title: "Module 3: Functions", topics: 2 },
  ]);

  const [selectedModuleId, setSelectedModuleId] = useState<number>(modules[0].id);

  const [topic, setTopic] = useState<Topic>({
    title: "Loops & Iteration",
    availability: "Opens 2025-10-01",
    blocks: {
      text: true,
      image: false,
      video: false,
      slides: false,
      audio: false,
      playground: true,
    },
    prerequisites: "Variables, Conditionals",
    visibility: "Students enrolled",
  });

  const addModule = (): void => {
    const nextId = modules.length ? Math.max(...modules.map((m) => m.id)) + 1 : 1;
    const newModule: Module = { id: nextId, title: `Module ${nextId}: New`, topics: 0 };
    setModules((prev) => [...prev, newModule]);
    setSelectedModuleId(nextId);
  };

  const toggleBlock = (blockKey: keyof TopicBlocks): void => {
    setTopic((prev) => ({
      ...prev,
      blocks: { ...prev.blocks, [blockKey]: !prev.blocks[blockKey] },
    }));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof Topic
  ): void => {
    setTopic((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const saveTopic = (): void => {
    const enabledBlocks = Object.entries(topic.blocks)
      .filter(([_, v]) => v)
      .map(([k]) => k)
      .join(", ");
    alert(`Tema guardado:\n${topic.title}\nBloques: ${enabledBlocks}`);
  };

  return (
    <div className="min-h-screen p-8 bg-slate-900 text-slate-100">
      <h1 className="text-3xl font-semibold mb-6">Content Builder</h1>

      <div className="grid grid-cols-12 gap-6">
        {/* Left column: Modules */}
        <div className="col-span-4">
          <div className="rounded-lg border border-slate-800 p-6 h-[720px] flex flex-col">
            <h2 className="text-xl font-medium mb-4">Modules</h2>

            <div className="flex-1 space-y-3 overflow-auto pr-2">
              {modules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModuleId(m.id)}
                  className={`w-full text-left p-4 rounded-lg border ${
                    selectedModuleId === m.id
                      ? "border-teal-500 bg-slate-800"
                      : "border-slate-800 hover:border-slate-700"
                  } flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-slate-700 rounded-sm flex items-center justify-center text-sm">
                      {m.id}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{m.title}</div>
                      <div className="text-sm text-slate-400">
                        {m.topics} topics
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-400 text-sm">⋮</div>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={addModule}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-800/90"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 5v14M5 12h14"
                  />
                </svg>
                <span>Add Module</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Topic editor */}
        <div className="col-span-8">
          <div className="rounded-lg border border-slate-800 p-6 h-[720px] flex flex-col">
            <h2 className="text-xl font-medium mb-4">Topic Editor</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                value={topic.title}
                onChange={(e) => handleInputChange(e, "title")}
                className="col-span-1 bg-slate-850 border border-slate-800 rounded-md px-4 py-3"
                placeholder="Topic Title"
              />
              <input
                value={topic.availability}
                onChange={(e) => handleInputChange(e, "availability")}
                className="col-span-1 bg-slate-850 border border-slate-800 rounded-md px-4 py-3"
                placeholder="Availability"
              />
            </div>

            <div className="mb-4">
              <div className="mb-2 text-slate-300 font-medium">
                Content Blocks
              </div>
              <div className="grid gap-3">
                {(
                  [
                    { key: "text", label: "Text" },
                    { key: "image", label: "Image" },
                    { key: "video", label: "Video" },
                    { key: "slides", label: "Slides" },
                    { key: "audio", label: "Audio" },
                    { key: "playground", label: "Python Playground" },
                  ] as const
                ).map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between bg-slate-850 border border-slate-800 rounded-md px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center">
                        {item.label.charAt(0)}
                      </div>
                      <div className="font-medium">{item.label}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={topic.blocks[item.key]}
                          onChange={() => toggleBlock(item.key)}
                        />
                        <div
                          className={`w-10 h-5 rounded-full transition-colors ${
                            topic.blocks[item.key]
                              ? "bg-teal-500"
                              : "bg-slate-700"
                          }`}
                        ></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
              <input
                value={topic.prerequisites}
                onChange={(e) => handleInputChange(e, "prerequisites")}
                className="bg-slate-850 border border-slate-800 rounded-md px-4 py-3"
                placeholder="Prerequisites"
              />
              <input
                value={topic.visibility}
                onChange={(e) => handleInputChange(e, "visibility")}
                className="bg-slate-850 border border-slate-800 rounded-md px-4 py-3"
                placeholder="Visibility"
              />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={saveTopic}
                className="px-5 py-3 rounded-md bg-teal-400 text-slate-900 font-semibold shadow"
              >
                Save Topic
              </button>
              <button
                onClick={() => alert("Preview (placeholder)")}
                className="px-5 py-3 rounded-md bg-slate-800 border border-slate-700"
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
