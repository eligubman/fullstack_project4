// src/components/EditModeBadge.jsx
// Responsabilité unique : badge flottant indiquant le mode d'édition actif
import React from 'react';

const modeTitles = {
  title: 'כותרת המסמך ✎',
  content: 'תוכן המסמך 📄',
  search: 'תיבת חיפוש 🔍',
  replace: 'תיבת החלפה ✏️',
};

export default function EditModeBadge({ editMode }) {
  return (
    <div className="absolute top-0 right-1/2 transform translate-x-1/2 -mt-4 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold shadow border border-yellow-500">
      עורך כעת: {modeTitles[editMode]}
    </div>
  );
}
