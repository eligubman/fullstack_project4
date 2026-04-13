// ייבוא React ו-useState לניהול מצב הרכיב
import React, { useState } from 'react';
// ייבוא רכיב WorkspaceHeader - כותרת עליונה עם שם משתמש וכפתורים
import WorkspaceHeader from './WorkspaceHeader';
// ייבוא רכיב DocGrid - רשת מסמכים גדולה
import DocGrid from './DocGrid';
// ייבוא רכיב KeyboardPanel - המקלדת הווירטואלית
import KeyboardPanel from './KeyboardPanel';
// ייבוא פונקציות לניהול קבצים ב-localStorage
import { saveUserFile, loadUserFile, getUserFilesList, deleteUserFile } from '../utils/storage';

// ייצוא רכיב Workspace - מרחב העבודה הראשי
export default function Workspace({ 
  // שם המשתמש המחובר כעת
  username, 
  // פונקציה להתנתקות
  onLogout 
}) {
  // מצב מערך של מסמכים הפתוחים כרגע בעריכה
  const [openDocs, setOpenDocs] = useState([]);
  // מצב מזהה של המסמך הפעיל כעת
  const [activeDocId, setActiveDocId] = useState(null);
  // מצב מצב העריכה הנוכחי (title, content, search, replace)
  const [editMode, setEditMode] = useState('content');
  // מצב מחרוזת החיפוש הנוכחית
  const [searchStr, setSearchStr] = useState('');
  // מצב מחרוזת ההחלפה הנוכחית
  const [replaceStr, setReplaceStr] = useState('');

  // מצב האוסף של ההיסטוריה - למטרת ביטול פעולות
  // משתמשים ב-setState בשביל לעקוב אחרי שינויים
  const [docHistory, setDocHistory] = useState({});
  // מצב מערך ההיסטוריה של חיפוserver
  const [searchHistory, setSearchHistory] = useState([]);
  // מצב מערך ההיסטוריה של החלפה
  const [replaceHistory, setReplaceHistory] = useState([]);

  // ====== פונקציה ליצירת מזהה ייחודי ======
  const generateUniqueId = () => 
    // שילוב טיימשטמפ עם מספר אקראי כדי ליצור מזהה ייחודי
    Date.now().toString() + Math.random().toString(36).substring(2, 9);

  // ====== פונקציה ליצירת מסמך חדש ======
  const createNewDoc = () => {
    // אתחול מונה להשם הידיעה
    let counter = 1;
    // יצירת set עם כל שמות הקבצים הקיימים (בתצוגה וגם בשמירה)
    const allExistingNames = new Set([
      // שמות הקבצים שפתוחים כעת
      ...openDocs.map(d => d.filename),
      // שמות קבצים שמורים של המשתמש
      ...getUserFilesList(username)
    ]);
    // הגדלת המונה עד שנמצא שם שלא בשימוש
    while (allExistingNames.has(`doc_${counter}`)) counter++;

    // יצירת אובייקט מסמך חדש
    const newDoc = {
      // מזהה ייחודי למסמך
      id: generateUniqueId(),
      // שם ברירת מחדל עם המונה
      filename: `doc_${counter}`,
      // שם הקובץ השמור (null כי עדיין לא נשמר)
      savedFilename: null,
      // תוכן ריק למסמך חדש
      content: [],
      // סגנון ברירת מחדל (שחור, גודל 16px, Arial)
      currentStyle: { color: 'black', fontSize: '16px', fontFamily: 'Arial' },
      // סימון שלא יש שינויים שלא נשמרו
      isDirty: false
    };

    // הוספת המסמך החדש לרשימת המסמכים הפתוחים
    setOpenDocs(prev => [...prev, newDoc]);
    // הגדרת המסמך החדש כמסמך פעיל
    setActiveDocId(newDoc.id);
    // הגדרת מצב העריכה לתוכן
    setEditMode('content');
  };

  // ====== פונקציה לטעינת קובץ קיים ======
  const loadExistingFile = (filename) => {
    // טעינת נתוני הקובץ מ-localStorage
    const data = loadUserFile(username, filename);
    // אם הקובץ קיים בזיכרון
    if (data) {
      // הגדרת שם הקובץ השמור
      data.savedFilename = filename;
      // סימון שאין שינויים שלא נשמרו (זה קובץ שמור)
      data.isDirty = false;
      // אם לא יש מזהה - יצירת מזהה חדש
      if (!data.id) data.id = generateUniqueId();
      // הוספת הקובץ לרשימת המסמכים הפתוחים (אם הוא לא שם כבר)
      setOpenDocs(prev => {
        // בדיקה אם הקובץ כבר פתוח
        if (!prev.find(d => d.filename === filename)) 
          // הוספת הקובץ החדש
          return [...prev, data];
        // אם הוא כבר פתוח - אל תשנה כלום
        return prev;
      });
      // הגדרת הקובץ הטעון כמסמך פעיל
      setActiveDocId(data.id);
      // הגדרת מצב העריכה לתוכן
      setEditMode('content');
    }
  };

  // ====== פונקציה לשינוי שם של מסמך ======
  const renameDoc = (id, newName) => {
    // עדכון רשימת המסמכים הפתוחים
    setOpenDocs(prevDocs => {
      // חיפוש אינדקס של המסמך לשינוי
      const docIndex = prevDocs.findIndex(d => d.id === id);
      // אם המסמך לא נמצא - החזר את הרשימה כמו שהיא
      if (docIndex === -1) return prevDocs;
      // קבלת המסמך לשינוי שם
      const docToRename = prevDocs[docIndex];
      // אם השם החדש זהה לשם הישן - אל תשנה כלום
      if (docToRename.filename === newName) return prevDocs;
      // מחיקת הקובץ הישן מ-localStorage
      deleteUserFile(username, docToRename.filename);
      // יצירת אובייקט מסמך מעודכן עם שם חדש
      const updatedDoc = { 
        ...docToRename, 
        // שם הקובץ החדש
        filename: newName, 
        // שם הקובץ השמור החדש
        savedFilename: newName, 
        // סימון שאין שינויים שלא נשמרו
        isDirty: false 
      };
      // שמירת הקובץ החדש עם השם החדש
      saveUserFile(username, newName, updatedDoc);
      // יצירת רשימה חדשה עם האובייקט המעודכן
      const newDocs = [...prevDocs];
      newDocs[docIndex] = updatedDoc;
      return newDocs;
    });
  };

  // ====== פונקציה לסגירת מסמך ======
  const closeDoc = (id) => {
    // חיפוש המסמך לסגירה
    const doc = openDocs.find(d => d.id === id);
    // אם המסמך לא נמצא - יציאה מהפונקציה
    if (!doc) return;
    // בדיקה אם יש שינויים שלא נשמרו
    if (doc.isDirty) {
      // שאלת המשתמש האם רוצה לשמור לפני סגירה
      const wantSave = window.confirm(`הקובץ "${doc.filename}" לא נשמר. האם לשמור לפני הסגירה?`);
      // אם אמר כן - שמירת הקובץ
      if (wantSave) {
        // יצירת אובייקט קובץ לשמירה עם סימון שנשמר
        const docToSave = { ...doc, isDirty: false, savedFilename: doc.filename };
        saveUserFile(username, doc.filename, docToSave);
      }
    }
    // הסרת המסמך מרשימת המסמכים הפתוחים
    setOpenDocs(prev => prev.filter(d => d.id !== id));
    // אם זה המסמך הפעיל - הגדרת פעיל ל-null
    setActiveDocId(prev => (prev === id ? null : prev));
    // מחיקת ההיסטוריה של המסמך
    setDocHistory(prev => {
      // יצירת עותק של ההיסטוריה
      const next = { ...prev };
      // מחיקת ההיסטוריה של המסמך
      delete next[id];
      return next;
    });
  };

  // ====== פונקציה למחיקה קבוע של מסמך ======
  const permanentlyDeleteDoc = (id) => {
    // חיפוש המסמך למחיקה
    const doc = openDocs.find(d => d.id === id);
    // אם המסמך לא נמצא - יציאה מהפונקציה
    if (!doc) return;
    // שאלת משתמש עם אזהרה אם בטוח שרוצה למחוק לצמיתות
    if (window.confirm(`אזהרה: האם למחוק את הקובץ "${doc.filename}" לצמיתות מזיכרון המחשב?`)) {
      // מחיקת הקובץ מ-localStorage
      deleteUserFile(username, doc.savedFilename || doc.filename);
      // הסרת המסמך מרשימת המסמכים הפתוחים
      setOpenDocs(prev => prev.filter(d => d.id !== id));
      // אם זה המסמך הפעיל - הגדרת פעיל ל-null
      setActiveDocId(prev => (prev === id ? null : prev));
      // מחיקת ההיסטוריה של המסמך
      setDocHistory(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  // ====== פונקציה לעדכון המסמך הפעיל ======
  const updateActiveDoc = (updates) => {
    // עדכון רשימת המסמכים הפתוחים
    setOpenDocs(prevDocs => {
      // חיפוש אינדקס של המסמך הפעיל
      const docIndex = prevDocs.findIndex(d => d.id === activeDocId);
      // אם המסמך הפעיל לא נמצא - החזר את הרשימה כמו שהיא
      if (docIndex === -1) return prevDocs;
      // קבלת המסמך הנוכחי
      const currentDoc = prevDocs[docIndex];
      // אם עדכון כולל שינוי תוכן - שמור את המצב הקודם להיסטוריה
      if ('content' in updates) {
        setDocHistory(prev => ({
          ...prev,
          // הוסף את המצב הקודם לרשימת ההיסטוריה של המסמך
          [activeDocId]: [...(prev[activeDocId] || []), currentDoc]
        }));
      }
      // יצירת עותק של רשימת המסמכים
      const updatedDocs = [...prevDocs];
      // עדכון המסמך הפעיל עם הרשימה החדשה, וסימון כשינוי שלא נשמר
      updatedDocs[docIndex] = { ...currentDoc, ...updates, isDirty: true };
      return updatedDocs;
    });
  };

  // ====== פונקציה לעדכון מחרוזת החיפוש עם היסטוריה ======
  const handleSearchUpdate = (updater) => {
    // עדכון מחרוזת החיפוש
    setSearchStr(prev => {
      // קבלת ערך חדש - אם פונקציה, קרא אותה, אחרת קח את הערך
      const next = typeof updater === 'function' ? updater(prev) : updater;
      // הוסף את הערך הקודם להיסטוריה
      setSearchHistory(h => [...h, prev]);
      // החזר את הערך החדש
      return next;
    });
  };

  // ====== פונקציה לעדכון מחרוזת ההחלפה עם היסטוריה ======
  const handleReplaceUpdate = (updater) => {
    // עדכון מחרוזת ההחלפה
    setReplaceStr(prev => {
      // קבלת ערך חדש - אם פונקציה, קרא אותה, אחרת קח את הערך
      const next = typeof updater === 'function' ? updater(prev) : updater;
      // הוסף את הערך הקודם להיסטוריה
      setReplaceHistory(h => [...h, prev]);
      // החזר את הערך החדש
      return next;
    });
  };

  // ====== פונקציה לביטול פעולה אחרונה ======
  const handleUndo = () => {
    // אם בעריכת כותרת או תוכן
    if (editMode === 'title' || editMode === 'content') {
      // אם אין מסמך פעיל - יציאה מהפונקציה
      if (!activeDocId) return;
      // קבלת ההיסטוריה של המסמך הפעיל
      const history = docHistory[activeDocId];
      // אם אין היסטוריה או היא ריקה - יציאה מהפונקציה
      if (!history || history.length === 0) return;
      // קבלת המצב הקודם מהיסטוריה
      const previousDocState = history[history.length - 1];
      // עדכון ההיסטוריה - הסרת המצב האחרון
      setDocHistory(prev => ({
        ...prev,
        [activeDocId]: prev[activeDocId].slice(0, -1)
      }));
      // החזרת המסמך למצבו הקודם
      setOpenDocs(prevDocs =>
        prevDocs.map(doc => 
          // אם זה המסמך הפעיל - החזר למצב הקודם
          doc.id === activeDocId ? { ...previousDocState, isDirty: true } : doc
        )
      );
    } 
    // אם בעריכת חיפוש
    else if (editMode === 'search') {
      // אם יש היסטוריה
      if (searchHistory.length > 0) {
        // החזר למחרוזת החיפוש הקודמת
        setSearchStr(searchHistory[searchHistory.length - 1]);
        // הסר את המצב האחרון מההיסטוריה
        setSearchHistory(h => h.slice(0, -1));
      }
    } 
    // אם בעריכת החלפה
    else if (editMode === 'replace') {
      // אם יש היסטוריה
      if (replaceHistory.length > 0) {
        // החזר למחרוזת ההחלפה הקודמת
        setReplaceStr(replaceHistory[replaceHistory.length - 1]);
        // הסר את המצב האחרון מההיסטוריה
        setReplaceHistory(h => h.slice(0, -1));
      }
    }
  };

  // ====== פונקציה לשמירת המסמך הפעיל ======
  const saveActiveDoc = () => {
    // חיפוש המסמך הפעיל
    const docToSave = openDocs.find(d => d.id === activeDocId);
    // אם המסמך הפעיל קיים
    if (docToSave) {
      // אם היה שם שמor קודם ולא זהה לשם הנוכחי
      if (docToSave.savedFilename && docToSave.savedFilename !== docToSave.filename) {
        // מחק את הקובץ הישן
        deleteUserFile(username, docToSave.savedFilename);
      }
      // יצירת אובייקט קובץ לשמירה עם סימון שנשמר
      const updatedDocToSave = { 
        ...docToSave, 
        // הגדרת שם הקובץ השמור לשם הנוכחי
        savedFilename: docToSave.filename, 
        // סימון שאין שינויים שלא נשמרו
        isDirty: false 
      };
      // שמירת הקובץ ב-localStorage
      saveUserFile(username, updatedDocToSave.filename, updatedDocToSave);
      // עדכון רשימת המסמכים הפתוחים עם הקובץ המעודכן
      setOpenDocs(prevDocs => 
        prevDocs.map(doc => 
          // אם זה המסמך הפעיל - עדכן עם גרסה השמורה
          doc.id === activeDocId ? updatedDocToSave : doc
        )
      );
      // הצגת הודעת הצלחה
      alert('המסמך נשמר בהצלחה תחת השם: ' + updatedDocToSave.filename);
    }
  };

  // קבלת המסמך הפעיל מהרשימה
  const activeDoc = openDocs.find(d => d.id === activeDocId);
  // קבלת רשימת קבצים שמורים של המשתמש
  const userFiles = getUserFilesList(username);

  // החזרת ה-JSX של הרכיב
  return (
    // div ראשי של מרחב העבודה - flex column במלוא הגובה
    <div className="flex flex-col h-screen bg-gray-50">
      {/* כותרת עליונה עם שם משתמש וכפתורים */}
      <WorkspaceHeader
        // העברת שם המשתמש המחובר
        username={username}
        // העברת רשימת הקבצים השמורים
        userFiles={userFiles}
        // העברת פונקציית יצירת מסמך חדש
        onNewDoc={createNewDoc}
        // העברת פונקציית טעינת קובץ קיים
        onLoadFile={loadExistingFile}
        // העברת פונקציית התנתקות
        onLogout={onLogout}
      />

      {/* רשת המסמכים הפתוחים או הודעה שאין מסמכים */}
      <DocGrid
        // העברת מערך המסמכים הפתוחים
        openDocs={openDocs}
        // העברת מזהה של המסמך הפעיל
        activeDocId={activeDocId}
        // העברת מצב העריכה הנוכחי
        editMode={editMode}
        // העברת מחרוזת החיפוש
        searchStr={searchStr}
        // העברת פונקציה בלחיצה על תוכן מסמך
        onContentClick={(id) => { setActiveDocId(id); setEditMode('content'); }}
        // העברת פונקציה בלחיצה על כותרת מסמך
        onTitleClick={(id) => { setActiveDocId(id); setEditMode('title'); }}
        // העברת פונקציית סגירת מסמך
        onClose={closeDoc}
        // העברת פונקציית מחיקה קבוע של מסמך
        onDelete={permanentlyDeleteDoc}
        // העברת פונקציית שינוי שם מסמך
        onRename={renameDoc}
      />

      {/* המקלדת הווירטואלית עם כל הפעולות */}
      <KeyboardPanel
        // העברת המסמך הפעיל
        activeDoc={activeDoc}
        // העברת מצב העריכה הנוכחי
        editMode={editMode}
        // העברת פונקציית שינוי מצב עריכה
        setEditMode={setEditMode}
        // העברת פונקציית עדכון המסמך הפעיל
        updateActiveDoc={updateActiveDoc}
        // העברת פונקציית שמירת המסמך
        saveActiveDoc={saveActiveDoc}
        // העברת פונקציית ביטול פעולה
        undoActiveDoc={handleUndo}
        // העברת מחרוזת החיפוש הנוכחית
        searchStr={searchStr}
        // העברת פונקציית עדכון מחרוזת החיפוש
        setSearchStr={handleSearchUpdate}
        // העברת מחרוזת ההחלפה הנוכחית
        replaceStr={replaceStr}
        // העברת פונקציית עדכון מחרוזת ההחלפה
        setReplaceStr={handleReplaceUpdate}
      />
    </div>
  );
}