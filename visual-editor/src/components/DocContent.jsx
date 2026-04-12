// src/components/DocContent.jsx
// Responsabilité unique : rendu du contenu d'un document (caractères stylisés + surlignage de recherche + curseur)
import React from 'react';

/**
 * Calcule les indices des caractères qui correspondent à la chaîne de recherche.
 * Retourne un Set des indices à surligner.
 */
function computeMatchIndices(content, searchStr) {
  const matchIndices = new Set();
  if (!searchStr || searchStr.length === 0) return matchIndices;

  const searchChars = Array.from(searchStr);
  for (let i = 0; i <= content.length - searchChars.length; i++) {
    let match = true;
    for (let j = 0; j < searchChars.length; j++) {
      if (content[i + j].char !== searchChars[j]) {
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
  return matchIndices;
}

export default function DocContent({ doc, isActive, editMode, searchStr, onClick }) {
  const matchIndices = computeMatchIndices(doc.content, searchStr);

  return (
    <div
      className={`flex-grow p-4 rounded overflow-y-auto text-right cursor-text transition-colors ${
        isActive && editMode === 'content' ? 'bg-green-50 ring-1 ring-green-200' : 'bg-gray-50'
      }`}
      dir="rtl"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
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
                padding: isHighlighted ? '0 1px' : '0',
              }}
            >
              {charObj.char}
            </span>
          );
        })}

        {/* Curseur clignotant */}
        {isActive && editMode === 'content' && (
          <span
            className="animate-pulse font-light"
            style={{
              color: doc.currentStyle?.color || 'black',
              fontSize: doc.currentStyle?.fontSize || '16px',
              fontFamily: doc.currentStyle?.fontFamily || 'Arial',
              marginLeft: '2px',
            }}
          >
            |
          </span>
        )}
      </div>
    </div>
  );
}
