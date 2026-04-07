// src/components/Workspace.jsx
import React, { useState } from 'react';
import TextDisplay from './TextDisplay';
import KeyboardPanel from './KeyboardPanel';
import { saveUserFile, loadUserFile, getUserFilesList, deleteUserFile } from '../utils/storage';

export default function Workspace({ username, onLogout }) {
  const [openDocs, setOpenDocs] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);
  const [editMode, setEditMode] = useState('content'); 

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
      currentStyle: { color: 'black', fontSize: '16px' }
    };
    
    setOpenDocs([...openDocs, newDoc]);
    setActiveDocId(newDoc.id);
    setEditMode('content');
  };
  
  // התיקון שלנו: עכשיו המערכת מוחקת את השם הישן ושומרת את החדש!
  const renameDoc = (id, newName) => {
    const docToRename = openDocs.find(d => d.id === id);
    
    if (docToRename && docToRename.filename !== newName) {
      // 1. נמחק את הקובץ עם השם הישן מה-Local Storage
      deleteUserFile(username, docToRename.filename);
      
      // 2. ניצור עותק מעודכן של המסמך עם השם החדש
      const updatedDoc = { ...docToRename, filename: newName };
      
      // 3. נעדכן את המסך (State)
      setOpenDocs(openDocs.map(doc => doc.id === id ? updatedDoc : doc));
      
      // 4. נשמור מיד את הקובץ עם השם החדש כדי שלא יאבד
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

  const closeDoc = (id) => {
    if(window.confirm("האם לסגור את המסמך מהתצוגה?")) {
      setOpenDocs(openDocs.filter(doc => doc.id !== id));
      if (activeDocId === id) setActiveDocId(null);
    }
  };

  const permanentlyDeleteDoc = (id) => {
    const doc = openDocs.find(d => d.id === id);
    if (window.confirm(`אזהרה: האם למחוק את הקובץ "${doc.filename}" לצמיתות מזיכרון המחשב?`)) {
      deleteUserFile(username, doc.filename);
      setOpenDocs(openDocs.filter(d => d.id !== id));
      if (activeDocId === id) setActiveDocId(null);
    }
  };

  const updateActiveDoc = (updates) => {
    setOpenDocs(openDocs.map(doc => 
      doc.id === activeDocId ? { ...doc, ...updates } : doc
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
              onRename={renameDoc} // הוספנו את הגישה לפונקציה שתוקנה
            />
          ))
        )}
      </div>

      <KeyboardPanel 
        activeDoc={activeDoc}
        editMode={editMode} 
        updateActiveDoc={updateActiveDoc} 
        saveActiveDoc={saveActiveDoc}
      />
    </div>
  );
}