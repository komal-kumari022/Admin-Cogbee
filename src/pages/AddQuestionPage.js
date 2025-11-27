import React, { useState, useMemo } from 'react';
import CreateQuestionModal from './CreateQuestionModal';

// --- Dedicated Bulk Upload View Component (Kept for completeness) ---
const BulkUploadView = () => {
    return (
        <div className="flex flex-col items-center justify-center pt-10 pb-20 px-4 bg-gray-50 min-h-[calc(100vh-100px)]">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-semibold text-gray-800 mb-2">Bulk Upload Questions</h2>
                <p className="text-gray-500 text-lg">Upload a **CSV** or **Excel** file with your questions</p>
            </div>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-16 rounded-lg w-full max-w-2xl bg-white cursor-pointer hover:border-blue-500 transition duration-150 shadow-sm">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="mt-4 text-sm text-gray-700 font-medium">
                    **Drop your file here or click to browse**
                </p>
                <p className="mt-1 text-xs text-gray-500">
                    Supports CSV, XLSX files
                </p>
            </div>
            <div className="mt-8 text-sm p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-md max-w-2xl w-full">
                <p className="font-semibold mb-1">File format:</p>
                <p>Your file should include columns for **Question Text**, **Type**, **Difficulty**, **Points**, and **Options** (for MCQ).</p>
            </div>
        </div>
    );
};
// -----------------------------------------------------------------


const AddQuestionPage = ({ skillName = 'js.java', onBack = () => alert('Back clicked') }) => {

    const [questions, setQuestions] = useState([]);
    const [currentView, setCurrentView] = useState('default');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    // When true, the create form will render as a full-page view instead of a centered popup
    const [modalFullPage, setModalFullPage] = useState(false);
    
    // ⭐ NEW STATE: Stores questions added to the right panel (the test)
    const [selectedQuestions, setSelectedQuestions] = useState([]);


    // --- Selection and Scoring Calculations ---
    const totalPoints = useMemo(() => {
        return selectedQuestions.reduce((sum, q) => sum + (q.questionScore || 0), 0);
    }, [selectedQuestions]);

    const selectedQuestionsCount = selectedQuestions.length;


    // ⭐ NEW HANDLER: Adds or removes a question from the selectedQuestions array
    const handleQuestionSelection = (question, isChecked) => {
        if (isChecked) {
            // Add question to selected list if it's not already there
            setSelectedQuestions(prevSelected => {
                if (!prevSelected.find(q => q.id === question.id)) {
                    return [...prevSelected, question];
                }
                return prevSelected;
            });
        } else {
            // Remove question from selected list
            setSelectedQuestions(prevSelected => 
                prevSelected.filter(q => q.id !== question.id)
            );
        }
    };

    // ⭐ NEW HANDLER: Remove a question item directly from the selected list (e.g., using the 'X' button on the right panel)
    const handleRemoveSelectedQuestion = (questionId) => {
        setSelectedQuestions(prevSelected => 
            prevSelected.filter(q => q.id !== questionId)
        );
    };


    // --- CRUD Handlers (Existing, with minor update for selection) ---
    const handleEditQuestion = (question) => {
        setEditingQuestion(question);
        // Open edit in full-page mode as requested
        setModalFullPage(true);
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        setEditingQuestion(null); 
        setShowCreateModal(false);
        setModalFullPage(false);
    };

    const openCreateModal = () => {
        setEditingQuestion(null);
        // When creating new, open as full-page
        setModalFullPage(true);
        setShowCreateModal(true);
    };

    const handleQuestionCreatedOrUpdated = (updatedQuestion) => {
        if (updatedQuestion.id) {
            // Update logic: Find and replace the existing question
            setQuestions(prevQuestions =>
                prevQuestions.map(q => (q.id === updatedQuestion.id ? updatedQuestion : q))
            );
            // ⭐ Important: If the question was selected, update it in the selected list too
            setSelectedQuestions(prevSelected => 
                prevSelected.map(q => (q.id === updatedQuestion.id ? updatedQuestion : q))
            );
        } else {
            // Creation logic: Add a new question
            const newQuestionWithId = { ...updatedQuestion, id: Date.now() };
            setQuestions(prevQuestions => [newQuestionWithId, ...prevQuestions]); 
        }
        
        closeCreateModal(); 
    };
    // -----------------------------------------------------------


    // --- Component Definitions ---

    // Renders a single question item in the question bank (Left Panel)
    const QuestionItem = ({ question }) => {
        // Determine if the checkbox should be checked based on the selectedQuestions state
        const isSelected = selectedQuestions.some(q => q.id === question.id);

        return (
            <div className="flex justify-between items-center p-3 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition mb-2">
                <div className="flex items-center space-x-3">
                    <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={(e) => handleQuestionSelection(question, e.target.checked)} // ⭐ Selection handler
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded" 
                    />
                    <div>
                        <p className="text-sm font-medium text-gray-900">{question.questionName}</p>
                        <div className="flex space-x-2 text-xs text-gray-500 mt-1">
                            <span className="bg-gray-200 px-2 py-0.5 rounded">{question.questionType.substring(0, 3).toUpperCase()}</span>
                            <span className="bg-gray-200 px-2 py-0.5 rounded">{question.difficulty}</span>
                            <span className="text-gray-700">{question.questionScore} pts</span>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                    <button title="Edit" onClick={() => handleEditQuestion(question)} className="text-blue-600 hover:text-blue-800 p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button title="Delete" className="text-red-600 hover:text-red-800 p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </div>
        );
    };

    // ⭐ NEW COMPONENT: Renders a selected question item (Right Panel)
const SelectedQuestionItem = ({ question }) => (
    <div className="p-3 border border-blue-400 rounded-md bg-blue-50 mb-3 relative">
        <button 
            onClick={() => handleRemoveSelectedQuestion(question.id)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition"
            title="Remove from test"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>

        <div className="flex items-start space-x-2 pr-6">
            <input type="checkbox" checked disabled className="h-4 w-4 mt-1 text-blue-600 border-blue-300 rounded" />

            <div className="w-full">
                {/* Question Title */}
                <p className="text-sm font-medium text-gray-900 mb-2">
                    {question.questionName}
                </p>

                {/* Vertical Details Section */}
                <div className="flex flex-col space-y-2 text-xs text-gray-600">

                    {/* Tags row */}
                    <div className="flex space-x-2">
                        <span className="bg-blue-200 px-2 py-0.5 rounded font-semibold">
                            {question.questionType.substring(0, 3).toUpperCase()}
                        </span>

                        <span className="bg-blue-100 px-2 py-0.5 rounded">
                            {question.difficulty}
                        </span>
                    </div>

                    {/* Points row */}
                    <div className="flex items-center space-x-2">
                        <span>Points:</span>
                        <span className="font-bold text-base text-blue-700">
                            {question.questionScore}
                        </span>
                    </div>

                    {/* Time Limit row */}
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-500">Time Limit:</span>
                        <input type="number" defaultValue="0" min="0"
                            className="w-12 p-1 text-center border rounded" /> hrs
                        <input type="number" defaultValue="0" min="0"
                            className="w-12 p-1 text-center border rounded" /> mins
                    </div>

                </div>
            </div>
        </div>
    </div>
);

    // -----------------------------------------------------------


    const renderMainContent = () => {
        if (currentView === 'bulk-upload') {
            return <BulkUploadView />; 
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Column 1: Question Bank (Left) */}
                <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm min-h-[500px]">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-lg font-semibold">Question Bank</h2>
                        <div className="flex space-x-2">
                            <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                Import
                            </button>
                            <button onClick={openCreateModal} className="flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                New
                            </button>
                        </div>
                    </div>

                    {questions.length === 0 ? (
                        <div className="text-center py-20">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                            <h3 className="mt-2 text-base font-medium text-gray-900">No questions in bank</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Create new questions or import from existing ones
                            </p>
                        </div>
                    ) : (
                        <div>
                            <input
                                type="text"
                                placeholder="Search questions by keyword"
                                className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {questions.map((q) => (
                                <QuestionItem key={q.id} question={q} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Column 2: Selected Questions (Right) */}
                <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm min-h-[500px]">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        {/* ⭐ Dynamically update count and points */}
                        <h2 className="text-lg font-semibold">Selected Questions ({selectedQuestionsCount})</h2>
                        <span className="text-sm font-medium text-gray-500">Total: {totalPoints} points</span>
                    </div>

                    {selectedQuestions.length === 0 ? (
                        // Empty State for Selected Questions
                        <div className="text-center py-20">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path d="M9 12h6m-3-3v6M4 21h16a2 2 0 002-2V5a2 2 0 00-2-2H4a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                            <h3 className="mt-2 text-base font-medium text-gray-900">No questions selected</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Select questions from the bank to add them to your test.
                            </p>
                        </div>
                    ) : (
                        // ⭐ Render list of selected questions
                        <div className="space-y-3">
                            {selectedQuestions.map((q) => (
                                <SelectedQuestionItem key={q.id} question={q} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };


    if (showCreateModal && modalFullPage) {
        return (
            <CreateQuestionModal 
                onClose={closeCreateModal} 
                onQuestionCreate={handleQuestionCreatedOrUpdated} 
                initialQuestionData={editingQuestion}
                fullPage={true}
            />
        );
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-2xl font-bold flex items-center">
                    <button onClick={onBack} className="text-gray-600 hover:text-blue-600 mr-3 p-1 rounded-full hover:bg-gray-200 transition duration-150">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    {currentView === 'bulk-upload' ? (
                        <span>Bulk Upload File</span>
                    ) : (
                        <>Add Questions to <span className="text-blue-600 ml-1">{skillName}</span></>
                    )}
                </h1>
                
                {/* Action Buttons Group */}
                <div className="flex space-x-3">
                    <button 
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                        onClick={() => setCurrentView('default')}
                    >
                        Manual Entry
                    </button>
                    <button 
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                        onClick={() => setCurrentView('bulk-upload')}
                    >
                        Bulk Upload
                    </button>
                    <button 
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100" 
                        onClick={onBack}
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            // Persist selected questions to localStorage (append, avoid duplicates)
                            try {
                                const stored = JSON.parse(localStorage.getItem('savedQuestions') || '[]');
                                const toAppend = selectedQuestions.filter(sq => !stored.find(st => st.id === sq.id));
                                const newStored = [...stored, ...toAppend];
                                localStorage.setItem('savedQuestions', JSON.stringify(newStored));
                            } catch (err) {
                                console.error('Failed to save questions to localStorage', err);
                            }
                            onBack();
                        }}
                        disabled={selectedQuestionsCount === 0}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-60"
                    >
                        Save ({selectedQuestionsCount})
                    </button>
                </div>
            </div>

            {/* Conditional Main Content */}
            {renderMainContent()}

            {/* Create Question Modal */}
            {showCreateModal && (
                <CreateQuestionModal 
                    onClose={closeCreateModal} 
                    onQuestionCreate={handleQuestionCreatedOrUpdated} 
                    initialQuestionData={editingQuestion}
                    fullPage={modalFullPage}
                />
            )}
        </div>
    );
};

export default AddQuestionPage;