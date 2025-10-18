import React, { useState } from 'react';

const Flashcard = ({ question, answer, index }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="flashcard-container perspective-1000"
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <div className={`flashcard-inner transform-style-preserve-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front Side - Question */}
                <div className="flashcard-front absolute inset-0 backface-hidden bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-4 flex flex-col justify-between items-center text-center shadow-xl overflow-hidden">
                    <div className="text-blue-200 text-xs font-semibold mb-2">Question #{index + 1}</div>
                    <div className="text-white text-sm font-medium leading-relaxed flex-1 flex items-center justify-center px-2">
                        <div className="flashcard-text-container break-words hyphens-auto">
                            {question.length > 200 ? (
                                <div className="max-h-full overflow-y-auto">
                                    {question}
                                </div>
                            ) : (
                                question
                            )}
                        </div>
                    </div>
                    <div className="text-blue-200 text-xs mt-2 opacity-80">
                        Hover to see answer
                    </div>
                </div>

                <div className="flashcard-back absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-green-600 to-teal-700 rounded-xl p-4 flex flex-col justify-between items-center text-center shadow-xl overflow-hidden">
                    <div className="text-green-200 text-xs font-semibold mb-2">Answer</div>
                    <div className="text-white text-sm font-medium leading-relaxed flex-1 flex items-center justify-center px-2">
                        <div className="flashcard-text-container break-words hyphens-auto">
                            {answer.length > 200 ? (
                                <div className="max-h-full overflow-y-auto">
                                    {answer}
                                </div>
                            ) : (
                                answer
                            )}
                        </div>
                    </div>
                    <div className="text-green-200 text-xs mt-2 opacity-80">
                        ✓ Correct!
                    </div>
                </div>
            </div>
        </div>
    );
};

const FlashcardGrid = ({ flashcards }) => {
    if (!flashcards || flashcards.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🎴</div>
                <p className="text-slate-400">No flashcards generated yet</p>
                <p className="text-slate-500 text-sm">Generate flashcards from your notes to see them here!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcards.map((card, index) => (
                <div key={index} className="h-72">
                    <Flashcard
                        question={card.question}
                        answer={card.answer}
                        index={index}
                    />
                </div>
            ))}
        </div>
    );
};

export default FlashcardGrid;
