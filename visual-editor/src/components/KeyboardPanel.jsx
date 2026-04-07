// src/components/KeyboardPanel.jsx
import React, { useState } from 'react';

export default function KeyboardPanel({ activeDoc, editMode, updateActiveDoc, saveActiveDoc, undoActiveDoc, searchChar, setSearchChar }) {
  const [keyboardLang, setKeyboardLang] = useState('HE');
  // Feature 4 : caractère de remplacement (local uniquement)
  const [replaceChar, setReplaceChar] = useState('');

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

  // Feature 6 : liste des polices disponibles
  const fontFamilies = ['Arial', 'Georgia', 'Courier New'];

  const handleKeyPress = (char) => {
    if (editMode === 'title') {
      updateActiveDoc({ filename: activeDoc.filename + char });
    } else {
      // Feature 6 : inclure fontFamily dans le nouvel objet caractère
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
    } else {
      updateActiveDoc({ content: activeDoc.content.slice(0, -1) });
    }
  };

  const handleDeleteAll = () => {
    if (editMode === 'title') {
      if (window.confirm("למחוק את שם המסמך?")) updateActiveDoc({ filename: '' });
    } else {
      if (window.confirm("למחוק את כל הטקסט במסמך?")) updateActiveDoc({ content: [] });
    }
  };

  // Feature 2 : supprimer le dernier mot (jusqu'au dernier espace ou début)
  const handleDeleteWord = () => {
    if (editMode !== 'content') return;
    const content = [...activeDoc.content];
    // Supprimer l'éventuel espace terminal d'abord
    let end = content.length;
    while (end > 0 && content[end - 1].char === ' ') end--;
    // Supprimer jusqu'au prochain espace ou au début
    while (end > 0 && content[end - 1].char !== ' ') end--;
    updateActiveDoc({ content: content.slice(0, end) });
  };

  const changeStyle = (key, value) => {
    updateActiveDoc({
      currentStyle: { ...activeDoc.currentStyle, [key]: value }
    });
  };

  // Feature 5 : appliquer couleur + taille + police sur tout le texte en une seule action
  const applyStyleToAll = () => {
    const { color, fontSize, fontFamily } = activeDoc.currentStyle;
    const newContent = activeDoc.content.map(c => ({
      ...c,
      color,
      fontSize,
      fontFamily: fontFamily || 'Arial',
    }));
    updateActiveDoc({ content: newContent });
  };

  // Feature 4 : remplacer tous les caractères correspondants
  const handleReplaceAll = () => {
    if (!searchChar) return;
    const newContent = activeDoc.content.map(c =>
      c.char === searchChar
        ? { ...c, char: replaceChar }
        : c
    );
    updateActiveDoc({ content: newContent });
    // Vider la recherche après remplacement
    setSearchChar('');
  };

  return (
    <div className="border-t-4 border-gray-800 bg-gray-100 p-3 flex flex-col relative" style={{ minHeight: '18rem' }}>
      
      {/* Indicateur du mode d'édition courant */}
      <div className="absolute top-0 right-1/2 transform translate-x-1/2 -mt-4 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold shadow border border-yellow-500">
        עורך כעת: {editMode === 'title' ? 'כותרת המסמך ✎' : 'תוכן המסמך 📄'}
      </div>

      {/* Barre de contrôles supérieure */}
      <div className="flex flex-wrap justify-between items-center mb-2 mt-2 bg-white p-2 rounded shadow-sm gap-2">
        <div className="flex flex-wrap items-center gap-3">

          {/* Choix de langue clavier */}
          <div className="flex gap-1 border-l-2 pl-3 border-gray-300">
            <button onClick={() => setKeyboardLang('HE')} className={`px-2 py-1 rounded ${keyboardLang === 'HE' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>עברית</button>
            <button onClick={() => setKeyboardLang('EN')} className={`px-2 py-1 rounded ${keyboardLang === 'EN' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>English</button>
            <button onClick={() => setKeyboardLang('SYMBOLS')} className={`px-2 py-1 rounded ${keyboardLang === 'SYMBOLS' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>#@!</button>
          </div>

          {/* Feature 6 : sélecteur de police */}
          <div className={`flex items-center gap-1 border-l-2 pl-3 border-gray-300 transition-opacity ${editMode === 'title' ? 'opacity-30 pointer-events-none' : ''}`}>
            <span className="text-sm font-bold">פונט:</span>
            <select
              value={activeDoc.currentStyle.fontFamily || 'Arial'}
              onChange={(e) => changeStyle('fontFamily', e.target.value)}
              className="border px-2 py-1 rounded bg-gray-50 text-sm"
            >
              {fontFamilies.map(f => (
                <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
              ))}
            </select>
          </div>

          {/* Couleur */}
          <div className={`flex items-center gap-1 border-l-2 pl-3 border-gray-300 transition-opacity ${editMode === 'title' ? 'opacity-30 pointer-events-none' : ''}`}>
            <span className="text-sm font-bold">צבע:</span>
            <button onClick={() => changeStyle('color', 'black')} className="w-6 h-6 bg-black rounded cursor-pointer border border-gray-400" title="שחור"></button>
            <button onClick={() => changeStyle('color', 'red')} className="w-6 h-6 bg-red-600 rounded cursor-pointer border border-gray-400" title="אדום"></button>
            <button onClick={() => changeStyle('color', 'blue')} className="w-6 h-6 bg-blue-600 rounded cursor-pointer border border-gray-400" title="כחול"></button>
            <button onClick={() => changeStyle('color', 'green')} className="w-6 h-6 bg-green-600 rounded cursor-pointer border border-gray-400" title="ירוק"></button>
          </div>

          {/* Taille */}
          <div className={`flex items-center gap-1 border-l-2 pl-3 border-gray-300 transition-opacity ${editMode === 'title' ? 'opacity-30 pointer-events-none' : ''}`}>
            <span className="text-sm font-bold">גודל:</span>
            <button onClick={() => changeStyle('fontSize', '16px')} className="border px-2 py-1 bg-gray-50 rounded hover:bg-gray-200 text-sm">רגיל</button>
            <button onClick={() => changeStyle('fontSize', '24px')} className="border px-2 py-1 bg-gray-50 rounded hover:bg-gray-200 font-bold">גדול</button>
          </div>

          {/* Feature 5 : bouton unique — applique couleur + taille + police sur tout le texte */}
          <div className={`flex items-center border-r-2 pr-3 border-gray-300 transition-opacity ${editMode === 'title' ? 'opacity-30 pointer-events-none' : ''}`}>
            <button
              onClick={applyStyleToAll}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-2 rounded font-bold shadow"
              title="החל צבע + גודל + פונט על כל הטקסט"
            >
              ✨ החל סגנון על הכל
            </button>
          </div>

        </div>

        <button onClick={saveActiveDoc} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow font-bold">שמור מסמך</button>
      </div>

      {/* Feature 3 & 4 : recherche / remplacement */}
      <div className={`flex flex-wrap items-center gap-2 mb-2 bg-white p-2 rounded shadow-sm transition-opacity ${editMode === 'title' ? 'opacity-30 pointer-events-none' : ''}`}>
        <span className="text-sm font-bold">חיפוש והחלפה:</span>
        <input
          type="text"
          maxLength={1}
          value={searchChar}
          onChange={(e) => { setSearchChar(e.target.value); if (!e.target.value) setSearchChar(''); }}
          placeholder="חפש תו..."
          className="border rounded px-2 py-1 w-20 text-sm text-center"
        />
        {/* Feature 3 : bouton de recherche */}
        <button
          onClick={() => setSearchChar(searchChar)}
          className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-3 py-1 rounded text-sm"
        >
          חפש
        </button>

        <input
          type="text"
          maxLength={1}
          value={replaceChar}
          onChange={(e) => setReplaceChar(e.target.value)}
          placeholder="החלף ב..."
          className="border rounded px-2 py-1 w-20 text-sm text-center"
        />
        {/* Feature 4 : bouton remplacer tout */}
        <button
          onClick={handleReplaceAll}
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-3 py-1 rounded text-sm"
        >
          החלף הכל
        </button>
        {searchChar && (
          <span className="text-xs text-gray-500">
            מסומן: <strong className="bg-yellow-200 px-1 rounded">{searchChar}</strong>
          </span>
        )}
      </div>

      {/* Clavier virtuel */}
      <div className="flex-grow overflow-y-auto">
        <div className="flex flex-wrap gap-2 mb-2 justify-center" dir={keyboardLang === 'EN' ? 'ltr' : 'rtl'}>
          {layouts[keyboardLang].map(char => (
            <button key={char} onClick={() => handleKeyPress(char)} className="bg-white border border-gray-300 rounded shadow-sm w-10 h-10 text-lg hover:bg-blue-50 focus:outline-none">{char}</button>
          ))}
        </div>
        <div className="flex gap-2 justify-center flex-wrap max-w-3xl mx-auto">
          <button onClick={() => handleKeyPress(' ')} className="flex-grow bg-white border border-gray-300 rounded shadow-sm py-3 text-lg font-bold hover:bg-blue-50">רווח (Space)</button>
          <button onClick={handleDelete} className="bg-red-100 hover:bg-red-200 border border-red-300 rounded px-4 py-3 text-red-800 font-bold">מחק תו</button>
          {/* Feature 2 : supprimer un mot */}
          <button
            onClick={handleDeleteWord}
            className={`bg-orange-100 hover:bg-orange-200 border border-orange-300 rounded px-4 py-3 text-orange-800 font-bold ${editMode === 'title' ? 'opacity-30 pointer-events-none' : ''}`}
          >
            מחק מילה
          </button>
          <button onClick={handleDeleteAll} className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-3 font-bold">נקה הכל</button>
          {/* Feature 1 : bouton Undo */}
          <button
            onClick={undoActiveDoc}
            className={`bg-gray-300 hover:bg-gray-400 border border-gray-400 rounded px-4 py-3 font-bold text-gray-800 ${editMode === 'title' ? 'opacity-30 pointer-events-none' : ''}`}
            title="בטל את הפעולה האחרונה"
          >
            בטל (Undo)
          </button>
        </div>
      </div>
    </div>
  );
}