// ייבוא של React ו-useState לניהול המצב של הרכיב
import React, { useState } from 'react';
// ייבוא של רכיב Workspace - מרחב העבודה הראשי
import Workspace from './components/Workspace';
// ייבוא של רכיב LoginPage - עמוד ההתחברות וההרשמה
import LoginPage from './components/LoginPage';
// ייבוא פונקציות לניהול המשתמש מאחסון מקומי
import { getCurrentUser, logoutUser } from './utils/storage';

// ייצוא הרכיב App כהרכיב ברירת המחדל
export default function App() {
  // יצירת מצב עבור המשתמש הנוכחי - קריאה לפונקציה שמחזירה משתמש קיים או null
  const [user, setUser] = useState(() => getCurrentUser());

  // פונקציה שמטפלת בהתחברות מוצלחת - מגיעה מרכיב LoginPage
  const handleLoginSuccess = (username) => {
    setUser(username);
  };

  // פונקציה שמטפלת בהתנתקות המשתמש
  const handleLogout = () => {
    // הסרת המשתמש מ-localStorage
    logoutUser();
    // איפוס מצב המשתמש ל-null
    setUser(null);
  };

  // אם אין משתמש מחובר - הצגת עמוד ההתחברות/הרשמה
  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // אם יש משתמש מחובר - הצגת מרחב העבודה
  return (
    <div dir="rtl">
      {/* רכיב Workspace המקבל שם המשתמש ופונקציית התנתקות */}
      <Workspace username={user} onLogout={handleLogout} />
    </div>
  );
}