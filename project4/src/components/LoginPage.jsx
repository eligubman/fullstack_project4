import React, { useState } from 'react';
import { registerAccount, verifyLogin, loginUser } from '../utils/storage';

// רכיב עמוד ההתחברות - מכיל שני מצבים: התחברות והרשמה
export default function LoginPage({ onLoginSuccess }) {
  // מצב: 'login' או 'register'
  const [mode, setMode] = useState('login');
  // ערכי שדות הטופס
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // הצגת/הסתרת הסיסמה
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // הודעות למשתמש
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  // מצב טעינה
  const [loading, setLoading] = useState(false);

  // איפוס הטופס בעת מעבר בין מצבים
  const switchMode = (newMode) => {
    setMode(newMode);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMsg('');
    setShowPassword(false);
    setShowConfirm(false);
  };

  // טיפול בשליחת טופס ההתחברות
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!username.trim() || !password) {
      setError('יש למלא את כל השדות');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const valid = verifyLogin(username, password);
      if (valid) {
        loginUser(username.trim().toLowerCase());
        onLoginSuccess(username.trim().toLowerCase());
      } else {
        setError('שם משתמש או סיסמה שגויים');
      }
      setLoading(false);
    }, 300);
  };

  // טיפול בשליחת טופס ההרשמה
  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = registerAccount(username, password);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccessMsg('החשבון נוצר בהצלחה! כעת תוכל להתחבר.');
        setMode('login');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-200"
      dir="rtl"
    >
      <div className="bg-white rounded shadow-md w-full max-w-sm overflow-hidden">

        {/* כותרת עליונה - זהה לסגנון WorkspaceHeader */}
        <div className="bg-gray-800 text-white p-4 flex items-center gap-3">
          <span className="text-2xl">✏️</span>
          <div>
            <h1 className="font-bold text-lg leading-tight">עורך הטקסט</h1>
            <p className="text-gray-400 text-xs">סביבת עריכה חכמה ואישית</p>
          </div>
        </div>

        {/* כרטיסיות מצב */}
        <div className="flex border-b border-gray-200 bg-gray-100">
          <button
            id="tab-login"
            onClick={() => switchMode('login')}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              mode === 'login'
                ? 'bg-white text-gray-800 border-b-2 border-gray-800'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            התחברות
          </button>
          <button
            id="tab-register"
            onClick={() => switchMode('register')}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              mode === 'register'
                ? 'bg-white text-gray-800 border-b-2 border-gray-800'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            הרשמה
          </button>
        </div>

        {/* גוף הכרטיס */}
        <div className="p-6">

          {/* הודעת הצלחה */}
          {successMsg && (
            <div className="mb-4 bg-green-50 border border-green-300 text-green-700 rounded p-3 text-sm flex items-center gap-2">
              <span>✅</span> {successMsg}
            </div>
          )}

          {/* הודעת שגיאה */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-300 text-red-700 rounded p-3 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* טופס התחברות */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} noValidate className="flex flex-col gap-4">

              {/* שדה שם משתמש */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-700">שם משתמש</label>
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="הכנס שם משתמש..."
                  className="border-2 border-gray-300 p-2.5 rounded focus:outline-none focus:border-gray-600 transition-colors text-gray-800"
                  autoFocus
                  autoComplete="username"
                />
              </div>

              {/* שדה סיסמה */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-700">סיסמה</label>
                <div className="flex border-2 border-gray-300 rounded focus-within:border-gray-600 transition-colors overflow-hidden">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="הכנס סיסמה..."
                    className="flex-1 p-2.5 outline-none text-gray-800"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="px-3 text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors text-base"
                    tabIndex={-1}
                    aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 px-6 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ מתחבר...' : 'היכנס למערכת'}
              </button>
            </form>
          )}

          {/* טופס הרשמה */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} noValidate className="flex flex-col gap-4">

              {/* שדה שם משתמש */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-700">
                  שם משתמש{' '}
                  <span className="text-gray-400 font-normal text-xs">(לפחות 3 תווים)</span>
                </label>
                <input
                  id="register-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="בחר שם משתמש..."
                  className="border-2 border-gray-300 p-2.5 rounded focus:outline-none focus:border-gray-600 transition-colors text-gray-800"
                  autoFocus
                  autoComplete="username"
                />
              </div>

              {/* שדה סיסמה */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-700">
                  סיסמה{' '}
                  <span className="text-gray-400 font-normal text-xs">(לפחות 4 תווים)</span>
                </label>
                <div className="flex border-2 border-gray-300 rounded focus-within:border-gray-600 transition-colors overflow-hidden">
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="בחר סיסמה..."
                    className="flex-1 p-2.5 outline-none text-gray-800"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="px-3 text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors text-base"
                    tabIndex={-1}
                    aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* שדה אישור סיסמה */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-700">אישור סיסמה</label>
                <div className="flex border-2 border-gray-300 rounded focus-within:border-gray-600 transition-colors overflow-hidden">
                  <input
                    id="register-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="הכנס שוב את הסיסמה..."
                    className="flex-1 p-2.5 outline-none text-gray-800"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(p => !p)}
                    className="px-3 text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors text-base"
                    tabIndex={-1}
                    aria-label={showConfirm ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  >
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                id="register-submit"
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 px-6 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ יוצר חשבון...' : 'צור חשבון חדש'}
              </button>
            </form>
          )}

          {/* קישור מעבר בין מצבים */}
          <div className="mt-5 text-center text-sm text-gray-500 border-t border-gray-100 pt-4">
            {mode === 'login' ? (
              <span>
                אין לך חשבון?{' '}
                <button
                  id="switch-to-register"
                  onClick={() => switchMode('register')}
                  className="text-gray-700 font-bold hover:underline"
                >
                  הירשם כאן
                </button>
              </span>
            ) : (
              <span>
                כבר יש לך חשבון?{' '}
                <button
                  id="switch-to-login"
                  onClick={() => switchMode('login')}
                  className="text-gray-700 font-bold hover:underline"
                >
                  התחבר כאן
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
