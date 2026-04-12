// src/components/DocGrid.jsx
// Responsabilité unique : grille des documents ouverts (ou écran vide si aucun doc)
import React from 'react';
import TextDisplay from './TextDisplay';

export default function DocGrid({
  openDocs,
  activeDocId,
  editMode,
  searchStr,
  onContentClick,
  onTitleClick,
  onClose,
  onDelete,
  onRename,
}) {
  if (openDocs.length === 0) {
    return (
      <div className="flex-grow p-6 flex flex-col items-center justify-center bg-gray-200 text-gray-400">
        <span className="text-6xl mb-4">📄</span>
        <h2 className="text-2xl font-bold">אין מסמכים פתוחים</h2>
      </div>
    );
  }

  return (
    <div className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto content-start bg-gray-200">
      {openDocs.map(doc => (
        <TextDisplay
          key={doc.id}
          doc={doc}
          isActive={doc.id === activeDocId}
          editMode={doc.id === activeDocId ? editMode : null}
          onContentClick={() => onContentClick(doc.id)}
          onTitleClick={() => onTitleClick(doc.id)}
          onClose={() => onClose(doc.id)}
          onDelete={() => onDelete(doc.id)}
          onRename={onRename}
          searchStr={searchStr}
        />
      ))}
    </div>
  );
}
