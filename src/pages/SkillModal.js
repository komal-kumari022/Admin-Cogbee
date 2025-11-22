import React, { useState } from "react";

const SkillModal = ({ isOpen, onClose, onContinue }) => {
  const [skillName, setSkillName] = useState("");

  if (!isOpen) return null;

  const handleContinue = () => {
    if (!skillName.trim()) {
      alert("Please enter a skill name.");
      return;
    }
    onContinue(skillName); // ⬅ send skillName to parent
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md">
        
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Add Questions</h2>

        <p className="text-gray-700 mb-6">
          Enter the name of the skill for these questions.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skill Name *
          </label>
          <input
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Algebra, Data Structures"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleContinue}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillModal;
