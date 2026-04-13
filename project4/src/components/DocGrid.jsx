// ייבוא React לשימוש בעריכה היא קומפוננטה
import React from 'react';
// ייבוא רכיב TextDisplay להצגת כל מסמך בנפרד
import TextDisplay from './TextDisplay';

// ייצוא רכיב DocGrid - רשת המסמכים הפתוחים או הודעה שאין מסמכים
export default function DocGrid({
  // מערך של מסמכים הפתוחים כרגע
  openDocs,
  // מזהה של המסמך הפעיל כרגע
  activeDocId,
  // מצב העריכה הנוכחי (title, content, search, replace)
  editMode,
  // מחרוזת החיפוש לסימון בתוכן
  searchStr,
  // פונקציה שנקראת כאשר לוחצים על תוכן מסמך
  onContentClick,
  // פונקציה שנקראת כאשר לוחצים על כותרת מסמך
  onTitleClick,
  // פונקציה שנקראת כאשר סוגרים מסמך
  onClose,
  // פונקציה שנקראת כאשר מוחקים מסמך
  onDelete,
  // פונקציה שנקראת כאשר משנים את שם המסמך
  onRename,
}) {
  // אם אין מסמכים פתוחים - הצגת הודעה
  if (openDocs.length === 0) {
    return (
      // div עם הודעה והצגת מרכז המסך
      <div className="flex-grow p-6 flex flex-col items-center justify-center bg-gray-200 text-gray-400">
        {/* אייקון גדול של מסמך */}
        <span className="text-6xl mb-4">📄</span>
        {/* טקסט הודעה */}
        <h2 className="text-2xl font-bold">אין מסמכים פתוחים</h2>
      </div>
    );
  }

  // אם יש מסמכים - הצגת רשת המסמכים
  return (
    // div עם רשת אופקית (grid) של מסמכים - 1 עמודה בנייד, 2 בטאבלט, 3 בשולחן עבודה
    <div className="flex-grow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto content-start bg-gray-200">
      {/* לולאה על כל מסמך פתוח */}
      {openDocs.map(doc => (
        // TextDisplay component לכל מסמך
        <TextDisplay
          // שימוש בז'אנר מסמך כמפתח ייחודי ל-React
          key={doc.id}
          // העברת אובייקט המסמך
          doc={doc}
          // בדיקה אם זה המסמך הפעיל
          isActive={doc.id === activeDocId}
          // העברת מצב העריכה רק אם המסמך פעיל
          editMode={doc.id === activeDocId ? editMode : null}
          // העברת פונקציות לטיפול בלחיצות
          onContentClick={() => onContentClick(doc.id)}
          onTitleClick={() => onTitleClick(doc.id)}
          onClose={() => onClose(doc.id)}
          onDelete={() => onDelete(doc.id)}
          onRename={onRename}
          // העברת מחרוזת החיפוש לסימון בתוכן
          searchStr={searchStr}
        />
      ))}
    </div>
  );
}
