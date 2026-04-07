// src/components/KeyboardPanel.jsx
import React, { useState } from 'react';

export default function KeyboardPanel({ activeDoc, editMode, updateActiveDoc, saveActiveDoc }) {
  const [keyboardLang, setKeyboardLang] = useState('HE');

  if (!activeDoc) return <div className="p-4 bg-gray-200 text-center font-bold text-gray-600 border-t-4 border-gray-800">בחר או צור טקסט לעריכה כדי להתחיל...</div>;

  const layouts = {
    HE: ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת','ף','ץ','ן','ם','ך'],
    EN: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
    SYMBOLS: ['1','2','3','4','5','6','7','8','9','0','!','@','#','$','%','^','&','*','(',')','_','-','+','=', '😀', '👍']
  };

  const handleKeyPress = (char) => {
    if (editMode === 'title') {
      // אם אנחנו עורכים כותרת - נוסיף למחרוזת של השם
      updateActiveDoc({ filename: activeDoc.filename + char });
    } else {
      // אם אנחנו עורכים טקסט - נוסיף אובייקט עם עיצוב לתוכן
      const newChar = { char, color: activeDoc.currentStyle.color, fontSize: activeDoc.currentStyle.fontSize };
      updateActiveDoc({ content: [...activeDoc.content, newChar] });
    }
  };

  const handleDelete = () => {
    if (editMode === 'title') {
      updateActiveDoc({ filename: activeDoc.filename.slice(0, -1) });
    } else {
      updateActiveDoc({ content: activeDoc.content.slice(0, -1) });
    }
  };

  const handleDeleteAll = () => {
    if (editMode === 'title') {
      if(window.confirm("למחוק את שם המסמך?")) updateActiveDoc({ filename: '' });
    } else {
      if(window.confirm("למחוק את כל הטקסט במסמך?")) updateActiveDoc({ content: [] });
    }
  };

  const changeStyle = (key, value) => {
    // עיצוב משפיע רק על התוכן, לא על הכותרת
    updateActiveDoc({
      currentStyle: { ...activeDoc.currentStyle, [key]: value }
    });
  };

  return (
    <div className="border-t-4 border-gray-800 bg-gray-100 p-4 h-72 flex flex-col relative">
      
      {/* חיווי ויזואלי של "מה אנחנו עורכים כרגע" */}
      <div className="absolute top-0 right-1/2 transform translate-x-1/2 -mt-4 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold shadow border border-yellow-500">
        עורך כעת: {editMode === 'title' ? 'כותרת המסמך ✎' : 'תוכן המסמך 📄'}
      </div>

      <div className="flex justify-between items-center mb-4 mt-2 bg-white p-2 rounded shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex gap-1 border-l-2 pl-4 border-gray-300">
            <button onClick={() => setKeyboardLang('HE')} className={`px-2 py-1 rounded ${keyboardLang === 'HE' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>עברית</button>
            <button onClick={() => setKeyboardLang('EN')} className={`px-2 py-1 rounded ${keyboardLang === 'EN' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>English</button>
            <button onClick={() => setKeyboardLang('SYMBOLS')} className={`px-2 py-1 rounded ${keyboardLang === 'SYMBOLS' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>#@!</button>
          </div>

          {/* כפתורי העיצוב (חסומים אם עורכים כותרת כי לכותרת אין עיצוב צבעוני לפי הדרישות) */}
          <div className={`flex items-center gap-2 transition-opacity ${editMode === 'title' ? 'opacity-30 pointer-events-none' : ''}`}>
            <span className="text-sm font-bold">צבע:</span>
            <button onClick={() => changeStyle('color', 'black')} className="w-6 h-6 bg-black rounded cursor-pointer border border-gray-400"></button>
            <button onClick={() => changeStyle('color', 'red')} className="w-6 h-6 bg-red-600 rounded cursor-pointer border border-gray-400"></button>
            <button onClick={() => changeStyle('color', 'blue')} className="w-6 h-6 bg-blue-600 rounded cursor-pointer border border-gray-400"></button>
            <button onClick={() => changeStyle('color', 'green')} className="w-6 h-6 bg-green-600 rounded cursor-pointer border border-gray-400"></button>
          </div>
          
          <div className={`flex items-center gap-2 border-r-2 pr-4 border-gray-300 transition-opacity ${editMode === 'title' ? 'opacity-30 pointer-events-none' : ''}`}>
            <span className="text-sm font-bold">גודל:</span>
            <button onClick={() => changeStyle('fontSize', '16px')} className="border px-2 py-1 bg-gray-50 rounded hover:bg-gray-200">רגיל</button>
            <button onClick={() => changeStyle('fontSize', '24px')} className="border px-2 py-1 bg-gray-50 rounded font-bold hover:bg-gray-200">גדול</button>
          </div>
        </div>
        <button onClick={saveActiveDoc} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow font-bold">שמור מסמך</button>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="flex flex-wrap gap-2 mb-3 justify-center" dir={keyboardLang === 'EN' ? 'ltr' : 'rtl'}>
          {layouts[keyboardLang].map(char => (
            <button key={char} onClick={() => handleKeyPress(char)} className="bg-white border border-gray-300 rounded shadow-sm w-10 h-10 text-lg hover:bg-blue-50 focus:outline-none">{char}</button>
          ))}
        </div>
        <div className="flex gap-2 justify-center max-w-2xl mx-auto">
          <button onClick={() => handleKeyPress(' ')} className="flex-grow bg-white border border-gray-300 rounded shadow-sm py-3 text-lg font-bold hover:bg-blue-50">רווח (Space)</button>
          <button onClick={handleDelete} className="bg-red-100 hover:bg-red-200 border border-red-300 rounded px-6 py-3 text-red-800 font-bold">מחק תו</button>
          <button onClick={handleDeleteAll} className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-3 font-bold">נקה הכל</button>
        </div>
      </div>
    </div>
  );
}