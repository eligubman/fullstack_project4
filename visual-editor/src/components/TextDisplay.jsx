// src/components/TextDisplay.jsx
import React from 'react';

export default function TextDisplay({ doc, isActive, editMode, onContentClick, onTitleClick, onClose, onDelete, searchStr }) {
  
  const matchIndices = new Set();
  if (searchStr && searchStr.length > 0) {
    const searchChars = Array.from(searchStr);
    for (let i = 0; i <= doc.content.length - searchChars.length; i++) {
      let match = true;
      for (let j = 0; j < searchChars.length; j++) {
        if (doc.content[i + j].char !== searchChars[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        for (let j = 0; j < searchChars.length; j++) {
          matchIndices.add(i + j);
        }
      }
    }
  }

  return (
    <div 
      className={`border-2 flex flex-col p-4 rounded bg-white min-h-[200px] relative transition-all ${
        isActive ? 'border-blue-500 shadow-xl scale-[1.01]' : 'border-gray-300 opacity-60 hover:opacity-90'
      }`}
    >
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
            {/* הכוכבית האדומה המגניבה שמופיעה כשהקובץ שונה ולא נשמר */}
            {doc.isDirty && <span className="text-red-500 text-xl leading-none ml-1" title="מסמך זה מכיל שינויים שלא נשמרו">*</span>}
            {isActive && editMode === 'title' && <span className="animate-pulse ml-1 text-blue-500">|</span>} <span className="mr-2 text-sm opacity-50">✎</span>
          </span>
        </div>
        
        <div className="flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-red-500 hover:text-white border hover:bg-red-500 border-red-500 font-bold px-2 py-1 rounded transition-colors text-sm" title="מחק קובץ לצמיתות">
            מחק 🗑️
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-gray-400 hover:text-white border hover:bg-gray-500 border-gray-400 font-bold px-2 py-1 rounded transition-colors text-sm" title="סגור חלון">
            סגור X
          </button>
        </div>
      </div>
      
      <div 
        className={`flex-grow p-4 rounded overflow-y-auto text-right cursor-text transition-colors ${
          isActive && editMode === 'content' ? 'bg-green-50 ring-1 ring-green-200' : 'bg-gray-50'
        }`} 
        dir="rtl"
        onClick={(e) => { e.stopPropagation(); onContentClick(); }}
      >
        <div className="min-h-[100px] break-words whitespace-pre-wrap leading-relaxed">
          {doc.content.map((charObj, index) => {
            const isHighlighted = matchIndices.has(index);
            return (
              <span 
                key={index} 
                style={{
                  color: charObj.color,
                  fontSize: charObj.fontSize,
                  fontFamily: charObj.fontFamily || 'Arial',
                  backgroundColor: isHighlighted ? '#facc15' : 'transparent',
                  borderRadius: isHighlighted ? '2px' : undefined,
                  padding: isHighlighted ? '0 1px' : '0'
                }}
              >
                {charObj.char}
              </span>
            );
          })}
          {isActive && editMode === 'content' && (
            <span 
              className="animate-pulse font-light"
              style={{ 
                color: doc.currentStyle?.color || 'black', 
                fontSize: doc.currentStyle?.fontSize || '16px',
                fontFamily: doc.currentStyle?.fontFamily || 'Arial',
                marginLeft: '2px'
              }}
            >
              |
            </span>
          )}
        </div>
      </div>
    </div>
  );
}