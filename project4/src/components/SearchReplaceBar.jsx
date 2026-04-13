// ייבוא React לשימוש בעריכה היא קומפוננטה
import React from 'react';

// ייצוא רכיב SearchReplaceBar - סרגל החיפוש וההחלפה
export default function SearchReplaceBar({
  // מצב העריכה הנוכחי (title, content, search, replace)
  editMode,
  // מחרוזת החיפוש הנוכחית
  searchStr,
  // מחרוזת ההחלפה הנוכחית
  replaceStr,
  // פונקציה שנקראת כאשר לוחצים על שדה החיפוש
  onSearchClick,
  // פונקציה שנקראת כאשר לוחצים על שדה ההחלפה
  onReplaceClick,
  // פונקציה שנקראת כאשר לוחצים על כפתור "החלף הכל"
  onReplaceAll,
}) {
  // בדיקה אם יש לכך צפיפות לכפתורים - כאשר עורכים כותרת, הכפתורים מנוטרלים
  const isDisabled = editMode === 'title';

  return (
    // div ראשי עם flexbox לסידור אופקי של הרכיב
    <div className={`flex flex-wrap items-center gap-3 mb-2 bg-white p-2 rounded shadow-sm transition-opacity ${isDisabled ? 'opacity-30 pointer-events-none' : ''}`}>
      {/* תווית מילת מפתח לשדה החיפוש וההחלפה */}
      <span className="text-sm font-bold">חיפוש והחלפה:</span>

      {/* שדה קלט החיפוש */}
      <div
        // קריאה לפונקציית onSearchClick בעת לחיצה
        onClick={onSearchClick}
        // סגנון דינמי - אם בחרנו בחיפוש, הצבע הופך לצהוב
        className={`border rounded px-3 py-1 min-w-[120px] min-h-[32px] flex items-center cursor-pointer text-sm ${
          editMode === 'search'
            ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200'
            : 'bg-gray-50 hover:bg-gray-100'
        }`}
      >
        {/* הצגת מחרוזת החיפוש או טקסט ברירת מחדל */}
        {searchStr || <span className="text-gray-400">חפש מילה...</span>}
        {/* סמן מסתנן בוהק כאשר בחרנו בחיפוש */}
        {editMode === 'search' && <span className="animate-pulse ml-1 text-yellow-600">|</span>}
      </div>

      {/* שדה קלט ההחלפה */}
      <div
        // קריאה לפונקציית onReplaceClick בעת לחיצה
        onClick={onReplaceClick}
        // סגנון דינמי - אם בחרנו בהחלפה, הצבע הופך לטורקיז
        className={`border rounded px-3 py-1 min-w-[120px] min-h-[32px] flex items-center cursor-pointer text-sm ${
          editMode === 'replace'
            ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200'
            : 'bg-gray-50 hover:bg-gray-100'
        }`}
      >
        {/* הצגת מחרוזת ההחלפה או טקסט ברירת מחדל */}
        {replaceStr || <span className="text-gray-400">החלף ב...</span>}
        {/* סמן מסתנן בוהק כאשר בחרנו בהחלפה */}
        {editMode === 'replace' && <span className="animate-pulse ml-1 text-teal-600">|</span>}
      </div>

      {/* כפתור להחלפה של כל ההופעות */}
      <button
        // קריאה לפונקציית onReplaceAll בעת לחיצה
        onClick={onReplaceAll}
        // סגנון כפתור טורקיז
        className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-4 py-1 rounded text-sm shadow"
      >
        {/* טקסט הכפתור */}
        החלף הכל
      </button>
    </div>
  );
}
