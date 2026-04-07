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

  // מסך התחברות בסיסי - חלק ד'
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">התחברות לעורך הטקסט</h2>
          <p className="text-gray-600 mb-4">הזן שם משתמש כדי לגשת לקבצים שלך</p>
          <input 
            type="text" 
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            className="border p-2 mb-4 w-full rounded"
            placeholder="שם משתמש..."
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded w-full">היכנס</button>
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