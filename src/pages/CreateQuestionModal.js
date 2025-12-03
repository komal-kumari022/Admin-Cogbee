import React, { useState, useEffect } from 'react';

const CreateQuestionModal = ({ onClose, onQuestionCreate, initialQuestionData = null, fullPage = true }) => {
    
    // State to hold the question form data
    const [formData, setFormData] = useState({
        questionName: '',
        tags: [],
        questionType: 'Multiple Choice (Single)',
        difficulty: 'Medium',
        questionScore: 10,
        solution: ''
    });

    // Separate state for tag input
    const [tagInput, setTagInput] = useState('');

    // State for options
    const [options, setOptions] = useState([
        { id: 1, text: 'Option 1', score: 0 },
        { id: 2, text: 'Option 2', score: 0 },
    ]);
    
    // Scoring and solution states
    const [selectedScoring, setSelectedScoring] = useState('Basic Scoring');
    const [showSolution, setShowSolution] = useState(false);
    const [loading, setLoading] = useState(false);

    // State for correct options in basic scoring
    const [correctOptionIds, setCorrectOptionIds] = useState(new Set());

    // Mappings
    const questionTypeMap = {
        'Multiple Choice (Single)': 1,
        'Multiple Choice (Multiple)': 2,
        'True/False (Multiple)': 3,
        'Fill Blanks': 4,
        'List Choice': 5,
        'Text/Essay': 6,
        'Coding': 7
    };

    const difficultyMap = {
        'Easy': 1,
        'Medium': 2,
        'Hard': 3
    };

    // Generic handler for form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Tags handling
    const handleAddTag = (e) => {
        if ((e.type === 'click' || e.key === 'Enter') && tagInput.trim()) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
    };

    const handleAddOption = () => {
        const newId = Date.now();  
        setOptions(prev => [...prev, { id: newId, text: `Option ${prev.length + 1}`, score: 0 }]);
    };

    // Update option text value
    const handleOptionTextChange = (id, newText) => {
        setOptions(prev => prev.map(o => o.id === id ? { ...o, text: newText } : o));
    };

    // Update option score value
    const handleOptionScoreChange = (id, newScore) => {
        setOptions(prev => prev.map(o => o.id === id ? { ...o, score: Number(newScore) || 0 } : o));
    };

    const handleRemoveOption = (idToRemove) => {
        setOptions(prev => prev.filter(option => option.id !== idToRemove));
        // Remove from correct if present
        setCorrectOptionIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(idToRemove);
            return newSet;
        });
    };

    // Handle selection change for basic scoring
    const handleSelectionChange = (id, checked) => {
        if (selectedScoring !== 'Basic Scoring') return;

        let newSet;
        const isMultipleSelect = formData.questionType === 'Multiple Choice (Multiple)' || formData.questionType === 'True/False (Multiple)';

        if (!isMultipleSelect) {
            // Single select
            newSet = new Set();
            if (checked) newSet.add(id);
        } else {
            // Multiple select
            newSet = new Set(correctOptionIds);
            if (checked) {
                newSet.add(id);
            } else {
                newSet.delete(id);
            }
        }

        setCorrectOptionIds(newSet);
    };

    // Update scores when basic scoring and correct options change
    useEffect(() => {
        if (selectedScoring === 'Basic Scoring' && options.length > 0) {
            setOptions(prev => prev.map(o => ({
                ...o,
                score: correctOptionIds.has(o.id) ? formData.questionScore : 0
            })));
        }
    }, [correctOptionIds, formData.questionScore]);

    // When switching to basic scoring, set correct based on current scores
    useEffect(() => {
        if (selectedScoring === 'Basic Scoring') {
            const newSet = new Set(options.filter(o => o.score > 0).map(o => o.id));
            setCorrectOptionIds(newSet);
        }
    }, [selectedScoring]);

    // --- API Integration: Question Creation Logic ---
    const handleCreateQuestion = async () => {
        // 1. Basic validation
        if (!formData.questionName.trim()) {
            alert("Please enter a question name.");
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert("Please login first.");
            return;
        }

        setLoading(true);

        try {
            // Determine answer: texts of options with positive score
            const positiveScoreOptions = options.filter(o => o.score > 0);
            const answer = positiveScoreOptions.length > 0 
                ? positiveScoreOptions.map(o => o.text).join(' or ') 
                : '';

            // For non-options types, set answer to solution if present
            const finalAnswer = showOptions ? answer : (formData.solution || '');

            const payload = {
                assessmentSkillId: 3, // Hardcoded as per example
                AccountId: 1, // Hardcoded as per example
                questionName: formData.questionName,
                questionTag: formData.tags.join(', '),
                questionType: questionTypeMap[formData.questionType] || 1,
                difficulty: difficultyMap[formData.difficulty] || 2,
                questionScore: formData.questionScore,
                questionDuration: 90, // Hardcoded as per example
                answer: finalAnswer,
                solutionText: formData.solution,
                isPreview: 1, // Hardcoded
                questionStatus: 1, // Hardcoded
                questionOptions: showOptions ? options.map(opt => ({
                    assessmentSkillQuestionId: 0,
                    optionValue: opt.text,
                    optionType: 1, // Assumed
                    optionScore: opt.score
                })) : []
            };

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}Question/AddQuestion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Construct local question for display with original data and API ID
                const localQuestion = {
                    id: data.data.assessmentSkillQuestionId,
                    assessmentSkillQuestionId: data.data.assessmentSkillQuestionId,
                    questionName: formData.questionName,
                    questionTag: formData.tags.join(', '),
                    questionType: formData.questionType, // Keep as string
                    difficulty: formData.difficulty, // Keep as string
                    questionScore: formData.questionScore,
                    questionDuration: 90,
                    answer: finalAnswer,
                    solutionText: formData.solution,
                    isPreview: 1,
                    questionStatus: 1,
                    options: options.map(opt => ({
                        id: opt.id,
                        text: opt.text, // Original text, not encrypted
                        score: opt.score
                    })),
                    tags: formData.tags,
                    solution: formData.solution
                };

                // Call the callback with the local question data
                onQuestionCreate(localQuestion);
                onClose();
                alert("Question created successfully!");
            } else {
                alert(data.message || 'Failed to create question.');
            }
        } catch (err) {
            console.error("API error:", err);
            alert("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    // ------------------------------------

    // Populate or reset form when initialQuestionData changes
    useEffect(() => {
        if (initialQuestionData) {
            setFormData(prev => ({
                ...prev,
                questionName: initialQuestionData.questionName || '',
                tags: initialQuestionData.tags || [],
                questionType: initialQuestionData.questionType || prev.questionType,
                difficulty: initialQuestionData.difficulty || prev.difficulty,
                questionScore: initialQuestionData.questionScore ?? prev.questionScore,
                solution: initialQuestionData.solution || ''
            }));
            setTagInput('');

            if (initialQuestionData.options && Array.isArray(initialQuestionData.options) && initialQuestionData.options.length > 0) {
                const normalized = initialQuestionData.options.map((opt, idx) => ({
                    id: opt.id ?? idx + 1,
                    text: opt.text ?? `Option ${idx + 1}`,
                    score: opt.score ?? 0
                }));
                setOptions(normalized);
                // Set correct based on scores
                setCorrectOptionIds(new Set(normalized.filter(o => o.score > 0).map(o => o.id)));
            }

            setShowSolution(!!initialQuestionData.solution);
        } else {
            // Reset to defaults when creating new question
            setFormData({
                questionName: '',
                tags: [],
                questionType: 'Multiple Choice (Single)',
                difficulty: 'Medium',
                questionScore: 10,
                solution: ''
            });
            setTagInput('');
            setOptions([
                { id: 1, text: 'Option 1', score: 0 },
                { id: 2, text: 'Option 2', score: 0 },
            ]);
            setCorrectOptionIds(new Set());
            setShowSolution(false);
        }
    }, [initialQuestionData]);

    // Handle question type change to adjust options visibility and reset
    useEffect(() => {
        const showOptionsTypes = ['Multiple Choice (Single)', 'Multiple Choice (Multiple)', 'True/False (Multiple)'];
        if (!showOptionsTypes.includes(formData.questionType)) {
            setOptions([]);
            setCorrectOptionIds(new Set());
            setSelectedScoring('Basic Scoring'); // Reset scoring
        } else if (formData.questionType === 'True/False (Multiple)') {
            setOptions([
                { id: 1, text: 'True', score: 0 },
                { id: 2, text: 'False', score: 0 },
            ]);
            setCorrectOptionIds(new Set());
        }
    }, [formData.questionType]);

    // Helper to determine if options section should be shown
    const showOptions = ['Multiple Choice (Single)', 'Multiple Choice (Multiple)', 'True/False (Multiple)'].includes(formData.questionType);

    // Helper to determine the input type based on scoring method and question type
    const isOptionLevel = selectedScoring === 'Option-Level Scoring';
    const isMultipleSelect = formData.questionType === 'Multiple Choice (Multiple)' || formData.questionType === 'True/False (Multiple)';

    // wrapper + container classes depend on `fullPage`
    const wrapperClass = fullPage
        ? 'min-h-screen bg-gray-50 w-full'
        : 'fixed inset-0 z-50 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center';

    const containerClass = fullPage
        ? 'relative bg-white w-full h-full p-6 max-h-none overflow-y-auto'
        : 'relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto my-10 p-6 max-h-[90vh] overflow-y-auto';

    // Get checked state for selection
    const isOptionCorrect = (id) => correctOptionIds.has(id);

    return (
        // Modal Backdrop or full-page wrapper
        <div className={wrapperClass}>
            {/* Modal Content / Full page content */}
            <div className={containerClass}>
                
                {/* Modal/Header */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4 sticky top-0 bg-white z-10">
                    <div className="flex items-center">
                        <div className="mr-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-900">{initialQuestionData ? 'Edit Question' : 'Add Questions'}</h3>
                            <p className="text-sm text-gray-500">{initialQuestionData ? 'Update the question details.' : 'Add a new question to your quiz or assessment.'}</p>
                        </div>
                    </div>

                    <div>
                        {!fullPage && (
                            <button 
                                onClick={onClose} 
                                className="text-gray-400 hover:text-gray-600 transition p-1 rounded-full"
                                aria-label="Close"
                                title="Close"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Modal Body: Form Fields */}
                <div className="space-y-4 pb-4">  
                    
                    {/* Question Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question Name *</label>
                        <textarea
                            name="questionName"
                            value={formData.questionName}
                            onChange={handleInputChange}
                            placeholder="Enter your question..."
                            rows="3"
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        />
                    </div>
                    
                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Optional)</label>
                        <div className="flex mt-1 space-x-2 items-center">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="Add tag and press Enter"
                                className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button 
                                onClick={handleAddTag}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                            >
                                Add
                            </button>
                        </div>
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.tags.map((tag, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {tag}
                                        <button
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-1 text-blue-600 hover:text-blue-800"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Question Type, Difficulty, Score (Inline Group) */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Question Type *</label>
                            <select 
                                name="questionType"
                                value={formData.questionType}
                                onChange={handleInputChange}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option>Multiple Choice (Single)</option>
                                <option>Multiple Choice (Multiple)</option>
                                <option>True/False (Multiple)</option>
                                <option>Fill Blanks</option>
                                <option>List Choice</option>
                                <option>Text/Essay</option>
                                <option>Coding</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty *</label>
                            <select 
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleInputChange}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Question Score *</label>
                            <input
                                type="number"
                                name="questionScore"
                                value={formData.questionScore}
                                onChange={handleInputChange}
                                min="0"
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Answer Options Section */}
                    {showOptions && (
                        <div className="border border-gray-200 p-4 rounded-md bg-gray-50 space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-700">Answer Options *</label>
                                <button 
                                    onClick={handleAddOption} 
                                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                                    disabled={!showOptions}
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                    + Add Option
                                </button>
                            </div>

                            {/* Scoring Tabs */}
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => setSelectedScoring('Basic Scoring')}
                                    className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${selectedScoring === 'Basic Scoring' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    Basic scoring
                                </button>
                                <button
                                    onClick={() => setSelectedScoring('Option-Level Scoring')}
                                    className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${selectedScoring === 'Option-Level Scoring' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    Option-level scoring
                                </button>
                            </div>

                            {/* Optional Scoring Description */}
                            {isOptionLevel && (
                                <p className="text-xs text-gray-600 p-2 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
                                    Assign individual scores to each option. Useful for partial credit or negative marking.
                                </p>
                            )}
                            
                            {/* List of Options */}
                            <div className="space-y-2 min-h-[100px]">  
                                {options.map((option) => (
                                    <div key={option.id} className="flex items-center bg-white border border-gray-200 rounded-md p-2">
                                        
                                        {/* Selection Input */}
                                        <div className="p-2 flex-shrink-0">
                                            {isOptionLevel ? (
                                                <input 
                                                    type="checkbox" 
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                                                    disabled
                                                />
                                            ) : (
                                                <input 
                                                    type={isMultipleSelect ? "checkbox" : "radio"} 
                                                    name={isMultipleSelect ? "correct-answers" : "correct-answer"}
                                                    checked={isOptionCorrect(option.id)}
                                                    onChange={(e) => handleSelectionChange(option.id, e.target.checked)}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                                                />
                                            )}
                                        </div>

                                        {/* Option Text Input */}
                                        <input 
                                            type="text" 
                                            value={option.text}
                                            onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                                            placeholder={`Option ${options.findIndex(o => o.id === option.id) + 1}`}
                                            className="flex-1 ml-2 p-2 text-sm border-none focus:ring-0 focus:outline-none"
                                        />
                                        
                                        {/* Score Input (Only for Option-Level) */}
                                        {isOptionLevel && (
                                            <div className="flex items-center border-l border-gray-200 pl-3 ml-3">
                                                <input
                                                    type="number"
                                                    value={option.score}
                                                    onChange={(e) => handleOptionScoreChange(option.id, e.target.value)}
                                                    placeholder="0"
                                                    min="-100"
                                                    max="100"
                                                    className="w-16 p-2 text-sm text-center border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        )}

                                        {/* Delete Button */}
                                        {options.length > (formData.questionType === 'True/False (Multiple)' ? 2 : 2) && (
                                            <button
                                                onClick={() => handleRemoveOption(option.id)}
                                                className="ml-3 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                                                title="Delete Option"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Instruction for Basic Scoring */}
                            {!isOptionLevel && (
                                <p className="text-xs text-gray-500 pt-2">Select the correct answer{isMultipleSelect ? 's' : ''}</p>
                            )}
                        
                        </div>
                    )}

                    {/* Add Solution Checkbox */}
                    <div className="flex items-center mt-4">
                        <input
                            id="add-solution"
                            type="checkbox"
                            checked={showSolution}
                            onChange={(e) => setShowSolution(e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="add-solution" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                            Add Solution/Explanation
                        </label>
                    </div>

                    {/* Solution/Explanation Textarea (Conditional) */}
                    {showSolution && (
                        <div className="mt-2">
                            <textarea
                                name="solution"
                                value={formData.solution}
                                onChange={handleInputChange}
                                placeholder="Enter the solution or explanation for the question."
                                rows="3"
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            />
                        </div>
                    )}
                </div>

                {/* Modal Footer: Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-200 sticky bottom-0 bg-white z-10">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleCreateQuestion}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : (initialQuestionData ? 'Update Question' : 'Create Question')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateQuestionModal;