// src/components/KeyboardKeys.jsx
// Responsabilité unique : rendu des touches du clavier virtuel + touches d'action
import React from 'react';

const layouts = {
  HE: ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת','ף','ץ','ן','ם','ך'],
  EN: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
  SYMBOLS: ['1','2','3','4','5','6','7','8','9','0','!','@','#','$','%','^','&','*','(',')','_','-','+','=','😀','👍'],
};

export default function KeyboardKeys({
  keyboardLang,
  onKeyPress,
  onDelete,
  onDeleteWord,
  onDeleteAll,
  onUndo,
}) {
  return (
    <div className="flex-grow overflow-y-auto">
      {/* Grille des caractères */}
      <div
        className="flex flex-wrap gap-2 mb-2 justify-center"
        dir={keyboardLang === 'EN' ? 'ltr' : 'rtl'}
      >
        {layouts[keyboardLang].map(char => (
          <button
            key={char}
            onClick={() => onKeyPress(char)}
            className="bg-white border border-gray-300 rounded shadow-sm w-10 h-10 text-lg hover:bg-blue-50 focus:outline-none"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Touches d'action */}
      <div className="flex gap-2 justify-center flex-wrap max-w-3xl mx-auto">
        <button
          onClick={() => onKeyPress(' ')}
          className="flex-grow bg-white border border-gray-300 rounded shadow-sm py-3 text-lg font-bold hover:bg-blue-50"
        >
          רווח (Space)
        </button>
        <button
          onClick={onDelete}
          className="bg-red-100 hover:bg-red-200 border border-red-300 rounded px-4 py-3 text-red-800 font-bold"
        >
          מחק תו
        </button>
        <button
          onClick={onDeleteWord}
          className="bg-orange-100 hover:bg-orange-200 border border-orange-300 rounded px-4 py-3 text-orange-800 font-bold"
        >
          מחק מילה
        </button>
        <button
          onClick={onDeleteAll}
          className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-3 font-bold"
        >
          נקה הכל
        </button>
        <button
          onClick={onUndo}
          className="bg-gray-300 hover:bg-gray-400 border border-gray-400 rounded px-4 py-3 font-bold text-gray-800"
        >
          בטל (Undo)
        </button>
      </div>
    </div>
  );
}
