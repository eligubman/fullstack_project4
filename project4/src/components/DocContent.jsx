// ייבוא React לשימוש בעריכה היא קומפוננטה
import React from 'react';

/**
 * פונקציה לחישוב אינדקסים של תווים התואמים מחרוזת החיפוש
 * @param {Array} content - תוכן המסמך (מערך של אובייקטי תווים)
 * @param {string} searchStr - מחרוזת החיפוש
 * @returns {Set} סט של אינדקסים של תווים התואמים
 */
function computeMatchIndices(content, searchStr) {
  // יצירת Set ריק לשמירת אינדקסים של תווים מתאימים
  const matchIndices = new Set();
  // אם אין מחרוזת חיפוש או היא ריקה, החזרת Set ריק
  if (!searchStr || searchStr.length === 0) return matchIndices;

  // המרת מחרוזת החיפוש למערך של תווים בודדים
  const searchChars = Array.from(searchStr);
  // לולאה על כל מיקומים אפשריים בתוכן (עד אורך הטקסט פחות אורך החיפוש)
  for (let i = 0; i <= content.length - searchChars.length; i++) {
    // assumption שכל טקסט התואם בתחילה
    let match = true;
    // לולאה בדיקה אם כל תו בחיפוש תואם בתוכן בנקודה הנוכחית
    for (let j = 0; j < searchChars.length; j++) {
      // משהו שלא תואם את התו הנוכחי
      if (content[i + j].char !== searchChars[j]) {
        // סימון שהטקסט לא תואם
        match = false;
        // יציאה מהלולאה הפנימית
        break;
      }
    }
    // אם כל התווים תאמו
    if (match) {
      // הוספת כל אינדקסים של התוואים המתאימים ל-Set
      for (let j = 0; j < searchChars.length; j++) {
        matchIndices.add(i + j);
      }
    }
  }
  // החזרת ה-Set של אינדקסים התואמים
  return matchIndices;
}

// ייצוא רכיב DocContent - תוכן המסמך עם סגנון וסימון חיפוש
export default function DocContent({ 
  // אובייקט המסמך עם תוכן וסגנון
  doc, 
  // האם המסמך כעת פעיל
  isActive, 
  // מצב העריכה הנוכחי (רק 'content' ממשמעותי כאן)
  editMode, 
  // מחרוזת החיפוש לסימון
  searchStr, 
  // פונקציה שנקראת בעת לחיצה על התוכן
  onClick 
}) {
  // חישוב איזה תווים יש לסמן צהוב
  const matchIndices = computeMatchIndices(doc.content, searchStr);

  return (
    // div ראשי של תוכן המסמך - סקרולבל וגיבוב עברית
    <div
      className={`flex-grow p-4 rounded overflow-y-auto text-right cursor-text transition-colors ${
        // אם המסמך פעיל ובמצב עריכת תוכן - סגנון ירוק
        isActive && editMode === 'content' ? 'bg-green-50 ring-1 ring-green-200' : 'bg-gray-50'
      }`}
      // כיוון מימין לשמאל לעברית
      dir="rtl"
      // קריאה לפונקציית onClick בעת לחיצה
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Div הכולל את כל התוכן */}
      <div className="min-h-[100px] break-words whitespace-pre-wrap leading-relaxed">
        {/* לולאה על כל תו בתוכן */}
        {doc.content.map((charObj, index) => {
          // בדיקה אם התו כעת חלק מתוצאת החיפוש
          const isHighlighted = matchIndices.has(index);
          return (
            // span עבור כל תו בודד
            <span
              // שימוש באינדקס כמפתח ייחודי ל-React
              key={index}
              // סגנונות דינמיים בהתאם לצבע וגודל הפונט של התו
              style={{
                // צבע התו כפי שנקבע בסגנון הנוכחי
                color: charObj.color,
                // גודל הפונט של התו
                fontSize: charObj.fontSize,
                // סוג הפונט של התו (ברירת מחדל Arial)
                fontFamily: charObj.fontFamily || 'Arial',
                // צבע רקע צהוב אם התו חלק מתוצאת חיפוש
                backgroundColor: isHighlighted ? '#facc15' : 'transparent',
                // עיגול קטן של הזוויות אם סומן
                borderRadius: isHighlighted ? '2px' : undefined,
                // ריפוד קטן סביב התו אם סומן
                padding: isHighlighted ? '0 1px' : '0',
              }}
            >
              {/* הדפסת התו בפועל */}
              {charObj.char}
            </span>
          );
        })}

        {/* סמן צומח המציג את מיקום הקרסור בעת עריכה */}
        {isActive && editMode === 'content' && (
          <span
            // סגנון בוהק נופל למראה סמן צומח
            className="animate-pulse font-light"
            style={{
              // צבע הסמן כפי שנקבע בסגנון הנוכחי
              color: doc.currentStyle?.color || 'black',
              // גודל הסמן תואם לגודל פונט הנוכחי
              fontSize: doc.currentStyle?.fontSize || '16px',
              // סוג הפונט של הסמן
              fontFamily: doc.currentStyle?.fontFamily || 'Arial',
              // מרווח קטן משמאל של הסמן
              marginLeft: '2px',
            }}
          >
            {/* סמן בצורת קו אנכי */}
            |
          </span>
        )}
      </div>
    </div>
  );
}
