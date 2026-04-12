// src/components/KeyboardToolbar.jsx
// Responsabilité unique : barre d'outils du clavier (langue, police, couleur, taille, sauvegarder)
import React from 'react';

const fontFamilies = ['Arial', 'Georgia', 'Courier New'];

export default function KeyboardToolbar({
  keyboardLang,
  setKeyboardLang,
  editMode,
  activeDoc,
  onChangeStyle,
  onApplyStyleToAll,
  onSave,
}) {
  const isContentMode = editMode === 'content';

  return (
    <div className="flex flex-wrap justify-between items-center mb-2 mt-2 bg-white p-2 rounded shadow-sm gap-2">
      <div className="flex flex-wrap items-center gap-3">

        {/* Sélecteur de langue */}
        <div className="flex gap-1 border-l-2 pl-3 border-gray-300">
          <button
            onClick={() => setKeyboardLang('HE')}
            className={`px-2 py-1 rounded ${keyboardLang === 'HE' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            עברית
          </button>
          <button
            onClick={() => setKeyboardLang('EN')}
            className={`px-2 py-1 rounded ${keyboardLang === 'EN' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            English
          </button>
          <button
            onClick={() => setKeyboardLang('SYMBOLS')}
            className={`px-2 py-1 rounded ${keyboardLang === 'SYMBOLS' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            #@!
          </button>
        </div>

        {/* Police */}
        <div className={`flex items-center gap-1 border-l-2 pl-3 border-gray-300 transition-opacity ${!isContentMode ? 'opacity-30 pointer-events-none' : ''}`}>
          <span className="text-sm font-bold">פונט:</span>
          <select
            value={activeDoc.currentStyle.fontFamily || 'Arial'}
            onChange={(e) => onChangeStyle('fontFamily', e.target.value)}
            className="border px-2 py-1 rounded bg-gray-50 text-sm"
          >
            {fontFamilies.map(f => (
              <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
            ))}
          </select>
        </div>

        {/* Couleur */}
        <div className={`flex items-center gap-1 border-l-2 pl-3 border-gray-300 transition-opacity ${!isContentMode ? 'opacity-30 pointer-events-none' : ''}`}>
          <span className="text-sm font-bold">צבע:</span>
          <button onClick={() => onChangeStyle('color', 'black')} className="w-6 h-6 bg-black rounded cursor-pointer border border-gray-400" />
          <button onClick={() => onChangeStyle('color', 'red')} className="w-6 h-6 bg-red-600 rounded cursor-pointer border border-gray-400" />
          <button onClick={() => onChangeStyle('color', 'blue')} className="w-6 h-6 bg-blue-600 rounded cursor-pointer border border-gray-400" />
          <button onClick={() => onChangeStyle('color', 'green')} className="w-6 h-6 bg-green-600 rounded cursor-pointer border border-gray-400" />
        </div>

        {/* Taille */}
        <div className={`flex items-center gap-1 border-l-2 pl-3 border-gray-300 transition-opacity ${!isContentMode ? 'opacity-30 pointer-events-none' : ''}`}>
          <span className="text-sm font-bold">גודל:</span>
          <button onClick={() => onChangeStyle('fontSize', '16px')} className="border px-2 py-1 bg-gray-50 rounded hover:bg-gray-200 text-sm">רגיל</button>
          <button onClick={() => onChangeStyle('fontSize', '24px')} className="border px-2 py-1 bg-gray-50 rounded hover:bg-gray-200 font-bold">גדול</button>
        </div>

        {/* Appliquer à tout */}
        <div className={`flex items-center border-r-2 pr-3 border-gray-300 transition-opacity ${!isContentMode ? 'opacity-30 pointer-events-none' : ''}`}>
          <button
            onClick={onApplyStyleToAll}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-2 rounded font-bold shadow"
          >
            ✨ החל סגנון על הכל
          </button>
        </div>
      </div>

      {/* Bouton sauvegarder */}
      <button
        onClick={onSave}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow font-bold"
      >
        שמור מסמך
      </button>
    </div>
  );
}
