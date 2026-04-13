// ייבוא React לשימוש בעריכה היא קומפוננטה
import React from 'react';

// אובייקט שמכיל 3 פריסות מקלדת שונות: עברית, אנגלית וסמלים
const layouts = {
  // פריסה עברית עם אותיות היווניות
  HE: ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת','ף','ץ','ן','ם','ך'],
  // פריסה אנגלית עם אותיות באנגלית
  EN: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
  // פריסה סמלים עם מספרים וסמלים מיוחדים
  SYMBOLS: ['1','2','3','4','5','6','7','8','9','0','!','@','#','$','%','^','&','*','(',')','_','-','+','=','😀','👍'],
};

// ייצוא רכיב KeyboardKeys - המקלדת הווירטואלית עם כל הכפתורים
export default function KeyboardKeys({
  // שפת המקלדת הנוכחית (HE, EN או SYMBOLS)
  keyboardLang,
  // פונקציה שנקראת כאשר לוחצים על כפתור עם תו
  onKeyPress,
  // פונקציה שנקראת כאשר לוחצים על מחק תו
  onDelete,
  // פונקציה שנקראת כאשר לוחצים על מחק מילה
  onDeleteWord,
  // פונקציה שנקראת כאשר לוחצים על נקה הכל
  onDeleteAll,
  // פונקציה שנקראת כאשר לוחצים על בטל (Undo)
  onUndo,
}) {
  return (
    // div ראשי שיכול להתגלגל אנכית ('flex-grow overflow-y-auto')
    <div className="flex-grow overflow-y-auto">
      {/* גρίδα של כל התווים בעברית/אנגלית/סמלים */}
      <div
        // flex עם עטיפה ופער בין הכפתורים, ישור במרכז
        className="flex flex-wrap gap-2 mb-2 justify-center"
        // כיוון שימאל-לימין עבור אנגלית, ימין-לשמאל עבור עברית
        dir={keyboardLang === 'EN' ? 'ltr' : 'rtl'}
      >
        {/* לולאה על כל התווים בפריסה הנוכחית */}
        {layouts[keyboardLang].map(char => (
          // כפתור עבור כל תו
          <button
            // משתמש בתו כמפתח ייחודי עבור React
            key={char}
            // קריאה לפונקציה onKeyPress עם התו בעת לחיצה
            onClick={() => onKeyPress(char)}
            // סגנון כפתור לבן עם גבול ותמונה כחולה בעת ריחוף
            className="bg-white border border-gray-300 rounded shadow-sm w-10 h-10 text-lg hover:bg-blue-50 focus:outline-none"
          >
            {/* הדפסת התו על הכפתור */}
            {char}
          </button>
        ))}
      </div>

      {/* קבוצת כפתורי פעולה מיוחדים */}
      <div className="flex gap-2 justify-center flex-wrap max-w-3xl mx-auto">
        {/* כפתור רווח - צריך להיות גדול כי הוא נפוץ */}
        <button
          // קריאה ל-onKeyPress עם רווח בעת לחיצה
          onClick={() => onKeyPress(' ')}
          // סגנון כפתור גדול וגמיש שמשתרע עם שאר הכפתורים
          className="flex-grow bg-white border border-gray-300 rounded shadow-sm py-3 text-lg font-bold hover:bg-blue-50"
        >
          {/* טקסט הסבר לכפתור הרווח */}
          רווח (Space)
        </button>
        {/* כפתור מחק תו אחד אחרון */}
        <button
          // קריאה לפונקציית מחיקת תו בעת לחיצה
          onClick={onDelete}
          // סגנון כפתור אדום בגוון בהיר
          className="bg-red-100 hover:bg-red-200 border border-red-300 rounded px-4 py-3 text-red-800 font-bold"
        >
          {/* טקסט הסבר לכפתור */}
          מחק תו
        </button>
        {/* כפתור מחק מילה אחרונה */}
        <button
          // קריאה לפונקציית מחיקת מילה בעת לחיצה
          onClick={onDeleteWord}
          // סגנון כפתור כתום בגוון בהיר
          className="bg-orange-100 hover:bg-orange-200 border border-orange-300 rounded px-4 py-3 text-orange-800 font-bold"
        >
          {/* טקסט הסבר לכפתור */}
          מחק מילה
        </button>
        {/* כפתור לניקוי כל התוכן */}
        <button
          // קריאה לפונקציית מחיקת הכל בעת לחיצה
          onClick={onDeleteAll}
          // סגנון כפתור אדום כהה
          className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-3 font-bold"
        >
          {/* טקסט הסבר לכפתור */}
          נקה הכל
        </button>
        {/* כפתור הבטל - ביטול פעולה אחרונה */}
        <button
          // קריאה לפונקציית Undo בעת לחיצה
          onClick={onUndo}
          // סגנון כפתור אפור בהיר
          className="bg-gray-300 hover:bg-gray-400 border border-gray-400 rounded px-4 py-3 font-bold text-gray-800"
        >
          {/* טקסט הסבר לכפתור */}
          בטל (Undo)
        </button>
      </div>
    </div>
  );
}
