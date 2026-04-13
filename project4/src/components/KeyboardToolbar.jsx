// ייבוא React לשימוש בעריכה היא קומפוננטה
import React from 'react';

// מערך עם סוגי הפונטים הזמינים בחיישור
const fontFamilies = ['Arial', 'Georgia', 'Courier New'];

// ייצוא רכיב KeyboardToolbar - סרגל הכלים של המקלדת עם אפשרויות עיצוב
export default function KeyboardToolbar({
  // שפת המקלדת הנוכחית (HE, EN, SYMBOLS)
  keyboardLang,
  // פונקציה לשינוי שפת המקלדת
  setKeyboardLang,
  // מצב העריכה הנוכחי
  editMode,
  // אובייקט המסמך הפעיל
  activeDoc,
  // פונקציה לשינוי סגנון (צבע, גודל, פונט)
  onChangeStyle,
  // פונקציה להחלת הסגנון על כל הטקסט
  onApplyStyleToAll,
  // פונקציה לשמירת המסמך
  onSave,
}) {
  // בדיקה אם המצב הנוכחי הוא עריכת תוכן
  const isContentMode = editMode === 'content';

  return (
    // div ראשי של סרגל הכלים עם flexbox לסדר אג'נוטי
    <div className="flex flex-wrap justify-between items-center mb-2 mt-2 bg-white p-2 rounded shadow-sm gap-2">
      {/* קבוצה שמאלית של הסרגל */}
      <div className="flex flex-wrap items-center gap-3">

        {/* ========== בחירת שפה המקלדת ========== */}
        <div className="flex gap-1 border-l-2 pl-3 border-gray-300">
          {/* כפתור לעברית */}
          <button
            // שינוי שפה ל-HE בלחיצה
            onClick={() => setKeyboardLang('HE')}
            // סגנון דינמי - כחול אם נבחר, אפור אם לא
            className={`px-2 py-1 rounded ${keyboardLang === 'HE' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {/* טקסט כפתור */}
            עברית
          </button>
          {/* כפתור לאנגלית */}
          <button
            // שינוי שפה ל-EN בלחיצה
            onClick={() => setKeyboardLang('EN')}
            // סגנון דינמי - כחול אם נבחר, אפור אם לא
            className={`px-2 py-1 rounded ${keyboardLang === 'EN' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {/* טקסט כפתור */}
            English
          </button>
          {/* כפתור לסמלים */}
          <button
            // שינוי שפה ל-SYMBOLS בלחיצה
            onClick={() => setKeyboardLang('SYMBOLS')}
            // סגנון דינמי - כחול אם נבחר, אפור אם לא
            className={`px-2 py-1 rounded ${keyboardLang === 'SYMBOLS' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {/* טקסט כפתור */}
            #@!
          </button>
        </div>

        {/* ========== בחירת סוג פונט ========== */}
        <div className={`flex items-center gap-1 border-l-2 pl-3 border-gray-300 transition-opacity ${!isContentMode ? 'opacity-30 pointer-events-none' : ''}`}>
          {/* תווית לבחירת פונט */}
          <span className="text-sm font-bold">פונט:</span>
          {/* תיבת בחירה לסוג פונט */}
          <select
            // קבלת הפונט הנוכחי או Arial כברירת מחדל
            value={activeDoc.currentStyle.fontFamily || 'Arial'}
            // קריאה לפונקציה בשינוי הפונט
            onChange={(e) => onChangeStyle('fontFamily', e.target.value)}
            // סגנון תיבת בחירה
            className="border px-2 py-1 rounded bg-gray-50 text-sm"
          >
            {/* לולאה על כל הפונטים זמינים */}
            {fontFamilies.map(f => (
              // אפשרות עבור כל פונט עם תצוגה מקדימה
              <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
            ))}
          </select>
        </div>

        {/* ========== בחירת צבע ========== */}
        <div className={`flex items-center gap-1 border-l-2 pl-3 border-gray-300 transition-opacity ${!isContentMode ? 'opacity-30 pointer-events-none' : ''}`}>
          {/* תווית לבחירת צבע */}
          <span className="text-sm font-bold">צבע:</span>
          {/* כפתור צבע שחור */}
          <button onClick={() => onChangeStyle('color', 'black')} className="w-6 h-6 bg-black rounded cursor-pointer border border-gray-400" />
          {/* כפתור צבע אדום */}
          <button onClick={() => onChangeStyle('color', 'red')} className="w-6 h-6 bg-red-600 rounded cursor-pointer border border-gray-400" />
          {/* כפתור צבע כחול */}
          <button onClick={() => onChangeStyle('color', 'blue')} className="w-6 h-6 bg-blue-600 rounded cursor-pointer border border-gray-400" />
          {/* כפתור צבע ירוק */}
          <button onClick={() => onChangeStyle('color', 'green')} className="w-6 h-6 bg-green-600 rounded cursor-pointer border border-gray-400" />
        </div>

        {/* ========== בחירת גודל פונט ========== */}
        <div className={`flex items-center gap-1 border-l-2 pl-3 border-gray-300 transition-opacity ${!isContentMode ? 'opacity-30 pointer-events-none' : ''}`}>
          {/* תווית לבחירת גודל */}
          <span className="text-sm font-bold">גודל:</span>
          {/* כפתור לגודל רגיל */}
          <button onClick={() => onChangeStyle('fontSize', '16px')} className="border px-2 py-1 bg-gray-50 rounded hover:bg-gray-200 text-sm">רגיל</button>
          {/* כפתור לגודל גדול */}
          <button onClick={() => onChangeStyle('fontSize', '24px')} className="border px-2 py-1 bg-gray-50 rounded hover:bg-gray-200 font-bold">גדול</button>
        </div>

        {/* ========== כפתור להחלת סגנון על הכל ========== */}
        <div className={`flex items-center border-r-2 pr-3 border-gray-300 transition-opacity ${!isContentMode ? 'opacity-30 pointer-events-none' : ''}`}>
          {/* כפתור החלת סגנון על כל הטקסט */}
          <button
            // קריאה לפונקציה של החלה בלחיצה
            onClick={onApplyStyleToAll}
            // סגנון כפתור סגול כהה
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-2 rounded font-bold shadow"
          >
            {/* טקסט כפתור עם אייקון */}
            ✨ החל סגנון על הכל
          </button>
        </div>
      </div>

      {/* ========== כפתור שמירה בצד ימין ========== */}
      <button
        // קריאה לפונקציה שמירה בלחיצה
        onClick={onSave}
        // סגנון כפתור כחול
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow font-bold"
      >
        {/* טקסט הכפתור */}
        שמור מסמך
      </button>
    </div>
  );
}
