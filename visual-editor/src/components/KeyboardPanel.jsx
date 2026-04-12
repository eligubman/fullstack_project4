// src/components/KeyboardPanel.jsx
// Orchestrateur du panneau clavier : coordonne les 4 sous-composants et concentre la logique métier
import React, { useState } from 'react';
import EditModeBadge from './EditModeBadge';
import KeyboardToolbar from './KeyboardToolbar';
import SearchReplaceBar from './SearchReplaceBar';
import KeyboardKeys from './KeyboardKeys';

export default function KeyboardPanel({ activeDoc, editMode, setEditMode, updateActiveDoc, saveActiveDoc, undoActiveDoc, searchStr, setSearchStr, replaceStr, setReplaceStr }) {
  // État du clavier : géré via useState (pas de ref, pas de DOM direct)
  const [keyboardLang, setKeyboardLang] = useState('HE');

  if (!activeDoc) return (
    <div className="p-4 bg-gray-200 text-center font-bold text-gray-600 border-t-4 border-gray-800">
      בחר או צור טקסט לעריכה כדי להתחיל...
    </div>
  );

  // --- Logique de frappe ---
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

  // --- Logique de suppression ---
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
      if (window.confirm('למחוק את שם המסמך?')) updateActiveDoc({ filename: '' });
    } else if (editMode === 'search') {
      setSearchStr('');
    } else if (editMode === 'replace') {
      setReplaceStr('');
    } else {
      if (window.confirm('למחוק את כל הטקסט במסמך?')) updateActiveDoc({ content: [] });
    }
  };

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
      while (end > 0 && content[end - 1].char === ' ') end--;
      while (end > 0 && content[end - 1].char !== ' ') end--;
      updateActiveDoc({ content: content.slice(0, end) });
    }
  };

  // --- Logique de style ---
  const handleChangeStyle = (key, value) => {
    updateActiveDoc({ currentStyle: { ...activeDoc.currentStyle, [key]: value } });
  };

  const handleApplyStyleToAll = () => {
    const { color, fontSize, fontFamily } = activeDoc.currentStyle;
    const newContent = activeDoc.content.map(c => ({
      ...c, color, fontSize, fontFamily: fontFamily || 'Arial',
    }));
    updateActiveDoc({ content: newContent });
  };

  // --- Logique de remplacement ---
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
            fontFamily: activeDoc.content[i].fontFamily,
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

  return (
    <div className="border-t-4 border-gray-800 bg-gray-100 p-3 flex flex-col relative" style={{ minHeight: '18rem' }}>

      <EditModeBadge editMode={editMode} />

      <KeyboardToolbar
        keyboardLang={keyboardLang}
        setKeyboardLang={setKeyboardLang}
        editMode={editMode}
        activeDoc={activeDoc}
        onChangeStyle={handleChangeStyle}
        onApplyStyleToAll={handleApplyStyleToAll}
        onSave={saveActiveDoc}
      />

      <SearchReplaceBar
        editMode={editMode}
        searchStr={searchStr}
        replaceStr={replaceStr}
        onSearchClick={() => setEditMode('search')}
        onReplaceClick={() => setEditMode('replace')}
        onReplaceAll={handleReplaceAll}
      />

      <KeyboardKeys
        keyboardLang={keyboardLang}
        onKeyPress={handleKeyPress}
        onDelete={handleDelete}
        onDeleteWord={handleDeleteWord}
        onDeleteAll={handleDeleteAll}
        onUndo={undoActiveDoc}
      />
    </div>
  );
}