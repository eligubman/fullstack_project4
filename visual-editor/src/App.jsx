// src/App.jsx
import React, { useState, useEffect } from 'react';
import Workspace from './components/Workspace';
import { getCurrentUser, loginUser, logoutUser } from './utils/storage';

export default function App() {
  const [user, setUser] = useState(null);
  const [loginInput, setLoginInput] = useState('');

  // בדיקה בטעינה ראשונית האם מישהו כבר מחובר
  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginInput.trim()) {
      loginUser(loginInput);
      setUser(loginInput);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  // מסך התחברות בסיסי - עונה על חלק ד' בפרויקט
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md text-center max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">התחברות לעורך הטקסט</h2>
          <p className="text-gray-600 mb-6">הזן שם משתמש כדי לגשת לקבצים האישיים שלך</p>
          <input 
            type="text" 
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            className="border-2 border-gray-300 p-3 mb-4 w-full rounded focus:outline-none focus:border-blue-500"
            placeholder="שם משתמש (למשל: דוד)..."
            autoFocus
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded w-full transition-colors">
            היכנס למערכת
          </button>
        </form>
      </div>
    );
  }

  // אזור העבודה הראשי
  return (
    <div dir="rtl">
      <Workspace username={user} onLogout={handleLogout} />
    </div>
  );
}