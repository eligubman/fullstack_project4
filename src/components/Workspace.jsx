// src/components/Workspace.jsx
import React, { useState } from 'react';
import TextDisplay from './TextDisplay';
import KeyboardPanel from './KeyboardPanel';
import { saveUserFile, loadUserFile, getUserFilesList } from '../utils/storage';

export default function Workspace({ username, onLogout }) {
  // ניהול מסמכים פתוחים: מערך של אובייקטים
  const [openDocs, setOpenDocs] = useState([]);
  const [activeDocId, setActiveDocId] = useState(null);

  const createNewDoc = () => {
    const newDoc = {
      id: Date.now().toString(),
      filename: `doc_${openDocs.length + 1}`,
      content: [],
      currentStyle: { color: 'black', fontSize: '16px' }
    };
    setOpenDocs([...openDocs, newDoc]);
    setActiveDocId(newDoc.id);
  };

  const loadExistingFile = (filename) => {
    const data = loadUserFile(username, filename);
    if (data) {
      // מוודאים שהקובץ לא פתוח כבר
      if (!openDocs.find(d => d.filename === filename)) {
        setOpenDocs([...openDocs, data]);
      }
      setActiveDocId(data.id);
    }
  };

  const closeDoc = (id) => {
    // דרישה: הצעה לשמירה לפני סגירה (גרסה פשוטה)
    if(window.confirm("האם לסגור? שים לב ששינויים שלא נשמרו יאבדו.")) {
      setOpenDocs(openDocs.filter(doc => doc.id !== id));
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
      alert('נשמר בהצלחה ב-Local Storage!');
    }
  };

  const activeDoc = openDocs.find(d => d.id === activeDocId);
  const userFiles = getUserFilesList(username);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* תפריט עליון */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
          <span className="font-bold mr-4">שלום, {username}</span>
          <button onClick={createNewDoc} className="bg-green-600 px-3 py-1 rounded mr-2 hover:bg-green-700">חדש (New)</button>
          
          <select 
            onChange={(e) => loadExistingFile(e.target.value)}
            className="bg-gray-700 text-white p-1 rounded ml-2"
            defaultValue=""
          >
            <option value="" disabled>פתח קובץ שמור...</option>
            {userFiles.map(file => <option key={file} value={file}>{file}</option>)}
          </select>
        </div>
        <button onClick={onLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">התנתק</button>
      </div>

      {/* אזור המסמכים (הצד העליון של המסך) */}
      <div className="flex-grow p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto content-start">
        {openDocs.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 mt-10">אין מסמכים פתוחים. צור חדש או פתח קובץ שמור.</div>
        ) : (
          openDocs.map(doc => (
            <TextDisplay 
              key={doc.id}
              doc={doc}
              isActive={doc.id === activeDocId}
              onFocus={() => setActiveDocId(doc.id)}
              onClose={() => closeDoc(doc.id)}
            />
          ))
        )}
      </div>

      {/* אזור המקלדת (הצד התחתון של המסך) */}
      <KeyboardPanel 
        activeDoc={activeDoc} 
        updateActiveDoc={updateActiveDoc} 
        saveActiveDoc={saveActiveDoc}
      />
    </div>
  );
}