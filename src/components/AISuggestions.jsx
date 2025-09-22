import React from "react";

function AISuggestions({ aiSuggestions, setAiSuggestions }) {
  const handleGenerate = () => {
    setTimeout(() => {
      setAiSuggestions([
        "Gamify fractions using puzzles",
        "Use storytelling to explain photosynthesis",
        "Interactive quiz for grammar practice",
      ]);
    }, 1000);
  };

  return (
    <div className="p-4 bg-white rounded shadow-md mb-6">
      <h2 className="text-lg font-bold mb-2">AI Lesson Suggestions</h2>
      <button
        onClick={handleGenerate}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Generate AI Suggestions
      </button>
      {aiSuggestions.length > 0 && (
        <ul className="mt-3 list-disc list-inside">
          {aiSuggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AISuggestions;
