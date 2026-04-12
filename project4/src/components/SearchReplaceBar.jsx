// src/components/SearchReplaceBar.jsx
// Responsabilité unique : barre de recherche et de remplacement
import React from 'react';

export default function SearchReplaceBar({
  editMode,
  searchStr,
  replaceStr,
  onSearchClick,
  onReplaceClick,
  onReplaceAll,
}) {
  const isDisabled = editMode === 'title';

  return (
    <div className={`flex flex-wrap items-center gap-3 mb-2 bg-white p-2 rounded shadow-sm transition-opacity ${isDisabled ? 'opacity-30 pointer-events-none' : ''}`}>
      <span className="text-sm font-bold">חיפוש והחלפה:</span>

      {/* Champ de recherche */}
      <div
        onClick={onSearchClick}
        className={`border rounded px-3 py-1 min-w-[120px] min-h-[32px] flex items-center cursor-pointer text-sm ${
          editMode === 'search'
            ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200'
            : 'bg-gray-50 hover:bg-gray-100'
        }`}
      >
        {searchStr || <span className="text-gray-400">חפש מילה...</span>}
        {editMode === 'search' && <span className="animate-pulse ml-1 text-yellow-600">|</span>}
      </div>

      {/* Champ de remplacement */}
      <div
        onClick={onReplaceClick}
        className={`border rounded px-3 py-1 min-w-[120px] min-h-[32px] flex items-center cursor-pointer text-sm ${
          editMode === 'replace'
            ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200'
            : 'bg-gray-50 hover:bg-gray-100'
        }`}
      >
        {replaceStr || <span className="text-gray-400">החלף ב...</span>}
        {editMode === 'replace' && <span className="animate-pulse ml-1 text-teal-600">|</span>}
      </div>

      <button
        onClick={onReplaceAll}
        className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-4 py-1 rounded text-sm shadow"
      >
        החלף הכל
      </button>
    </div>
  );
}
