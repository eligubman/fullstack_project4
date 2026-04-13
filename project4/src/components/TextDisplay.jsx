// ייבוא React לשימוש בעריכה היא קומפוננטה
import React from 'react';
// ייבוא רכיב DocContent להצגת תוכן המסמך
import DocContent from './DocContent';

// ייצוא רכיב TextDisplay - כרטיסיה של מסמך יחיד עם כותרת וכפתורים
export default function TextDisplay({ 
  // אובייקט המסמך
  doc, 
  // האם זה המסמך הפעיל כעת
  isActive, 
  // מצב העריכה הנוכחי (רק אם המסמך פעיל)
  editMode, 
  // פונקציה בלחיצה על תוכן
  onContentClick, 
  // פונקציה בלחיצה על כותרת
  onTitleClick, 
  // פונקציה בלחיצה על סגור
  onClose, 
  // פונקציה בלחיצה על מחק
  onDelete, 
  // פונקציה לשינוי שם אחרת גם לא מתשמשת כאן
  onRename, 
  // מחרוזת החיפוש
  searchStr 
}) {
  return (
    // div הכרטיסיה הראשי עם גבול דינמי וצל בהתאם לפעילות
    <div
      className={`border-2 flex flex-col p-4 rounded bg-white min-h-[200px] relative transition-all ${
        // אם פעיל - גבול כחול וצל גדול הגדלה קטנה של הכרטיסיה
        isActive ? 'border-blue-500 shadow-xl scale-[1.01]' : 'border-gray-300 opacity-60 hover:opacity-90'
      }`}
    >
      {/* ====== חלק הכותרת: שם ומסמך + כפתורים ====== */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        {/* הקליק על הכותרת לעריכה שם */}
        <div
          // סגנון לעריכה ואינטראקציה
          className="flex-grow cursor-pointer flex items-center"
          // קרא לפונקציה בלחיצה על שם המסמך עם עצירת הפצה
          onClick={(e) => { e.stopPropagation(); onTitleClick(); }}
        >
          <span
            // סגנון דינמי של כותרת עם צבעים המשתנים כאשר בחרו לעריכה
            className={`font-bold text-lg px-2 py-1 rounded transition-colors flex items-center ${
              isActive && editMode === 'title'
                ? 'bg-blue-100 border-b-2 border-blue-500 text-blue-800'
                : 'hover:bg-gray-100 text-gray-600 border-b-2 border-transparent'
            }`}
            // טיפ (tooltip) בעומדה
            title="לחץ כאן כדי לערוך את שם הקובץ עם המקלדת הווירטואלית"
          >
            {/* הדפסת שם המסמך */}
            {doc.filename || ' '}
            {/* סימן כוכב אדום אם אין שינויים שלא נשמרו */}
            {doc.isDirty && (
              <span className="text-red-500 text-xl leading-none ml-1" title="מסמך זה מכיל שינויים שלא נשמרו">*</span>
            )}
            {/* סמן עריכה מסתנן כאשר בחרו לעריכת כותרת */}
            {isActive && editMode === 'title' && (
              <span className="animate-pulse ml-1 text-blue-500">|</span>
            )}
            {/* אייקון עיפרון להצגת שזאפשר לערוך */}
            <span className="mr-2 text-sm opacity-50">✎</span>
          </span>
        </div>

        {/* קבוצת כפתורים בימין הכרטיסיה */}
        <div className="flex gap-2">
          {/* כפתור מחיקה קבוע של המסמך */}
          <button
            // עצירת הפצה וקריאה לפונקציית מחיקה
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            // סגנון כפתור אדום
            className="text-red-500 hover:text-white border hover:bg-red-500 border-red-500 font-bold px-2 py-1 rounded transition-colors text-sm"
            // טיפ בעומדה
            title="מחק קובץ לצמיתות"
          >
            {/* טקסט כפתור עם אייקון */}
            מחק 🗑️
          </button>
          {/* כפתור סגירה של הכרטיסיה */}
          <button
            // עצירת הפצה וקריאה לפונקציית סגירה
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            // סגנון כפתור אפור
            className="text-gray-400 hover:text-white border hover:bg-gray-500 border-gray-400 font-bold px-2 py-1 rounded transition-colors text-sm"
            // טיפ בעומדה
            title="סגור חלון"
          >
            {/* טקסט כפתור עם X */}
            סגור X
          </button>
        </div>
      </div>

      {/* ====== חלק התוכן: DocContent ====== */}
      <DocContent
        // העברת אובייקט המסמך
        doc={doc}
        // בדיקת פעילות
        isActive={isActive}
        // העברת מצב העריכה
        editMode={editMode}
        // העברת מחרוזת החיפוש לסימון
        searchStr={searchStr}
        // פונקציה בלחיצה על תוכן
        onClick={onContentClick}
      />
    </div>
  );
}
