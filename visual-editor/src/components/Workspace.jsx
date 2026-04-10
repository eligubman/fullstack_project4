// src/components/Workspace.jsx
import React, { useState, useRef } from 'react';
import TextDisplay from './TextDisplay';
import KeyboardPanel from './KeyboardPanel';
import { saveUserFile, loadUserFile, getUserFilesList, deleteUserFile } from '../utils/storage';

export default function Workspace({ username, onLogout }) {
  const [openDocs, setOpenDocs] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);
  const [editMode, setEditMode] = useState('content');
  const [searchStr, setSearchStr] = useState('');
  const [replaceStr, setReplaceStr] = useState('');
  
  const historyRef = useRef({});
  const searchHistoryRef = useRef([]);
  const replaceHistoryRef = useRef([]);

  const generateUniqueId = () => Date.now().toString() + Math.random().toString(36).substring(2, 9);

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
      id: generateUniqueId(),
      filename: `doc_${counter}`,
      savedFilename: null,
      content: [],
      currentStyle: { color: 'black', fontSize: '16px', fontFamily: 'Arial' },
      isDirty: false
    };
    
    setOpenDocs(prev => [...prev, newDoc]);
    setActiveDocId(newDoc.id);
    setEditMode('content');
  };
  
  const loadExistingFile = (filename) => {
    const data = loadUserFile(username, filename);
    if (data) {
      data.savedFilename = filename;
      data.isDirty = false;
      if (!data.id) data.id = generateUniqueId();

      setOpenDocs(prev => {
        if (!prev.find(d => d.filename === filename)) return [...prev, data];
        return prev;
      });
      setActiveDocId(data.id);
      setEditMode('content');
    }
  };

  const renameDoc = (id, newName) => {
    setOpenDocs(prevDocs => {
      const docIndex = prevDocs.findIndex(d => d.id === id);
      if (docIndex === -1) return prevDocs;

      const docToRename = prevDocs[docIndex];
      if (docToRename.filename === newName) return prevDocs;

      deleteUserFile(username, docToRename.filename);
      const updatedDoc = { ...docToRename, filename: newName, savedFilename: newName, isDirty: false };
      saveUserFile(username, newName, updatedDoc);

      const newDocs = [...prevDocs];
      newDocs[docIndex] = updatedDoc;
      return newDocs;
    });
  };

  const closeDoc = (id) => {
    const doc = openDocs.find(d => d.id === id);
    if (!doc) return;
    
    if (doc.isDirty) {
      const wantSave = window.confirm(`הקובץ "${doc.filename}" לא נשמר. האם לשמור לפני הסגירה?`);
      if (wantSave) {
        const docToSave = { ...doc, isDirty: false, savedFilename: doc.filename };
        saveUserFile(username, doc.filename, docToSave);
      }
    }

    setOpenDocs(prev => prev.filter(d => d.id !== id));
    setActiveDocId(prev => (prev === id ? null : prev));
    
    const newHistory = { ...historyRef.current };
    delete newHistory[id];
    historyRef.current = newHistory;
  };

  const permanentlyDeleteDoc = (id) => {
    const doc = openDocs.find(d => d.id === id);
    if (!doc) return;

    if (window.confirm(`אזהרה: האם למחוק את הקובץ "${doc.filename}" לצמיתות מזיכרון המחשב?`)) {
      deleteUserFile(username, doc.savedFilename || doc.filename);
      setOpenDocs(prev => prev.filter(d => d.id !== id));
      setActiveDocId(prev => (prev === id ? null : prev));
      const newHistory = { ...historyRef.current };
      delete newHistory[id];
      historyRef.current = newHistory;
    }
  };

  const updateActiveDoc = (updates) => {
    setOpenDocs(prevDocs => {
      const docIndex = prevDocs.findIndex(d => d.id === activeDocId);
      if (docIndex === -1) return prevDocs;

      const currentDoc = prevDocs[docIndex];

      if ('content' in updates) {
        if (!historyRef.current[activeDocId]) historyRef.current[activeDocId] = [];
        historyRef.current[activeDocId].push(currentDoc);
      }

      const updatedDocs = [...prevDocs];
      updatedDocs[docIndex] = { ...currentDoc, ...updates, isDirty: true };
      return updatedDocs;
    });
  };

  const handleSearchUpdate = (updater) => {
    setSearchStr(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      searchHistoryRef.current.push(prev);
      return next;
    });
  };

  const handleReplaceUpdate = (updater) => {
    setReplaceStr(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      replaceHistoryRef.current.push(prev);
      return next;
    });
  };

  const handleUndo = () => {
    if (editMode === 'title' || editMode === 'content') {
      if (!activeDocId) return;
      const history = historyRef.current[activeDocId];
      if (!history || history.length === 0) return;
      const previousDocState = history.pop();
      setOpenDocs(prevDocs => prevDocs.map(doc => doc.id === activeDocId ? { ...previousDocState, isDirty: true } : doc));
    } else if (editMode === 'search') {
      if (searchHistoryRef.current.length > 0) setSearchStr(searchHistoryRef.current.pop());
    } else if (editMode === 'replace') {
      if (replaceHistoryRef.current.length > 0) setReplaceStr(replaceHistoryRef.current.pop());
    }
  };

  const saveActiveDoc = () => {
    const docToSave = openDocs.find(d => d.id === activeDocId);
    if (docToSave) {
      if (docToSave.savedFilename && docToSave.savedFilename !== docToSave.filename) {
        deleteUserFile(username, docToSave.savedFilename);
      }
      const updatedDocToSave = { ...docToSave, savedFilename: docToSave.filename, isDirty: false };
      saveUserFile(username, updatedDocToSave.filename, updatedDocToSave);
      
      setOpenDocs(prevDocs => prevDocs.map(doc => doc.id === activeDocId ? updatedDocToSave : doc));
      alert('המסמך נשמר בהצלחה תחת השם: ' + updatedDocToSave.filename);
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
              searchStr={searchStr}
            />
          ))
        )}
      </div>

      <KeyboardPanel 
        activeDoc={activeDoc}
        editMode={editMode}
        setEditMode={setEditMode}
        updateActiveDoc={updateActiveDoc}
        saveActiveDoc={saveActiveDoc}
        undoActiveDoc={handleUndo}
        searchStr={searchStr}
        setSearchStr={handleSearchUpdate}
        replaceStr={replaceStr}
        setReplaceStr={handleReplaceUpdate}
      />
    </div>
  );
}