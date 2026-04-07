// src/components/Workspace.jsx
import React, { useState, useRef } from 'react';
import TextDisplay from './TextDisplay';
import KeyboardPanel from './KeyboardPanel';
import { saveUserFile, loadUserFile, getUserFilesList, deleteUserFile } from '../utils/storage';

export default function Workspace({ username, onLogout }) {
  const [openDocs, setOpenDocs] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);
  const [editMode, setEditMode] = useState('content');
  // Feature 3 : caractère recherché (partagé entre KeyboardPanel et TextDisplay)
  const [searchChar, setSearchChar] = useState('');
  // Historique pour le Undo : { [docId]: [ ...états précédents du content ] }
  const historyRef = useRef({});

  const createNewDoc = () => {
    let counter = 1;
    const allExistingNames = new Set([
      ...openDocs.map(d => d.filename),
      ...getUserFilesList(username)
    ]);

    while (allExistingNames.has(`doc_${counter}`)) {
      counter++;
    }

    const newDoc = {
      id: Date.now().toString(),
      filename: `doc_${counter}`,
      content: [],
      currentStyle: { color: 'black', fontSize: '16px', fontFamily: 'Arial' }
    };
    
    setOpenDocs([...openDocs, newDoc]);
    setActiveDocId(newDoc.id);
    setEditMode('content');
  };
  
  const renameDoc = (id, newName) => {
    const docToRename = openDocs.find(d => d.id === id);
    
    if (docToRename && docToRename.filename !== newName) {
      deleteUserFile(username, docToRename.filename);
      const updatedDoc = { ...docToRename, filename: newName };
      setOpenDocs(openDocs.map(doc => doc.id === id ? updatedDoc : doc));
      saveUserFile(username, newName, updatedDoc);
    }
  };
  
  const loadExistingFile = (filename) => {
    const data = loadUserFile(username, filename);
    if (data) {
      if (!openDocs.find(d => d.filename === filename)) {
        setOpenDocs([...openDocs, data]);
      }
      setActiveDocId(data.id);
      setEditMode('content');
    }
  };

  // Feature 7 : proposer de sauvegarder avant de fermer
  const closeDoc = (id) => {
    const doc = openDocs.find(d => d.id === id);
    if (!doc) return;
    const wantSave = window.confirm("האם לשמור לפני הסגירה?");
    if (wantSave) {
      saveUserFile(username, doc.filename, doc);
    }
    // Dans tous les cas on ferme
    setOpenDocs(openDocs.filter(d => d.id !== id));
    if (activeDocId === id) setActiveDocId(null);
    // Nettoyage de l'historique du doc fermé
    const newHistory = { ...historyRef.current };
    delete newHistory[id];
    historyRef.current = newHistory;
  };

  const permanentlyDeleteDoc = (id) => {
    const doc = openDocs.find(d => d.id === id);
    if (window.confirm(`אזהרה: האם למחוק את הקובץ "${doc.filename}" לצמיתות מזיכרון המחשב?`)) {
      deleteUserFile(username, doc.filename);
      setOpenDocs(openDocs.filter(d => d.id !== id));
      if (activeDocId === id) setActiveDocId(null);
      const newHistory = { ...historyRef.current };
      delete newHistory[id];
      historyRef.current = newHistory;
    }
  };

  // Feature 1 : updateActiveDoc sauvegarde l'état précédent du content avant chaque modif
  const updateActiveDoc = (updates) => {
    // On sauvegarde l'état courant du content dans l'historique AVANT la mise à jour
    if ('content' in updates) {
      const currentDoc = openDocs.find(d => d.id === activeDocId);
      if (currentDoc) {
        if (!historyRef.current[activeDocId]) {
          historyRef.current[activeDocId] = [];
        }
        historyRef.current[activeDocId] = [
          ...historyRef.current[activeDocId],
          currentDoc.content
        ];
      }
    }
    setOpenDocs(openDocs.map(doc =>
      doc.id === activeDocId ? { ...doc, ...updates } : doc
    ));
  };

  // Feature 1 : Undo — restaure le dernier état du content
  const undoActiveDoc = () => {
    if (!activeDocId) return;
    const history = historyRef.current[activeDocId];
    if (!history || history.length === 0) return;
    const previousContent = history[history.length - 1];
    historyRef.current[activeDocId] = history.slice(0, -1);
    setOpenDocs(openDocs.map(doc =>
      doc.id === activeDocId ? { ...doc, content: previousContent } : doc
    ));
  };

  const saveActiveDoc = () => {
    const docToSave = openDocs.find(d => d.id === activeDocId);
    if (docToSave) {
      saveUserFile(username, docToSave.filename, docToSave);
      alert('המסמך נשמר בהצלחה תחת השם: ' + docToSave.filename);
    }
  };

  const activeDoc = openDocs.find(d => d.id === activeDocId);
  const userFiles = getUserFilesList(username);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-4">
          <span className="font-bold border-l border-gray-600 pl-4">שלום, {username}</span>
          <button onClick={createNewDoc} className="bg-green-600 px-4 py-2 rounded font-bold hover:bg-green-500 transition-colors">
            + מסמך חדש
          </button>
          
          <select 
            onChange={(e) => loadExistingFile(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded cursor-pointer hover:bg-gray-600 transition-colors"
            value=""
          >
            <option value="" disabled>📂 פתח קובץ שמור...</option>
            {userFiles.map(file => <option key={file} value={file}>{file}</option>)}
          </select>
        </div>
        <button onClick={onLogout} className="bg-red-600 px-4 py-2 rounded font-bold hover:bg-red-500 transition-colors">התנתק</button>
      </div>

      <div className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto content-start bg-gray-200">
        {openDocs.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center mt-20 text-gray-400">
            <span className="text-6xl mb-4">📄</span>
            <h2 className="text-2xl font-bold">אין מסמכים פתוחים</h2>
          </div>
        ) : (
          openDocs.map(doc => (
            <TextDisplay 
              key={doc.id}
              doc={doc}
              isActive={doc.id === activeDocId}
              editMode={doc.id === activeDocId ? editMode : null} 
              onContentClick={() => { setActiveDocId(doc.id); setEditMode('content'); }} 
              onTitleClick={() => { setActiveDocId(doc.id); setEditMode('title'); }}     
              onClose={() => closeDoc(doc.id)}
              onDelete={() => permanentlyDeleteDoc(doc.id)}
              onRename={renameDoc}
              searchChar={searchChar}
            />
          ))
        )}
      </div>

      <KeyboardPanel 
        activeDoc={activeDoc}
        editMode={editMode} 
        updateActiveDoc={updateActiveDoc}
        saveActiveDoc={saveActiveDoc}
        undoActiveDoc={undoActiveDoc}
        searchChar={searchChar}
        setSearchChar={setSearchChar}
      />
    </div>
  );
}