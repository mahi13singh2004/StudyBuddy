import React, { useEffect, useState } from "react";
import { usePDFChatStore } from "../store/pdf.store.js";

const PDFChatPage = () => {
  const {
    uploadedPDFs,
    selectedPDF,
    chatHistory,
    loading,
    error,
    fetchPDFs,
    uploadPDF,
    selectPDF,
    sendMessage,
    clearChat,
  } = usePDFChatStore();

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPDFs();
  }, [fetchPDFs]);

  const handleUpload = () => {
    if (!file) return alert("Select a PDF first");
    uploadPDF(file);
    setFile(null);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-16">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">📄</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">PDF AI Chat</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">📤 Upload PDF</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="flex-1 p-2 sm:p-3 bg-slate-700 border border-slate-600 rounded-lg text-white file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 text-sm sm:text-base"
            />
            <button
              onClick={handleUpload}
              disabled={!file}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              Upload PDF
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">📚 Your PDFs</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {uploadedPDFs.map((pdf) => (
              <button
                key={pdf._id}
                onClick={() => selectPDF(pdf)}
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg border transition-all text-sm sm:text-base ${selectedPDF?._id === pdf._id
                  ? "bg-green-600 text-white border-green-500"
                  : "bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600"
                  }`}
              >
                {pdf.title}
              </button>
            ))}
          </div>
        </div>

        {selectedPDF && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                💬 Chatting with: {selectedPDF.title}
              </h3>
              <button
                onClick={clearChat}
                className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
              >
                Clear Chat
              </button>
            </div>

            <div className="h-64 sm:h-96 overflow-y-auto border border-slate-600 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 bg-slate-900/50">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-3 sm:mb-4 p-2 sm:p-3 rounded-lg max-w-full sm:max-w-3xl ${msg.role === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-slate-700 text-slate-200 mr-auto"
                    }`}
                >
                  <div className="font-semibold text-xs sm:text-sm mb-1">
                    {msg.role === "user" ? "You" : "AI Assistant"}
                  </div>
                  <div className="whitespace-pre-wrap text-sm sm:text-base">{msg.content}</div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center space-x-2 text-slate-400">
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-green-500"></div>
                  <span className="text-sm sm:text-base">AI is typing...</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your question about the PDF..."
                className="flex-1 p-2 sm:p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm sm:text-base">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFChatPage;
