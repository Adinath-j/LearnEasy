import React from "react";

function StickyNoteCanvas({ notes, setNotes }) {
  const addNote = () => {
    setNotes([...notes, { id: Date.now(), text: "New Note" }]);
  };

  return (
    <div className="p-4 bg-white rounded shadow-md mb-6">
      <h2 className="text-lg font-bold mb-2">Sticky Notes</h2>
      <button
        onClick={addNote}
        className="bg-green-500 text-white px-3 py-1 rounded mb-2 hover:bg-green-600"
      >
        Add Note
      </button>
      <div className="border border-dashed h-40 p-2 overflow-y-auto bg-yellow-50 rounded">
        {notes.map((note) => (
          <div key={note.id} className="p-2 m-1 bg-yellow-200 rounded shadow">
            {note.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StickyNoteCanvas;
