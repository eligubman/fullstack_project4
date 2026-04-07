// src/components/KeyboardPanel.jsx
import React from 'react';

export default function KeyboardPanel({ activeDoc, updateActiveDoc, saveActiveDoc }) {
  if (!activeDoc) return <div className="p-4 bg-gray-200 text-center">בחר טקסט לעריכה</div>;

  // פונקציה להוספת תו למערך התווים עם העיצוב הנוכחי
  const handleKeyPress = (char) => {
    const newChar = {
      char,
      color: activeDoc.currentStyle.color,
      fontSize: activeDoc.currentStyle.fontSize
    };
    updateActiveDoc({
      content: [...activeDoc.content, newChar]
    });
  };

  // מחיקת התו האחרון
  const handleDelete = () => {
    updateActiveDoc({
      content: activeDoc.content.slice(0, -1)
    });
  };

  // שינוי עיצוב "מכאן והלאה"
  const changeStyle = (key, value) => {
    updateActiveDoc({
      currentStyle: { ...activeDoc.currentStyle, [key]: value }
    });
  };

  return (
    <div className="border-t-4 border-gray-800 bg-gray-100 p-4 h-64 overflow-y-auto">
      <div className="flex justify-between mb-4">
        <h3 className="font-bold">עורך: {activeDoc.filename || 'מסמך ללא שם'}</h3>
        <button onClick={saveActiveDoc} className="bg-blue-600 text-white px-4 py-1 rounded">שמור (Save)</button>
      </div>

      {/* כפתורי סגנון */}
      <div className="flex gap-2 mb-4 bg-white p-2 rounded shadow-sm">
        <span>צבע:</span>
        <button onClick={() => changeStyle('color', 'black')} className="w-6 h-6 bg-black rounded"></button>
        <button onClick={() => changeStyle('color', 'red')} className="w-6 h-6 bg-red-600 rounded"></button>
        <button onClick={() => changeStyle('color', 'blue')} className="w-6 h-6 bg-blue-600 rounded"></button>
        
        <span className="ml-4">גודל:</span>
        <button onClick={() => changeStyle('fontSize', '16px')} className="border px-2 rounded">רגיל</button>
        <button onClick={() => changeStyle('fontSize', '24px')} className="border px-2 rounded font-bold">גדול</button>
      </div>

      {/* מקלדת וירטואלית בסיסית (ניתן להרחיב למערכים מלאים) */}
      <div className="grid grid-cols-10 gap-2 mb-2">
        {['א','ב','ג','ד','ה','ו','ז','ח','ט','י'].map(char => (
          <button key={char} onClick={() => handleKeyPress(char)} className="bg-white border rounded py-2 shadow-sm hover:bg-gray-50">{char}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => handleKeyPress(' ')} className="flex-grow bg-white border rounded py-2 shadow-sm">רווח</button>
        <button onClick={handleDelete} className="bg-red-100 border border-red-300 rounded px-4 py-2 text-red-800">מחק</button>
      </div>
    </div>
  );
}