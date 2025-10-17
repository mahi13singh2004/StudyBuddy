import React, { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useNoteStore } from "../store/note.store.js";
import FolderSidebar from "../components/FolderSidebar.jsx";

const NotesPage = () => {
  const { notes, fetchNotes, createNote, updateNote, deleteNote, loading } = useNoteStore();
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const displayedNotes = selectedFolder
    ? notes.filter((n) => n.folder === selectedFolder)
    : notes;

  const handleCreate = async () => {
    if (!title.trim()) return;
    await createNote(title, content, selectedFolder);
    setTitle("");
    setContent("");
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdate = async () => {
    if (!editingNote) return;
    await updateNote(editingNote._id, title, content, selectedFolder);
    setEditingNote(null);
    setTitle("");
    setContent("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await deleteNote(id);
    }
  };

  const handleDropNoteToFolder = async (targetFolderId) => {
    const draggedNoteId = window.__draggedNoteId;
    if (!draggedNoteId) return;
    const note = notes.find((n) => n._id === draggedNoteId);
    if (!note) return;
    await updateNote(note._id, note.title, note.content, targetFolderId || null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      <div className="relative flex h-screen max-w-7xl mx-auto">
        <FolderSidebar onSelectFolder={setSelectedFolder} onDropNote={handleDropNoteToFolder} activeFolderId={selectedFolder} />

        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-5">
            <h1 className="text-3xl font-semibold tracking-tight">📝 Notes</h1>
            <p className="text-sm text-neutral-400 mt-1">Organize your thoughts. Drag notes into folders.</p>
          </div>

          <div className="mb-6 rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-5 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/40 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_40px_-20px_rgba(0,0,0,0.6)]">
            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-neutral-700/70 bg-neutral-950 px-4 py-3 text-sm outline-none transition focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 placeholder:text-neutral-500 mb-3"
            />

            <div data-color-mode="dark" className="rounded-xl overflow-hidden border border-neutral-800">
              <MDEditor
                value={content}
                onChange={setContent}
                height={240}
              />
            </div>

            {editingNote ? (
              <button
                onClick={handleUpdate}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-sm font-medium text-white transition focus:outline-none"
              >
                Update Note
              </button>
            ) : (
              <button
                onClick={handleCreate}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white transition focus:outline-none disabled:opacity-70"
              >
                Create Note
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-neutral-400">Loading notes...</p>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {displayedNotes.map((note) => (
                <li
                  key={note._id}
                  draggable
                  onDragStart={() => {
                    window.__draggedNoteId = note._id;
                  }}
                  onDragEnd={() => {
                    if (window.__draggedNoteId === note._id) delete window.__draggedNoteId;
                  }}
                  className="rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-4 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/40 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_10px_24px_-16px_rgba(0,0,0,0.6)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_16px_36px_-18px_rgba(0,0,0,0.7)] transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="font-semibold truncate">{note.title}</h2>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(note)}
                        className="rounded-lg bg-yellow-500/20 px-3 py-1 text-yellow-200 text-xs border border-yellow-600/30 hover:bg-yellow-500/30"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="rounded-lg bg-red-500/20 px-3 py-1 text-red-200 text-xs border border-red-600/30 hover:bg-red-500/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 text-neutral-300/90 text-sm leading-relaxed">
                    <MDEditor.Markdown source={note.content || ""} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
