import React, { useState } from 'react';

// Added onQuestionCreate prop
const CreateQuestionModal = ({ onClose, onQuestionCreate }) => { 
    
    // State to hold the question form data
    const [formData, setFormData] = useState({
        questionName: '',
        tags: [],
        questionType: 'Multiple Choice',
        difficulty: 'Medium',
        questionScore: 10,
        solution: ''
    });

    // State updated to use objects {id, text, score} for options
    const [options, setOptions] = useState([
        { id: 1, text: 'Option 1', score: 0 },
        { id: 2, text: 'Option 2', score: 0 },
    ]);
    
    // selectedScoring state controls the scoring display logic
    const [selectedScoring, setSelectedScoring] = useState('Basic Scoring');
    const [showSolution, setShowSolution] = useState(false);

    // Generic handler for form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddOption = () => {
        const newId = Date.now();  
        setOptions(prev => [...prev, { id: newId, text: `Option ${prev.length + 1}`, score: 0 }]);
    };

    const handleRemoveOption = (idToRemove) => {
        setOptions(prev => prev.filter(option => option.id !== idToRemove));
    };

    // --- NEW: Question Creation Logic ---
    const handleCreateQuestion = () => {
        // 1. Basic validation (Ensure question name is not empty)
        if (!formData.questionName.trim()) {
            alert("Please enter a question name.");
            return;
        }

        // 2. Construct the new question object 
        const newQuestion = {
            questionName: formData.questionName,
            questionType: formData.questionType,
            difficulty: formData.difficulty,
            questionScore: formData.questionScore,
            options: options, // Includes all option data
            solution: showSolution ? formData.solution : null,
            // You can add more fields here if needed (e.g., tags, correct answer(s))
        };
        
        // 3. Call the callback function from the parent
        onQuestionCreate(newQuestion); 
        
        // onClose() is called inside onQuestionCreate, but you can keep it here as fallback
        // onClose(); 
    };
    // ------------------------------------

    // Helper to determine the input type based on scoring method
    const isOptionLevel = selectedScoring === 'Option-Level Scoring';

    return (
        // Modal Backdrop
        <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto my-10 p-6 max-h-[90vh] overflow-y-auto">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4 sticky top-0 bg-white z-10">
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900">Create New Question</h3>
                        <p className="text-sm text-gray-500">Add a new question to your quiz or assessment.</p>
                    </div>
                    {/* Close Button (X icon) */}
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Modal Body: Form Fields */}
                <div className="space-y-4 pb-4"> 
                    
                    {/* Question Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Question Name *</label>
                        <textarea
                            name="questionName" // Added name attribute
                            value={formData.questionName} // Controlled input
                            onChange={handleInputChange} // Handle change
                            placeholder="Enter your question..."
                            rows="2"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        ></textarea>
                    </div>
                    
                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tags (Optional)</label>
                        <div className="flex mt-1 space-x-2">
                            <input
                                type="text"
                                placeholder="Add tag and press Enter"
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100">
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Question Type, Difficulty, Score (Inline Group) */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Question Type *</label>
                            <select 
                                name="questionType" // Added name
                                value={formData.questionType} // Controlled input
                                onChange={handleInputChange} // Handle change
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option>Multiple Choice</option>
                                <option>Single Choice</option>
                                <option>True/False</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Difficulty *</label>
                            <select 
                                name="difficulty" // Added name
                                value={formData.difficulty} // Controlled input
                                onChange={handleInputChange} // Handle change
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option>Medium</option>
                                <option>Easy</option>
                                <option>Hard</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Question Score *</label>
                            <input
                                type="number"
                                name="questionScore" // Added name
                                value={formData.questionScore} // Controlled input
                                onChange={handleInputChange} // Handle change
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Answer Options Section (Logic for rendering options remains the same) */}
                    <div className="border p-4 rounded-md bg-gray-50 space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700">Answer Options *</label>
                            <button onClick={handleAddOption} className="flex items-center text-blue-600 text-sm font-medium hover:text-blue-800">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Add Option
                            </button>
                        </div>

                        {/* Scoring Tabs */}
                        <div className="flex space-x-2 mb-3">
                            <button 
                                onClick={() => setSelectedScoring('Basic Scoring')}
                                className={`px-4 py-1 text-sm rounded-full transition ${selectedScoring === 'Basic Scoring' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                Basic Scoring
                            </button>
                            <button
                                onClick={() => setSelectedScoring('Option-Level Scoring')}
                                className={`px-4 py-1 text-sm rounded-full transition ${selectedScoring === 'Option-Level Scoring' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                Option-Level Scoring
                            </button>
                        </div>

                        {/* Optional Scoring Description */}
                        {isOptionLevel && (
                            <p className="text-xs text-gray-600 mb-3 p-2 border-l-2 border-blue-500 bg-blue-50">
                                Assign individual scores to each option. Useful for partial credit or negative marking.
                            </p>
                        )}
                        
                        {/* List of Options (You'll need more complex logic to handle option text and score changes in a real app, but the structure is here) */}
                        <div className="space-y-2"> 
                            {options.map((option) => (
                                <div key={option.id} className="flex items-center bg-white border border-gray-200 rounded-md">
                                    
                                    {/* 1. Radio/Checkbox based on Scoring Type */}
                                    <div className="p-2 flex-shrink-0">
                                        {isOptionLevel ? (
                                            // Checkbox for Option-Level Scoring
                                            <input type="checkbox" name={`option-checkbox-${option.id}`} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                        ) : (
                                            // Radio for Basic Scoring
                                            <input type="radio" name="correct-answer" className="h-4 w-4 text-blue-600 border-gray-300" />
                                        )}
                                    </div>

                                    {/* 2. Option Input Field */}
                                    <input 
                                        type="text" 
                                        defaultValue={option.text} // Use defaultValue for simplicity here, but a real app should use value and onChange
                                        placeholder={`Enter Option ${options.findIndex(o => o.id === option.id) + 1}`}
                                        className="ml-2 block w-full p-1 text-sm border-none focus:ring-0"
                                    />
                                    
                                    {/* 3. Score Input Field (Only for Option-Level) */}
                                    {isOptionLevel && (
                                        <input
                                            type="number"
                                            defaultValue={option.score}
                                            placeholder="Score"
                                            className="w-16 p-1 text-sm text-center border-l border-gray-200 focus:ring-0"
                                        />
                                    )}

                                    {/* 4. Delete Button (Conditional: only for added options) */}
                                    {option.id > 2 && (
                                        <button
                                            onClick={() => handleRemoveOption(option.id)}
                                            className="ml-3 mr-2 p-1 rounded-full flex-shrink-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                            title="Delete Option"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Instruction based on Scoring Type */}
                        {!isOptionLevel && (
                            <p className="text-xs text-gray-500 pt-2">Select the correct answer</p>
                        )}
                        
                    </div>

                    {/* Add Solution Checkbox */}
                    <div className="flex items-center">
                        <input
                            id="add-solution"
                            type="checkbox"
                            checked={showSolution}
                            onChange={(e) => setShowSolution(e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor="add-solution" className="ml-2 block text-sm text-gray-900">
                            Add Solution/Explanation
                        </label>
                    </div>

                    {/* Solution/Explanation Textarea (Conditional) */}
                    {showSolution && (
                        <div>
                            <textarea
                                name="solution" // Added name
                                value={formData.solution} // Controlled input
                                onChange={handleInputChange} // Handle change
                                placeholder="Enter the solution or explanation for the question."
                                rows="3"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            ></textarea>
                        </div>
                    )}
                </div>

                {/* Modal Footer: Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-gray-200 sticky bottom-0 bg-white z-10">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleCreateQuestion} // Calls the new logic
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Create Question
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateQuestionModal;