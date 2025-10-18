import React, { useEffect, useState } from "react";
import { useAIStore } from "../store/ai.store";
import axiosInstance from "../utils/axios.js";

const AIActionPage = () => {
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState("");

    const { loading, result, error, runAIAction, clearResult } = useAIStore();

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const res = await axiosInstance.get(`/api/folders`);
                setFolders(res.data.folders || []);
            } catch (err) {
                console.error("Failed to load folders:", err);
                setFolders([]); 
            }
        };
        fetchFolders();
    }, []);

    const handleAction = (action) => {
        if (!selectedFolder) {
            alert("Please select a folder first");
            return;
        }
        runAIAction(selectedFolder, action);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">🤖 AI Quick Actions</h1>

            <div className="mb-6">
                <label className="block mb-2 font-medium">Select Folder</label>
                <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="w-full p-2 border rounded-md"
                >
                    <option value="">-- Choose a folder --</option>
                    {Array.isArray(folders) && folders.map((folder) => (
                        <option key={folder._id} value={folder._id}>
                            {folder.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ActionCard
                    title="📄 Summarize Notes"
                    description="Summarize all notes inside this folder into a clean overview."
                    onClick={() => handleAction("summarize")}
                />
                <ActionCard
                    title="🧠 Generate Flashcards"
                    description="Create Q&A flashcards from all notes in this folder."
                    onClick={() => handleAction("flashcards")}
                />
                <ActionCard
                    title="📝 Generate Questions"
                    description="Generate exam-style questions from all notes in this folder."
                    onClick={() => handleAction("questions")}
                />
            </div>

            {(loading || result || error) && (
                <div className="mt-8 p-4 border rounded-lg bg-gray-50 relative">
                    <button
                        className="absolute top-2 right-3 text-gray-500 hover:text-black"
                        onClick={clearResult}
                    >
                        ✕
                    </button>

                    {loading && <p className="text-gray-500">⏳ Processing your request...</p>}
                    {error && <p className="text-red-600">{error}</p>}
                    {result && (
                        <div className="whitespace-pre-wrap text-gray-800">
                            {result}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ActionCard = ({ title, description, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="cursor-pointer border rounded-lg p-4 hover:shadow-lg transition bg-white"
        >
            <h2 className="font-semibold text-lg mb-2">{title}</h2>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
};

export default AIActionPage;
