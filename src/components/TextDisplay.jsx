// src/components/TextDisplay.jsx
import React from 'react';

export default function TextDisplay({ doc, isActive, onFocus, onClose }) {
  return (
    <div 
      onClick={onFocus}
      className={`border-2 p-4 m-2 rounded bg-white min-h-[150px] relative cursor-pointer transition-all ${
        isActive ? 'border-blue-500 shadow-lg' : 'border-gray-300 opacity-70'
      }`}
    >
      <div className="flex justify-between items-center mb-2 border-b pb-2">
        <span className={`font-bold ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
          {doc.filename || 'חדש*'}
        </span>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-red-500 font-bold hover:bg-red-50 px-2 rounded">X</button>
      </div>
      
      {/* רינדור התווים עם העיצוב שלהם */}
      <div className="min-h-[100px] flex flex-wrap" dir="rtl">
        {doc.content.map((charObj, index) => (
          <span 
            key={index} 
            style={{ color: charObj.color, fontSize: charObj.fontSize }}
          >
            {charObj.char === ' ' ? '\u00A0' : charObj.char}
          </span>
        ))}
        {isActive && <span className="animate-pulse border-r-2 border-black ml-1"></span>}
      </div>
    </div>
  );
}