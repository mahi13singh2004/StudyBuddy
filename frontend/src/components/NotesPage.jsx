import React, { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useNoteStore } from "../store/note.store.js";
import FolderSidebar from "../components/FolderSidebar.jsx";
import Spinner from "./Spinner.jsx";

const NotesPage = () => {
  const { notes, fetchNotes, createNote, updateNote, deleteNote, loading } = useNoteStore();
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const displayedNotes = selectedFolder
    ? notes.filter((n) => n.folder === selectedFolder)
    : notes;

  // Filter notes by search query
  const filteredNotes = displayedNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async () => {
    if (!title.trim()) return;
    await createNote(title, content, selectedFolder);
    setTitle("");
    setContent("");
    setShowCreateForm(false);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setShowCreateForm(true);
  };

  const handleUpdate = async () => {
    if (!editingNote) return;
    await updateNote(editingNote._id, title, content, selectedFolder);
    setEditingNote(null);
    setTitle("");
    setContent("");
    setShowCreateForm(false);
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

  const cancelEdit = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-16">
      <div className="flex flex-col lg:flex-row h-screen max-w-7xl mx-auto">
        <div className="lg:w-64 flex-shrink-0">
          <FolderSidebar onSelectFolder={setSelectedFolder} onDropNote={handleDropNoteToFolder} activeFolderId={selectedFolder} />
        </div>

        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
                  <span className="mr-2 sm:mr-3">📝</span>
                  Notes
                </h1>
                <p className="text-slate-400 mt-1 text-sm sm:text-base">
                  {selectedFolder ? `Notes in selected folder` : `All notes (${filteredNotes.length})`}
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>+</span>
                <span className="text-sm sm:text-base">New Note</span>
              </button>
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 sm:py-3 pl-10 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                🔍
              </div>
            </div>
          </div>

          {showCreateForm && (
            <div className="mb-4 sm:mb-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  {editingNote ? 'Edit Note' : 'Create New Note'}
                </h3>
                <button
                  onClick={cancelEdit}
                  className="text-slate-400 hover:text-white transition-colors text-lg"
                >
                  ✕
                </button>
              </div>

              <input
                type="text"
                placeholder="Note title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-4 text-sm sm:text-base"
              />

              <div data-color-mode="dark" className="rounded-lg overflow-hidden border border-slate-600 mb-4">
                <MDEditor
                  value={content}
                  onChange={setContent}
                  height={150}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {editingNote ? (
                  <button
                    onClick={handleUpdate}
                    className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-sm sm:text-base"
                  >
                    Update Note
                  </button>
                ) : (
                  <button
                    onClick={handleCreate}
                    className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm sm:text-base"
                  >
                    Create Note
                  </button>
                )}
                <button
                  onClick={cancelEdit}
                  className="px-3 sm:px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all duration-200 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="text-center">
                <Spinner size="lg" color="blue" className="mx-auto mb-3 sm:mb-4" />
                <p className="text-slate-300 text-sm sm:text-base">Loading notes...</p>
              </div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📝</div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                {searchQuery ? 'No notes found' : 'No notes yet'}
              </h3>
              <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base px-4">
                {searchQuery ? 'Try adjusting your search terms' : 'Create your first note to get started'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm sm:text-base"
                >
                  Create First Note
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredNotes.map((note) => (
                <div
                  key={note._id}
                  draggable
                  onDragStart={() => {
                    window.__draggedNoteId = note._id;
                  }}
                  onDragEnd={() => {
                    if (window.__draggedNoteId === note._id) delete window.__draggedNoteId;
                  }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-3 sm:p-4 hover:bg-slate-800/70 hover:border-slate-600 transition-all duration-200 hover:scale-105 hover:shadow-lg group"
                >
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <h3 className="font-semibold text-white text-base sm:text-lg truncate flex-1 mr-2">
                      {note.title}
                    </h3>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(note)}
                        className="p-1 sm:p-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors"
                        title="Edit note"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="p-1 sm:p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                        title="Delete note"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-4">
                    <MDEditor.Markdown source={note.content || ""} />
                  </div>

                  <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-700">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>
                        {note.content ? `${note.content.length} characters` : 'Empty note'}
                      </span>
                      <span>
                        {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
