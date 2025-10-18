import React, { useEffect, useState } from "react";
import { useAIStore } from "../store/ai.store";
import axiosInstance from "../utils/axios.js";
import FlashcardGrid from "../components/Flashcard.jsx";

const AIActionPage = () => {
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState("");
    const [currentAction, setCurrentAction] = useState("");

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
        setCurrentAction(action);
        runAIAction(selectedFolder, action);
    };

    const parseFlashcards = (text) => {
        if (!text) return [];

        const flashcardRegex = /(?:Question|Q):\s*(.+?)(?:\n|$)(?:Answer|A):\s*(.+?)(?:\n\n|\n$|$)/gs;
        const matches = [...text.matchAll(flashcardRegex)];

        if (matches.length > 0) {
            return matches.map(match => ({
                question: match[1].trim(),
                answer: match[2].trim()
            }));
        }

        const lines = text.split('\n').filter(line => line.trim());
        const flashcards = [];

        for (let i = 0; i < lines.length - 1; i += 2) {
            if (lines[i] && lines[i + 1]) {
                flashcards.push({
                    question: lines[i].replace(/^[Qq]uestion[:\s]*/, '').trim(),
                    answer: lines[i + 1].replace(/^[Aa]nswer[:\s]*/, '').trim()
                });
            }
        }

        return flashcards.slice(0, 8);
    };

    const parseQuestions = (text) => {
        if (!text) return [];

        const extractIndividualQuestions = (text) => {
            const questions = [];

            const boldQuestionPattern = /\*\*Question\s*\d*[:\s]*\*\*\s*([^*]+?)(?=\*\*Question|\*\*Answer|$)/gi;
            const boldMatches = [...text.matchAll(boldQuestionPattern)];
            if (boldMatches.length > 0) {
                questions.push(...boldMatches.map(match => match[1].trim()));
            }

            const questionPattern = /Question\s*\d*[:\s]+([^?]*\?)/gi;
            const questionMatches = [...text.matchAll(questionPattern)];
            if (questionMatches.length > 0) {
                questions.push(...questionMatches.map(match => match[1].trim()));
            }

            const lines = text.split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.endsWith('?') &&
                    trimmed.length > 20 &&
                    !trimmed.toLowerCase().includes('here are') &&
                    !trimmed.toLowerCase().includes('exam-style') &&
                    !trimmed.toLowerCase().includes('based on') &&
                    !trimmed.toLowerCase().includes('okay') &&
                    !trimmed.toLowerCase().includes('along with')) {
                    questions.push(trimmed);
                }
            }

            return questions;
        };

        let questions = extractIndividualQuestions(text);

        if (questions.length > 0) {
            return questions
                .map(q => {
                    let clean = q.replace(/^(okay|here are|based on|exam-style|along with).*?[:\s]*/i, '');
                    clean = clean.replace(/^\d+\.\s*/, ''); // Remove leading numbers
                    clean = clean.replace(/^\*\*.*?\*\*\s*/, ''); // Remove bold formatting
                    clean = clean.replace(/^Question\s*\d*[:\s]*/, ''); // Remove "Question 1:" prefix
                    return clean.trim();
                })
                .filter(q => q.length > 10 &&
                    !q.toLowerCase().includes('here are') &&
                    !q.toLowerCase().includes('okay') &&
                    !q.toLowerCase().includes('exam-style'))
                .slice(0, 8);
        }

        const createQuestionsFromContent = (items) => {
            return items.map((item) => {
                let cleanText = item.replace(/^\d+\.\s*/, '').trim();

                // Skip if it's too short or contains meta text
                if (cleanText.length < 20 ||
                    cleanText.toLowerCase().includes('here are') ||
                    cleanText.toLowerCase().includes('exam-style') ||
                    cleanText.toLowerCase().includes('based on') ||
                    cleanText.toLowerCase().includes('okay')) {
                    return null;
                }

                if (cleanText.toLowerCase().includes('dijkstra') || cleanText.toLowerCase().includes('algorithm')) {
                    return `Explain how Dijkstra's algorithm works step by step.`;
                }
                if (cleanText.toLowerCase().includes('initialization')) {
                    return `What happens during the initialization phase of the algorithm?`;
                }
                if (cleanText.toLowerCase().includes('priority queue')) {
                    return `How is the priority queue used in this algorithm?`;
                }
                if (cleanText.toLowerCase().includes('distance')) {
                    return `How are distances calculated and updated in the algorithm?`;
                }
                if (cleanText.toLowerCase().includes('adjacency')) {
                    return `What is the role of the adjacency list in this implementation?`;
                }
                if (cleanText.toLowerCase().includes('iterate')) {
                    return `Describe the iteration process and its purpose.`;
                }
                if (cleanText.toLowerCase().includes('compare')) {
                    return `What comparison operations are performed and why?`;
                }
                if (cleanText.toLowerCase().includes('swap')) {
                    return `When and why are elements swapped in this algorithm?`;
                }
                if (cleanText.toLowerCase().includes('sort')) {
                    return `How does the sorting mechanism work in this context?`;
                }
                if (cleanText.toLowerCase().includes('return')) {
                    return `What does the function return and what does it represent?`;
                }

                const firstSentence = cleanText.split('.')[0];
                if (firstSentence.length > 10) {
                    return `Explain: ${firstSentence}`;
                }

                return null;
            }).filter(q => q !== null);
        };

        const numberedPattern = /^\d+\.\s*(.+?)(?=\n\d+\.|$)/gms;
        const matches = [...text.matchAll(numberedPattern)];

        if (matches.length > 0) {
            const items = matches.map(match => match[1].trim()).filter(q => q.length > 10);
            return createQuestionsFromContent(items).slice(0, 8);
        }

        const paragraphs = text.split('\n\n').filter(p => p.trim().length > 20);
        return createQuestionsFromContent(paragraphs).slice(0, 8);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg sm:text-xl">🤖</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">AI Quick Actions</h1>
                    </div>
                    <p className="text-slate-400 text-base sm:text-lg">Transform your notes into interactive study materials</p>
                </div>
                <div className="mb-6 sm:mb-8">
                    <label className="block text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">📁 Select Folder</label>
                    <select
                        value={selectedFolder}
                        onChange={(e) => setSelectedFolder(e.target.value)}
                        className="w-full p-3 sm:p-4 bg-slate-800 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                    >
                        <option value="">-- Choose a folder --</option>
                        {Array.isArray(folders) && folders.map((folder) => (
                            <option key={folder._id} value={folder._id}>
                                {folder.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <ActionCard
                        title="📄 Summarize Notes"
                        description="Transform your notes into a comprehensive, easy-to-read summary with key points highlighted."
                        onClick={() => handleAction("summarize")}
                        color="from-blue-500 to-blue-600"
                        icon="📄"
                        disabled={!selectedFolder}
                    />
                    <ActionCard
                        title="🎴 Generate Flashcards"
                        description="Create interactive flashcards with hover effects. Perfect for memorization and quick review sessions."
                        onClick={() => handleAction("flashcards")}
                        color="from-green-500 to-green-600"
                        icon="🎴"
                        disabled={!selectedFolder}
                    />
                    <ActionCard
                        title="❓ Generate Questions"
                        description="Transform explanations into proper study questions with enhanced formatting and study tips."
                        onClick={() => handleAction("questions")}
                        color="from-purple-500 to-purple-600"
                        icon="❓"
                        disabled={!selectedFolder}
                    />
                </div>

                {(loading || result || error) && (
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 sm:p-6 relative">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
                                {currentAction === 'flashcards' && '🎴 Generated Flashcards'}
                                {currentAction === 'questions' && '❓ Generated Questions'}
                                {currentAction === 'summarize' && '📄 Summary'}
                                {!currentAction && '🤖 AI Result'}
                            </h3>
                            <button
                                className="text-slate-400 hover:text-white transition-colors p-1 sm:p-2 hover:bg-slate-700 rounded-lg"
                                onClick={clearResult}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {loading && (
                            <div className="flex items-center justify-center py-8 sm:py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-purple-500 mx-auto mb-3 sm:mb-4"></div>
                                    <p className="text-slate-300 text-base sm:text-lg">⏳ Processing your request...</p>
                                    <p className="text-slate-500 text-xs sm:text-sm mt-2">This may take a few moments</p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 sm:p-6">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="text-red-400 text-xl sm:text-2xl">⚠️</div>
                                    <div>
                                        <h4 className="text-red-400 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Error Processing Request</h4>
                                        <p className="text-red-300 text-sm sm:text-base">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {result && !loading && (
                            <div>
                                {currentAction === 'flashcards' ? (
                                    <div>
                                        <div className="mb-6">
                                            <p className="text-slate-300 mb-4">
                                                Hover over the cards to flip them and see the answers!
                                            </p>
                                        </div>
                                        <FlashcardGrid flashcards={parseFlashcards(result)} />
                                    </div>
                                ) : currentAction === 'questions' ? (
                                    <div>
                                        <div className="mb-6">
                                            <p className="text-slate-300 mb-4">
                                                Here are the generated questions for your study session:
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            {parseQuestions(result).length > 0 ? parseQuestions(result).map((question, index) => (
                                                <div key={index} className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600 hover:border-slate-500 transition-all duration-200 hover:shadow-lg">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-white text-lg leading-relaxed font-medium mb-2">
                                                                {question}
                                                            </div>
                                                            <div className="flex items-center space-x-4 text-sm text-slate-400">
                                                                <span className="flex items-center space-x-1">
                                                                    <span>📚</span>
                                                                    <span>Study Question</span>
                                                                </span>
                                                                <span className="flex items-center space-x-1">
                                                                    <span>⏱️</span>
                                                                    <span>2-3 min</span>
                                                                </span>
                                                                <span className="flex items-center space-x-1">
                                                                    <span>🎯</span>
                                                                    <span>Medium</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <button className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors" title="Mark as completed">
                                                                ✓
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="text-center py-8">
                                                    <div className="text-4xl mb-4">❓</div>
                                                    <h3 className="text-lg font-semibold text-white mb-2">No Questions Generated</h3>
                                                    <p className="text-slate-400 mb-4">
                                                        The AI response doesn't contain recognizable questions. Try asking for "exam-style questions" specifically.
                                                    </p>
                                                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                                                        <p className="text-slate-300 text-sm">
                                                            <strong>Tip:</strong> Make sure your notes contain clear explanations or ask the AI to generate specific exam questions.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                                            <div className="flex items-center space-x-2 text-slate-300">
                                                <span>💡</span>
                                                <span className="text-sm">
                                                    <strong>Study Tip:</strong> Try to answer each question out loud before checking your notes. This helps reinforce your understanding!
                                                </span>
                                            </div>
                                        </div>
                                        {parseQuestions(result).length === 0 && (
                                            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                                <div className="flex items-start space-x-2">
                                                    <span className="text-yellow-400">⚠️</span>
                                                    <div>
                                                        <h4 className="text-yellow-400 font-semibold mb-2">Debug Info</h4>
                                                        <p className="text-yellow-300 text-sm mb-2">Raw AI Response:</p>
                                                        <div className="bg-slate-900/50 rounded p-3 text-xs text-slate-300 font-mono max-h-32 overflow-y-auto">
                                                            {result.substring(0, 500)}...
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="prose prose-invert max-w-none">
                                        <div className="whitespace-pre-wrap text-slate-200 leading-relaxed text-lg">
                                            {result}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const ActionCard = ({ title, description, onClick, color, icon, disabled }) => {
    return (
        <div
            onClick={disabled ? undefined : onClick}
            className={`cursor-pointer border rounded-xl p-4 sm:p-6 transition-all duration-300 group ${disabled
                ? 'bg-slate-800/30 border-slate-700 cursor-not-allowed opacity-50'
                : `bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 hover:border-slate-600 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20`
                }`}
        >
            <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl sm:text-3xl">{icon}</span>
            </div>
            <h2 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-white group-hover:text-purple-300 transition-colors">{title}</h2>
            <p className="text-slate-400 leading-relaxed text-sm sm:text-base">{description}</p>
            {disabled && (
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                    <p className="text-slate-500 text-xs sm:text-sm flex items-center">
                        <span className="mr-1 sm:mr-2">⚠️</span>
                        Select a folder first
                    </p>
                </div>
            )}
            {!disabled && (
                <div className="mt-3 sm:mt-4 text-slate-500 text-xs sm:text-sm flex items-center group-hover:text-slate-400 transition-colors">
                    <span className="mr-1 sm:mr-2">✨</span>
                    Click to generate
                </div>
            )}
        </div>
    );
};

export default AIActionPage;
