// src/components/WorkspaceHeader.jsx
// Responsabilité unique : barre de navigation supérieure (identité utilisateur, actions globales)
import React from 'react';

export default function WorkspaceHeader({ username, userFiles, onNewDoc, onLoadFile, onLogout }) {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md z-10">
      <div className="flex items-center gap-4">
        <span className="font-bold border-l border-gray-600 pl-4">שלום, {username}</span>

        <button
          onClick={onNewDoc}
          className="bg-green-600 px-4 py-2 rounded font-bold hover:bg-green-500 transition-colors"
        >
          + מסמך חדש
        </button>

        <select
          onChange={(e) => onLoadFile(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded cursor-pointer hover:bg-gray-600 transition-colors"
          value=""
        >
          <option value="" disabled>📂 פתח קובץ שמור...</option>
          {userFiles.map(file => (
            <option key={file} value={file}>{file}</option>
          ))}
        </select>
      </div>

      <button
        onClick={onLogout}
        className="bg-red-600 px-4 py-2 rounded font-bold hover:bg-red-500 transition-colors"
      >
        התנתק
      </button>
    </div>
  );
}
