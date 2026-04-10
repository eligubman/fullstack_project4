// src/components/KeyboardPanel.jsx
import React, { useState } from 'react';

export default function KeyboardPanel({ activeDoc, editMode, setEditMode, updateActiveDoc, saveActiveDoc, undoActiveDoc, searchStr, setSearchStr, replaceStr, setReplaceStr }) {
  const [keyboardLang, setKeyboardLang] = useState('HE');

  if (!activeDoc) return (
    <div className="p-4 bg-gray-200 text-center font-bold text-gray-600 border-t-4 border-gray-800">
      בחר או צור טקסט לעריכה כדי להתחיל...
    </div>
  );

  const layouts = {
    HE: ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת','ף','ץ','ן','ם','ך'],
    EN: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
    SYMBOLS: ['1','2','3','4','5','6','7','8','9','0','!','@','#','$','%','^','&','*','(',')','_','-','+','=', '😀', '👍']
  };

  const fontFamilies = ['Arial', 'Georgia', 'Courier New'];

  const handleKeyPress = (char) => {
    if (editMode === 'title') {
      updateActiveDoc({ filename: activeDoc.filename + char });
    } else if (editMode === 'search') {
      setSearchStr(prev => prev + char);
    } else if (editMode === 'replace') {
      setReplaceStr(prev => prev + char);
    } else {
      const newChar = {
        char,
        color: activeDoc.currentStyle.color,
        fontSize: activeDoc.currentStyle.fontSize,
        fontFamily: activeDoc.currentStyle.fontFamily || 'Arial',
      };
      updateActiveDoc({ content: [...activeDoc.content, newChar] });
    }
  };

  const handleDelete = () => {
    if (editMode === 'title') {
      updateActiveDoc({ filename: activeDoc.filename.slice(0, -1) });
    } else if (editMode === 'search') {
      setSearchStr(prev => prev.slice(0, -1));
    } else if (editMode === 'replace') {
      setReplaceStr(prev => prev.slice(0, -1));
    } else {
      updateActiveDoc({ content: activeDoc.content.slice(0, -1) });
    }
  };

  const handleDeleteAll = () => {
    if (editMode === 'title') {
      if (window.confirm("למחוק את שם המסמך?")) updateActiveDoc({ filename: '' });
    } else if (editMode === 'search') {
      setSearchStr('');
    } else if (editMode === 'replace') {
      setReplaceStr('');
    } else {
      if (window.confirm("למחוק את כל הטקסט במסמך?")) updateActiveDoc({ content: [] });
    }
  };

  // התיקון: עכשיו הפונקציה מוחקת מילה שלמה *בכל* מצב עריכה
  const handleDeleteWord = () => {
    if (editMode === 'title') {
      const words = activeDoc.filename.trimEnd().split(' ');
      words.pop();
      updateActiveDoc({ filename: words.join(' ') + (words.length > 0 ? ' ' : '') });
    } else if (editMode === 'search') {
      const words = searchStr.trimEnd().split(' ');
      words.pop();
      setSearchStr(words.join(' ') + (words.length > 0 ? ' ' : ''));
    } else if (editMode === 'replace') {
      const words = replaceStr.trimEnd().split(' ');
      words.pop();
      setReplaceStr(words.join(' ') + (words.length > 0 ? ' ' : ''));
    } else {
      const content = [...activeDoc.content];
      let end = content.length;
      while (end > 0 && content[end - 1].char === ' ') end--; // מוריד רווחים בסוף
      while (end > 0 && content[end - 1].char !== ' ') end--; // מוריד את המילה
      updateActiveDoc({ content: content.slice(0, end) });
    }
  };

  const changeStyle = (key, value) => {
    updateActiveDoc({
      currentStyle: { ...activeDoc.currentStyle, [key]: value }
    });
  };

  const applyStyleToAll = () => {
    const { color, fontSize, fontFamily } = activeDoc.currentStyle;
    const newContent = activeDoc.content.map(c => ({
      ...c, color, fontSize, fontFamily: fontFamily || 'Arial',
    }));
    updateActiveDoc({ content: newContent });
  };

  const handleReplaceAll = () => {
    if (!searchStr) return;
    const searchChars = Array.from(searchStr);
    const replaceChars = Array.from(replaceStr);
    const newContent = [];
    let i = 0;

    while (i < activeDoc.content.length) {
      let match = false;
      if (i <= activeDoc.content.length - searchChars.length) {
        match = true;
        for (let j = 0; j < searchChars.length; j++) {
          if (activeDoc.content[i + j].char !== searchChars[j]) { match = false; break; }
        }
      }

      if (match) {
        for (let k = 0; k < replaceChars.length; k++) {
          newContent.push({
            char: replaceChars[k],
            color: activeDoc.content[i].color,
            fontSize: activeDoc.content[i].fontSize,
            fontFamily: activeDoc.content[i].fontFamily
          });
        }
        i += searchChars.length;
      } else {
        newContent.push(activeDoc.content[i]);
        i++;
      }
    }
    updateActiveDoc({ content: newContent });
    setSearchStr(''); 
  };

  const modeTitles = {
    title: 'כותרת המסמך ✎',
    content: 'תוכן המסמך 📄',
    search: 'תיבת חיפוש 🔍',
    replace: 'תיבת החלפה ✏️'
  };

  return (
    <div className="border-t-4 border-gray-800 bg-gray-100 p-3 flex flex-col relative" style={{ minHeight: '18rem' }}>
      
      <div className="absolute top-0 right-1/2 transform translate-x-1/2 -mt-4 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold shadow border border-yellow-500">
        עורך כעת: {modeTitles[editMode]}
      </div>

      <div className="flex flex-wrap justify-between items-center mb-2 mt-2 bg-white p-2 rounded shadow-sm gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 border-l-2 pl-3 border-gray-300">
            <button onClick={() => setKeyboardLang('HE')} className={`px-2 py-1 rounded ${keyboardLang === 'HE' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>עברית</button>
            <button onClick={() => setKeyboardLang('EN')} className={`px-2 py-1 rounded ${keyboardLang === 'EN' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>English</button>
            <button onClick={() => setKeyboardLang('SYMBOLS')} className={`px-2 py-1 rounded ${keyboardLang === 'SYMBOLS' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>#@!</button>
          </div>

          <div className={`flex items-center gap-1 border-l-2 pl-3 border-gray-300 transition-opacity ${editMode !== 'content' ? 'opacity-30 pointer-events-none' : ''}`}>
            <span className="text-sm font-bold">פונט:</span>
            <select value={activeDoc.currentStyle.fontFamily || 'Arial'} onChange={(e) => changeStyle('fontFamily', e.target.value)} className="border px-2 py-1 rounded bg-gray-50 text-sm">
              {fontFamilies.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
            </select>
          </div>

          <div className={`flex items-center gap-1 border-l-2 pl-3 border-gray-300 transition-opacity ${editMode !== 'content' ? 'opacity-30 pointer-events-none' : ''}`}>
            <span className="text-sm font-bold">צבע:</span>
            <button onClick={() => changeStyle('color', 'black')} className="w-6 h-6 bg-black rounded cursor-pointer border border-gray-400"></button>
            <button onClick={() => changeStyle('color', 'red')} className="w-6 h-6 bg-red-600 rounded cursor-pointer border border-gray-400"></button>
            <button onClick={() => changeStyle('color', 'blue')} className="w-6 h-6 bg-blue-600 rounded cursor-pointer border border-gray-400"></button>
            <button onClick={() => changeStyle('color', 'green')} className="w-6 h-6 bg-green-600 rounded cursor-pointer border border-gray-400"></button>
          </div>

          <div className={`flex items-center gap-1 border-l-2 pl-3 border-gray-300 transition-opacity ${editMode !== 'content' ? 'opacity-30 pointer-events-none' : ''}`}>
            <span className="text-sm font-bold">גודל:</span>
            <button onClick={() => changeStyle('fontSize', '16px')} className="border px-2 py-1 bg-gray-50 rounded hover:bg-gray-200 text-sm">רגיל</button>
            <button onClick={() => changeStyle('fontSize', '24px')} className="border px-2 py-1 bg-gray-50 rounded hover:bg-gray-200 font-bold">גדול</button>
          </div>

          <div className={`flex items-center border-r-2 pr-3 border-gray-300 transition-opacity ${editMode !== 'content' ? 'opacity-30 pointer-events-none' : ''}`}>
            <button onClick={applyStyleToAll} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-2 rounded font-bold shadow">
              ✨ החל סגנון על הכל
            </button>
          </div>
        </div>
        <button onClick={saveActiveDoc} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow font-bold">שמור מסמך</button>
      </div>

      <div className={`flex flex-wrap items-center gap-3 mb-2 bg-white p-2 rounded shadow-sm transition-opacity ${editMode === 'title' ? 'opacity-30 pointer-events-none' : ''}`}>
        <span className="text-sm font-bold">חיפוש והחלפה:</span>
        <div onClick={() => setEditMode('search')} className={`border rounded px-3 py-1 min-w-[120px] min-h-[32px] flex items-center cursor-pointer text-sm ${editMode === 'search' ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200' : 'bg-gray-50 hover:bg-gray-100'}`}>
          {searchStr || <span className="text-gray-400">חפש מילה...</span>}
          {editMode === 'search' && <span className="animate-pulse ml-1 text-yellow-600">|</span>}
        </div>
        <div onClick={() => setEditMode('replace')} className={`border rounded px-3 py-1 min-w-[120px] min-h-[32px] flex items-center cursor-pointer text-sm ${editMode === 'replace' ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200' : 'bg-gray-50 hover:bg-gray-100'}`}>
          {replaceStr || <span className="text-gray-400">החלף ב...</span>}
          {editMode === 'replace' && <span className="animate-pulse ml-1 text-teal-600">|</span>}
        </div>
        <button onClick={handleReplaceAll} className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-4 py-1 rounded text-sm shadow">החלף הכל</button>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="flex flex-wrap gap-2 mb-2 justify-center" dir={keyboardLang === 'EN' ? 'ltr' : 'rtl'}>
          {layouts[keyboardLang].map(char => (
            <button key={char} onClick={() => handleKeyPress(char)} className="bg-white border border-gray-300 rounded shadow-sm w-10 h-10 text-lg hover:bg-blue-50 focus:outline-none">{char}</button>
          ))}
        </div>
        <div className="flex gap-2 justify-center flex-wrap max-w-3xl mx-auto">
          <button onClick={() => handleKeyPress(' ')} className="flex-grow bg-white border border-gray-300 rounded shadow-sm py-3 text-lg font-bold hover:bg-blue-50">רווח (Space)</button>
          <button onClick={handleDelete} className="bg-red-100 hover:bg-red-200 border border-red-300 rounded px-4 py-3 text-red-800 font-bold">מחק תו</button>
          {/* הלחצנים שוחררו - אין יותר opacity-30 כשנמצאים בכותרת/חיפוש! */}
          <button onClick={handleDeleteWord} className="bg-orange-100 hover:bg-orange-200 border border-orange-300 rounded px-4 py-3 text-orange-800 font-bold">
            מחק מילה
          </button>
          <button onClick={handleDeleteAll} className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-3 font-bold">נקה הכל</button>
          <button onClick={undoActiveDoc} className="bg-gray-300 hover:bg-gray-400 border border-gray-400 rounded px-4 py-3 font-bold text-gray-800">
            בטל (Undo)
          </button>
        </div>
      </div>
    </div>
  );
}