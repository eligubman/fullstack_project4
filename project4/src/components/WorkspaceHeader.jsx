// ייבוא React לשימוש בעריכה היא קומפוננטה
import React from 'react';

// ייצוא רכיב WorkspaceHeader - כותרת העליונה של מרחב העבודה
export default function WorkspaceHeader({ 
  // שם המשתמש המחובר כעת
  username, 
  // רשימת קבצים שמורים של המשתמש
  userFiles, 
  // פונקציה ליצירת מסמך חדש
  onNewDoc, 
  // פונקציה לטעינת קובץ קיים
  onLoadFile, 
  // פונקציה להתנתקות
  onLogout 
}) {
  return (
    // div ראשי של הכותרת עם רקע אפור כהה
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md z-10">
      {/* קבוצה שמאלית של הכותרת - מידע וכפתורים */}
      <div className="flex items-center gap-4">
        {/* טקסט שלום עם שם המשתמש */}
        <span className="font-bold border-l border-gray-600 pl-4">שלום, {username}</span>

        {/* כפתור ליצירת מסמך חדש */}
        <button
          // קריאה לפונקציית onNewDoc בעת לחיצה
          onClick={onNewDoc}
          // סגנון כפתור ירוק
          className="bg-green-600 px-4 py-2 rounded font-bold hover:bg-green-500 transition-colors"
        >
          {/* טקסט הכפתור עם אייקון */}
          + מסמך חדש
        </button>

        {/* תיבת בחירה לפתיחת קובץ שמור */}
        <select
          // קריאה לפונקציית onLoadFile עם שם הקובץ שנבחר
          onChange={(e) => onLoadFile(e.target.value)}
          // סגנון תיבת בחירה אפורה
          className="bg-gray-700 text-white p-2 rounded cursor-pointer hover:bg-gray-600 transition-colors"
          // ערך ברירת מחדל ריק (שום קובץ לא נבחר)
          value=""
        >
          {/* אפשרות ברירת מחדל עם טקסט וועד */}
          <option value="" disabled>📂 פתח קובץ שמור...</option>
          {/* לולאה על כל קבצי המשתמש */}
          {userFiles.map(file => (
            // אפשרות עבור כל קובץ
            <option key={file} value={file}>{file}</option>
          ))}
        </select>
      </div>

      {/* כפתור התנתקות בצד ימין */}
      <button
        // קריאה לפונקציית onLogout בעת לחיצה
        onClick={onLogout}
        // סגנון כפתור אדום
        className="bg-red-600 px-4 py-2 rounded font-bold hover:bg-red-500 transition-colors"
      >
        {/* טקסט הכפתור */}
        התנתק
      </button>
    </div>
  );
}
