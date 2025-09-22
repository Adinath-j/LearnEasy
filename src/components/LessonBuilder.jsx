import React, { useState } from "react";

function LessonBuilder({ setAiSuggestions }) {
  const [lessonContent, setLessonContent] = useState("");

  const handleSaveLesson = () => {
    if (lessonContent.trim() !== "") {
      setAiSuggestions((prev) => [...prev, `Custom lesson: ${lessonContent}`]);
      setLessonContent("");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md mb-6">
      <h2 className="text-lg font-bold mb-2">Lesson Plan Builder</h2>
      <textarea
        className="w-full border rounded p-2 mb-2"
        placeholder="Enter lesson plan content..."
        value={lessonContent}
        onChange={(e) => setLessonContent(e.target.value)}
      ></textarea>
      <button
        onClick={handleSaveLesson}
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
      >
        Save Lesson
      </button>
    </div>
  );
}

export default LessonBuilder;
