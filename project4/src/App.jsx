// ייבוא של React ו-useState לניהול המצב של הרכיב
import React, { useState } from 'react';
// ייבוא של רכיב Workspace - מרחב העבודה הראשי
import Workspace from './components/Workspace';
// ייבוא פונקציות לניהול המשתמש מאחסון מקומי
import { getCurrentUser, loginUser, logoutUser } from './utils/storage';

// ייצוא הרכיב App כהרכיב ברירת המחדל
export default function App() {
  // יצירת מצב עבור המשתמש הנוכחי - קריאה לפונקציה שמחזירה משתמש קיים או null
  const [user, setUser] = useState(() => getCurrentUser());
  // יצירת מצב לשם משתמש שהוזן בטופס ההתחברות
  const [loginInput, setLoginInput] = useState('');

  // פונקציה שמטפלת בשליחת טופס ההתחברות
  const handleLogin = (e) => {
    // הפסקת התנהגות ברירת המחדל של הטופס (רענון דף)
    e.preventDefault();
    // בדיקה אם שם המשתמש אינו ריק (לאחר הסרת רווחים)
    if (loginInput.trim()) {
      // שמירת המשתמש ב-localStorage
      loginUser(loginInput);
      // עדכון מצב המשתמש במרכיב
      setUser(loginInput);
    }
  };

  // פונקציה שמטפלת בהתנתקות המשתמש
  const handleLogout = () => {
    // הסרת המשתמש מ-localStorage
    logoutUser();
    // איפוס מצב המשתמש ל-null
    setUser(null);
  };

  // אם אין משתמש מחובר - הצגת מסך התחברות
  if (!user) {
    return (
      // div ראשי עם סגנון לאור מלא במרכז המסך
      <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
        {/* טופס התחברות */}
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md text-center max-w-sm w-full">
          {/* כותרת הטופס בעברית */}
          <h2 className="text-2xl font-bold mb-4 text-blue-600">התחברות לעורך הטקסט</h2>
          {/* טקסט הסבר תחת הכותרת */}
          <p className="text-gray-600 mb-6">הזן שם משתמש כדי לגשת לקבצים האישיים שלך</p>
          {/* שדה קלט לשם משתמש */}
          <input 
            type="text" 
            // קישור הערך של הקלט למצב loginInput
            value={loginInput}
            // עדכון המצב כאשר המשתמש כותב
            onChange={(e) => setLoginInput(e.target.value)}
            // סגנונות ה-input עם התמקדות כחול
            className="border-2 border-gray-300 p-3 mb-4 w-full rounded focus:outline-none focus:border-blue-500"
            // טקסט ברירת מחדל בתוך ה-input
            placeholder="שם משתמש (למשל: דוד)..."
            // ה-input במוקד אוטומטית כאשר העמוד נטען
            autoFocus
          />
          {/* כפתור שליחת הטופס */}
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded w-full transition-colors">
            היכנס למערכת
          </button>
        </form>
      </div>
    );
  }

  // אם יש משתמש מחובר - הצגת מרחב העבודה
  return (
    // div ראשי עם כיוון מימין לשמאל (עברית)
    <div dir="rtl">
      {/* רכיב Workspace המקבל שם המשתמש וחן פונקציית התנתקות */}
      <Workspace username={user} onLogout={handleLogout} />
    </div>
  );
}