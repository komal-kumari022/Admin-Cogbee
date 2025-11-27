import React, { useState, useEffect } from "react";
import SkillModal from "./SkillModal";
import CreateQuestionModal from "./CreateQuestionModal";

// --- TestQuestions Component ---
export default function TestQuestions({ setSelectedSkill, setActiveView }) {

  // Modal open/close state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const handleAddQuestions = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const openCreateModalForEdit = (question) => {
    setEditingQuestion(question);
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setEditingQuestion(null);
    setShowCreateModal(false);
  };

  const handleQuestionCreatedOrUpdated = (updatedQuestion) => {
    if (updatedQuestion.id) {
      // update existing
      const updated = savedQuestions.map(q => (q.id === updatedQuestion.id ? updatedQuestion : q));
      setSavedQuestions(updated);
      localStorage.setItem('savedQuestions', JSON.stringify(updated));
    } else {
      // create new
      const withId = { ...updatedQuestion, id: Date.now() };
      const updated = [withId, ...savedQuestions];
      setSavedQuestions(updated);
      localStorage.setItem('savedQuestions', JSON.stringify(updated));
    }
    closeCreateModal();
  };

  // saved questions loaded from localStorage
  const [savedQuestions, setSavedQuestions] = useState([]);

  // Load saved questions on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('savedQuestions') || '[]');
    setSavedQuestions(stored);

    // Listen for storage events so other tabs/components can update this view
    const onStorage = (e) => {
      if (e.key === 'savedQuestions') {
        setSavedQuestions(JSON.parse(e.newValue || '[]'));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Test Questions</h1>
          <p className="text-gray-600">Manage questions for your tests</p>
        </div>

        <button
          onClick={handleAddQuestions}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 transition duration-150"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Questions</span>
        </button>
      </div>

      <hr className="mb-8" />

      {/* Content Box */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm min-h-[400px]">
        {/* Header inside box */}
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Added Questions</h3>
            <p className="text-sm text-gray-500">{savedQuestions.length} question{savedQuestions.length !== 1 ? 's' : ''} • Total points: {savedQuestions.reduce((s, q) => s + (q.questionScore || 0), 0)}</p>
          </div>
        </div>

        {savedQuestions.length === 0 ? (
          <div className="text-center py-10">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No questions added yet</h3>
            <p className="mt-1 text-sm text-gray-500">Start by adding questions to your test library</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedQuestions.map((q, idx) => (
              <div key={q.id || idx} className="flex justify-between items-center p-4 border border-gray-100 rounded-md bg-white">
                <div className="flex items-center space-x-3">
                  <div className="text-xs text-gray-500">Q{idx + 1}</div>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">{(q.questionType || '').substring(0, 10)}</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">{q.difficulty}</span>
                      <span className="text-gray-700 text-sm ml-2">{q.questionName}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{q.options ? `${q.options.length} options` : ''}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 px-3 py-1 rounded text-sm">Points: {q.questionScore}</div>
                  <button title="Edit" onClick={() => openCreateModalForEdit(q)} className="text-blue-600 hover:text-blue-800 p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button title="Delete" onClick={() => {
                      const filtered = savedQuestions.filter(sq => sq.id !== q.id);
                      setSavedQuestions(filtered);
                      localStorage.setItem('savedQuestions', JSON.stringify(filtered));
                  }} className="text-red-600 hover:text-red-800 p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skill Modal */}
      <SkillModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onContinue={(skillName) => {
          setSelectedSkill(skillName);   // save skill name
          setActiveView("addQuestion");  // navigate to addQuestionPage
        }}
      />

      {/* Create / Edit Question Modal for TestQuestions list */}
      {showCreateModal && (
        <CreateQuestionModal
          onClose={closeCreateModal}
          onQuestionCreate={handleQuestionCreatedOrUpdated}
          initialQuestionData={editingQuestion}
        />
      )}

    </div>
  );
}
