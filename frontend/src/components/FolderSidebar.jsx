import React, { useEffect, useState } from "react";
import { useFolderStore } from "../store/folder.store.js";
import Spinner from "./Spinner.jsx";

const FolderSidebar = ({ onSelectFolder, onDropNote, activeFolderId }) => {
  const { folders, fetchFolders, createFolder, deleteFolder, loading } = useFolderStore();
  const [name, setName] = useState("");

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createFolder(name);
    setName("");
  };

  return (
    <div className="w-full lg:w-64 h-auto lg:h-screen p-3 sm:p-4 flex flex-col border-b lg:border-b-0 lg:border-r border-neutral-800/70 bg-neutral-950/30">
      <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-neutral-200">📁 Folders</h2>

      <form onSubmit={handleCreate} className="mb-3 sm:mb-4 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New folder"
          className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-neutral-200 placeholder:text-neutral-500 outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
        />
        <button type="submit" className="rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-white">
          +
        </button>
      </form>

      {loading ? (
        <div className="flex items-center space-x-2 text-neutral-400 text-xs sm:text-sm">
          <Spinner size="sm" color="slate" />
          <span>Loading folders...</span>
        </div>
      ) : (
        <ul className="space-y-1 overflow-y-auto">
          <li
            onClick={() => onSelectFolder(null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (onDropNote) onDropNote(null);
            }}
            className={`cursor-pointer rounded-lg px-2 py-1 sm:py-2 text-xs sm:text-sm transition border border-transparent ${activeFolderId === null ? 'bg-neutral-900/70 border-neutral-800' : 'hover:bg-neutral-900/40'}`}
          >
            📝 All Notes
          </li>
          {folders.map((folder) => (
            <li
              key={folder._id}
              onClick={() => onSelectFolder(folder._id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (onDropNote) onDropNote(folder._id);
              }}
              className={`group cursor-pointer rounded-lg px-2 py-1 sm:py-2 text-xs sm:text-sm transition border border-transparent ${activeFolderId === folder._id ? 'bg-neutral-900/70 border-neutral-800' : 'hover:bg-neutral-900/40'}`}
            >
              <div className="flex items-center justify-between gap-1 sm:gap-2">
                <span className="truncate">{folder.name}</span>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    const ok = window.confirm('Delete this folder? Notes will remain but be unassigned.');
                    if (!ok) return;
                    await deleteFolder(folder._id);
                    if (activeFolderId === folder._id) onSelectFolder(null);
                  }}
                  className="opacity-0 group-hover:opacity-100 rounded-md bg-red-500/20 px-1 sm:px-2 py-0.5 sm:py-1 text-xs text-red-200 border border-red-600/30 hover:bg-red-500/30 transition"
                  title="Delete folder"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FolderSidebar;
