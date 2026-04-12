// src/components/Workspace.jsx
import React, { useState } from 'react';
import WorkspaceHeader from './WorkspaceHeader';
import DocGrid from './DocGrid';
import KeyboardPanel from './KeyboardPanel';
import { saveUserFile, loadUserFile, getUserFilesList, deleteUserFile } from '../utils/storage';

export default function Workspace({ username, onLogout }) {
  const [openDocs, setOpenDocs] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);
  const [editMode, setEditMode] = useState('content');
  const [searchStr, setSearchStr] = useState('');
  const [replaceStr, setReplaceStr] = useState('');

  // Migration useRef → useState : React peut maintenant suivre ces états
  const [docHistory, setDocHistory] = useState({});
  const [searchHistory, setSearchHistory] = useState([]);
  const [replaceHistory, setReplaceHistory] = useState([]);

  const generateUniqueId = () => Date.now().toString() + Math.random().toString(36).substring(2, 9);

  const createNewDoc = () => {
    let counter = 1;
    const allExistingNames = new Set([
      ...openDocs.map(d => d.filename),
      ...getUserFilesList(username)
    ]);
    while (allExistingNames.has(`doc_${counter}`)) counter++;

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
    setDocHistory(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const permanentlyDeleteDoc = (id) => {
    const doc = openDocs.find(d => d.id === id);
    if (!doc) return;
    if (window.confirm(`אזהרה: האם למחוק את הקובץ "${doc.filename}" לצמיתות מזיכרון המחשב?`)) {
      deleteUserFile(username, doc.savedFilename || doc.filename);
      setOpenDocs(prev => prev.filter(d => d.id !== id));
      setActiveDocId(prev => (prev === id ? null : prev));
      setDocHistory(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const updateActiveDoc = (updates) => {
    setOpenDocs(prevDocs => {
      const docIndex = prevDocs.findIndex(d => d.id === activeDocId);
      if (docIndex === -1) return prevDocs;
      const currentDoc = prevDocs[docIndex];
      if ('content' in updates) {
        setDocHistory(prev => ({
          ...prev,
          [activeDocId]: [...(prev[activeDocId] || []), currentDoc]
        }));
      }
      const updatedDocs = [...prevDocs];
      updatedDocs[docIndex] = { ...currentDoc, ...updates, isDirty: true };
      return updatedDocs;
    });
  };

  const handleSearchUpdate = (updater) => {
    setSearchStr(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setSearchHistory(h => [...h, prev]);
      return next;
    });
  };

  const handleReplaceUpdate = (updater) => {
    setReplaceStr(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setReplaceHistory(h => [...h, prev]);
      return next;
    });
  };

  const handleUndo = () => {
    if (editMode === 'title' || editMode === 'content') {
      if (!activeDocId) return;
      const history = docHistory[activeDocId];
      if (!history || history.length === 0) return;
      const previousDocState = history[history.length - 1];
      setDocHistory(prev => ({
        ...prev,
        [activeDocId]: prev[activeDocId].slice(0, -1)
      }));
      setOpenDocs(prevDocs =>
        prevDocs.map(doc => doc.id === activeDocId ? { ...previousDocState, isDirty: true } : doc)
      );
    } else if (editMode === 'search') {
      if (searchHistory.length > 0) {
        setSearchStr(searchHistory[searchHistory.length - 1]);
        setSearchHistory(h => h.slice(0, -1));
      }
    } else if (editMode === 'replace') {
      if (replaceHistory.length > 0) {
        setReplaceStr(replaceHistory[replaceHistory.length - 1]);
        setReplaceHistory(h => h.slice(0, -1));
      }
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
      <WorkspaceHeader
        username={username}
        userFiles={userFiles}
        onNewDoc={createNewDoc}
        onLoadFile={loadExistingFile}
        onLogout={onLogout}
      />

      <DocGrid
        openDocs={openDocs}
        activeDocId={activeDocId}
        editMode={editMode}
        searchStr={searchStr}
        onContentClick={(id) => { setActiveDocId(id); setEditMode('content'); }}
        onTitleClick={(id) => { setActiveDocId(id); setEditMode('title'); }}
        onClose={closeDoc}
        onDelete={permanentlyDeleteDoc}
        onRename={renameDoc}
      />

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