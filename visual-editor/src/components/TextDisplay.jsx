// src/components/TextDisplay.jsx
// Responsabilité unique : card d'un document (header titre + boutons) + intègre DocContent
import React from 'react';
import DocContent from './DocContent';

export default function TextDisplay({ doc, isActive, editMode, onContentClick, onTitleClick, onClose, onDelete, onRename, searchStr }) {
  return (
    <div
      className={`border-2 flex flex-col p-4 rounded bg-white min-h-[200px] relative transition-all ${
        isActive ? 'border-blue-500 shadow-xl scale-[1.01]' : 'border-gray-300 opacity-60 hover:opacity-90'
      }`}
    >
      {/* Header : titre + boutons */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <div
          className="flex-grow cursor-pointer flex items-center"
          onClick={(e) => { e.stopPropagation(); onTitleClick(); }}
        >
          <span
            className={`font-bold text-lg px-2 py-1 rounded transition-colors flex items-center ${
              isActive && editMode === 'title'
                ? 'bg-blue-100 border-b-2 border-blue-500 text-blue-800'
                : 'hover:bg-gray-100 text-gray-600 border-b-2 border-transparent'
            }`}
            title="לחץ כאן כדי לערוך את שם הקובץ עם המקלדת הווירטואלית"
          >
            {doc.filename || ' '}
            {doc.isDirty && (
              <span className="text-red-500 text-xl leading-none ml-1" title="מסמך זה מכיל שינויים שלא נשמרו">*</span>
            )}
            {isActive && editMode === 'title' && (
              <span className="animate-pulse ml-1 text-blue-500">|</span>
            )}
            <span className="mr-2 text-sm opacity-50">✎</span>
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="text-red-500 hover:text-white border hover:bg-red-500 border-red-500 font-bold px-2 py-1 rounded transition-colors text-sm"
            title="מחק קובץ לצמיתות"
          >
            מחק 🗑️
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="text-gray-400 hover:text-white border hover:bg-gray-500 border-gray-400 font-bold px-2 py-1 rounded transition-colors text-sm"
            title="סגור חלון"
          >
            סגור X
          </button>
        </div>
      </div>

      {/* Contenu du document */}
      <DocContent
        doc={doc}
        isActive={isActive}
        editMode={editMode}
        searchStr={searchStr}
        onClick={onContentClick}
      />
    </div>
  );
}