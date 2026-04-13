// ייבוא React ו-useState לניהול המצב של הרכיב
import React, { useState } from 'react';
// ייבוא רכיב EditModeBadge - תג להצגת מצב העריכה הנוכחי
import EditModeBadge from './EditModeBadge';
// ייבוא רכיב KeyboardToolbar - סרגל הכלים של המקלדת
import KeyboardToolbar from './KeyboardToolbar';
// ייבוא רכיב SearchReplaceBar - סרגל החיפוש וההחלפה
import SearchReplaceBar from './SearchReplaceBar';
// ייבוא רכיב KeyboardKeys - המקלדת הווירטואלית בעצמה
import KeyboardKeys from './KeyboardKeys';

// ייצוא רכיב KeyboardPanel - מתאם מרכזי של כל רכיבי המקלדת
export default function KeyboardPanel({ 
  // אובייקט המסמך הפעיל כרגע
  activeDoc, 
  // מצב העריכה הנוכחי
  editMode, 
  // פונקציה לשינוי מצב העריכה
  setEditMode, 
  // פונקציה לעדכון המסמך הפעיל
  updateActiveDoc, 
  // פונקציה לשמירת המסמך הפעיל
  saveActiveDoc, 
  // פונקציה לביטול פעולה אחרונה
  undoActiveDoc, 
  // מחרוזת החיפוש הנוכחית
  searchStr, 
  // פונקציה לעדכון מחרוזת החיפוש
  setSearchStr, 
  // מחרוזת ההחלפה הנוכחית
  replaceStr, 
  // פונקציה לעדכון מחרוזת ההחלפה
  setReplaceStr 
}) {
  // מצב השפה של המקלדת - ברירת מחדל עברית
  const [keyboardLang, setKeyboardLang] = useState('HE');

  // אם אין מסמך פעיל - הצגת הודעה בחרו או צרו מסמך
  if (!activeDoc) return (
    <div className="p-4 bg-gray-200 text-center font-bold text-gray-600 border-t-4 border-gray-800">
      בחר או צור טקסט לעריכה כדי להתחיל...
    </div>
  );

  // ====== פונקציה לטיפול בלחיצה על כפתור תו ======
  const handleKeyPress = (char) => {
    // אם בעריכת כותרת - הוסף תו לשם המסמך
    if (editMode === 'title') {
      updateActiveDoc({ filename: activeDoc.filename + char });
    } 
    // אם בעריכת חיפוש - הוסף תו למחרוזת החיפוש
    else if (editMode === 'search') {
      setSearchStr(prev => prev + char);
    } 
    // אם בעריכת החלפה - הוסף תו למחרוזת ההחלפה
    else if (editMode === 'replace') {
      setReplaceStr(prev => prev + char);
    } 
    // אחרת (בעריכת תוכן) - הוסף תו למסמך עם הסגנון הנוכחי
    else {
      // יצירת אובייקט תו חדש עם הסגנון הנוכחי
      const newChar = {
        // התו בפועל
        char,
        // צבע הסגנון הנוכחי
        color: activeDoc.currentStyle.color,
        // גודל הפונט הנוכחי
        fontSize: activeDoc.currentStyle.fontSize,
        // סוג הפונט הנוכחי (ברירת מחדל Arial)
        fontFamily: activeDoc.currentStyle.fontFamily || 'Arial',
      };
      // הוספת התו החדש לסוף התוכן
      updateActiveDoc({ content: [...activeDoc.content, newChar] });
    }
  };

  // ====== פונקציה למחיקת תו אחד ======
  const handleDelete = () => {
    // אם בעריכת כותרת - מחק תו אחד מסוף השם
    if (editMode === 'title') {
      updateActiveDoc({ filename: activeDoc.filename.slice(0, -1) });
    } 
    // אם בעריכת חיפוש - מחק תו אחד מסוף החיפוש
    else if (editMode === 'search') {
      setSearchStr(prev => prev.slice(0, -1));
    } 
    // אם בעריכת החלפה - מחק תו אחד מסוף ההחלפה
    else if (editMode === 'replace') {
      setReplaceStr(prev => prev.slice(0, -1));
    } 
    // אחרת (בעריכת תוכן) - מחק תו אחד מסוף התוכן
    else {
      updateActiveDoc({ content: activeDoc.content.slice(0, -1) });
    }
  };

  // ====== פונקציה לניקוי הכל ======
  const handleDeleteAll = () => {
    // אם בעריכת כותרת - שאל אישור ואחר כך נקה את השם
    if (editMode === 'title') {
      if (window.confirm('למחוק את שם המסמך?')) updateActiveDoc({ filename: '' });
    } 
    // אם בעריכת חיפוש - נקה את מחרוזת החיפוש
    else if (editMode === 'search') {
      setSearchStr('');
    } 
    // אם בעריכת החלפה - נקה את מחרוזת ההחלפה
    else if (editMode === 'replace') {
      setReplaceStr('');
    } 
    // אחרת (בעריכת תוכן) - שאל אישור ואחר כך נקה את כל התוכן
    else {
      if (window.confirm('למחוק את כל הטקסט במסמך?')) updateActiveDoc({ content: [] });
    }
  };

  // ====== פונקציה למחיקת מילה אחרונה ======
  const handleDeleteWord = () => {
    // אם בעריכת כותרת - מחק מילה אחרונה משם המסמך
    if (editMode === 'title') {
      // חלוקת השם למילים וריסוק של המילה האחרונה
      const words = activeDoc.filename.trimEnd().split(' ');
      words.pop();
      // עדכון השם עם הוספת רווח בסוף אם יש עוד מילים
      updateActiveDoc({ filename: words.join(' ') + (words.length > 0 ? ' ' : '') });
    } 
    // אם בעריכת חיפוש - מחק מילה אחרונה מחיפוש
    else if (editMode === 'search') {
      const words = searchStr.trimEnd().split(' ');
      words.pop();
      setSearchStr(words.join(' ') + (words.length > 0 ? ' ' : ''));
    } 
    // אם בעריכת החלפה - מחק מילה אחרונה מהחלפה
    else if (editMode === 'replace') {
      const words = replaceStr.trimEnd().split(' ');
      words.pop();
      setReplaceStr(words.join(' ') + (words.length > 0 ? ' ' : ''));
    } 
    // אחרת (בעריכת תוכן) - מחק מילה אחרונה מהתוכן
    else {
      // העתקת כל התוכן
      const content = [...activeDoc.content];
      // קביעת נקודת סיום בסוף התוכן
      let end = content.length;
      // דלג על רווחים בסוף
      while (end > 0 && content[end - 1].char === ' ') end--;
      // דלג על תווים שאינם רווח (שזה המילה)
      while (end > 0 && content[end - 1].char !== ' ') end--;
      // עדכון התוכן בלי המילה האחרונה
      updateActiveDoc({ content: content.slice(0, end) });
    }
  };

  // ====== פונקציה לשינוי סגנון (צבע, גודל, פונט) ======
  const handleChangeStyle = (key, value) => {
    // עדכון הסגנון הנוכחי עם השינוי הנתון
    updateActiveDoc({ currentStyle: { ...activeDoc.currentStyle, [key]: value } });
  };

  // ====== פונקציה להחלת סגנון על כל האותיות בתוכן ======
  const handleApplyStyleToAll = () => {
    // קבלת סגנון נוכחי (צבע, גודל, פונט)
    const { color, fontSize, fontFamily } = activeDoc.currentStyle;
    // יצירת תוכן חדש עם כל התווים מעודכנים לסגנון החדש
    const newContent = activeDoc.content.map(c => ({
      // העתקת כל תכונות התו
      ...c, 
      // עדכון הצבע
      color, 
      // עדכון גודל הפונט
      fontSize, 
      // עדכון סוג הפונט (ברירת מחדל Arial)
      fontFamily: fontFamily || 'Arial',
    }));
    // עדכון המסמך עם התוכן החדש
    updateActiveDoc({ content: newContent });
  };

  // ====== פונקציה להחלفת כל ההופעות של טקסט חיפוש בטקסט החלפה ======
  const handleReplaceAll = () => {
    // אם אין מחרוזת חיפוש - יציאה פונקציה
    if (!searchStr) return;
    // המרת מחרוזת החיפוש למערך של תווים
    const searchChars = Array.from(searchStr);
    // המרת מחרוזת ההחלפה למערך של תווים
    const replaceChars = Array.from(replaceStr);
    // יצירת מערך חדש לתוכן החדש
    const newContent = [];
    // אינדקס הנוכחי בתוכן המקורי
    let i = 0;

    // לולאה על כל התוכן עד הסוף
    while (i < activeDoc.content.length) {
      // assumption שאין התאמה בהתחלה
      let match = false;
      // בדיקה אם יש מקום מספיק לחיפוש החל מנקודה זו
      if (i <= activeDoc.content.length - searchChars.length) {
        // assumption שיש התאמה
        match = true;
        // לולאה לבדוק כל תו בחיפוש
        for (let j = 0; j < searchChars.length; j++) {
          // אם תו לא תואם - סיום הלולאה
          if (activeDoc.content[i + j].char !== searchChars[j]) { match = false; break; }
        }
      }
      // אם התווים התאימו - הוסף את תווי ההחלפה
      if (match) {
        // לולאה על כל תווי ההחלפה
        for (let k = 0; k < replaceChars.length; k++) {
          // הוספת תו החלפה עם סגנון התו הצומח
          newContent.push({
            // תו ההחלפה בפועל
            char: replaceChars[k],
            // צבע הסגנון משום המקורי
            color: activeDoc.content[i].color,
            // גודל הפונט משום המקורי
            fontSize: activeDoc.content[i].fontSize,
            // סוג הפונט משום המקורי
            fontFamily: activeDoc.content[i].fontFamily,
          });
        }
        // קפיצה קדימה על פי אורך החיפוש
        i += searchChars.length;
      } 
      // אם לא התאימו - פשוט הוסף את התו המקורי וקדם
      else {
        newContent.push(activeDoc.content[i]);
        i++;
      }
    }
    // עדכון המסמך עם התוכן החדש שהוחלף
    updateActiveDoc({ content: newContent });
    // ניקוי מחרוזת החיפוש לאחר ההחלפה
    setSearchStr('');
  };

  // החזרת ה-JSX של הרכיב
  return (
    // div ראשי של קבוצת המקלדת - flex column עם גבול עליון
    <div className="border-t-4 border-gray-800 bg-gray-100 p-3 flex flex-col relative" style={{ minHeight: '18rem' }}>

      {/* תג מצב העריכה הנוכחי */}
      <EditModeBadge editMode={editMode} />

      {/* סרגל הכלים של המקלדת עם אפשרויות עיצוב */}
      <KeyboardToolbar
        // העברת שפת המקלדת
        keyboardLang={keyboardLang}
        // העברת פונקציית שינוי שפה
        setKeyboardLang={setKeyboardLang}
        // העברת מצב העריכה הנוכחי
        editMode={editMode}
        // העברת המסמך הפעיל
        activeDoc={activeDoc}
        // העברת פונקציית שינוי סגנון
        onChangeStyle={handleChangeStyle}
        // העברת פונקציית החלת סגנון על הכל
        onApplyStyleToAll={handleApplyStyleToAll}
        // העברת פונקציית שמירה
        onSave={saveActiveDoc}
      />

      {/* סרגל החיפוש וההחלפה */}
      <SearchReplaceBar
        // העברת מצב העריכה הנוכחי
        editMode={editMode}
        // העברת מחרוזת החיפוש הנוכחית
        searchStr={searchStr}
        // העברת מחרוזת ההחלפה הנוכחית
        replaceStr={replaceStr}
        // העברת פונקציית בחירת חיפוש
        onSearchClick={() => setEditMode('search')}
        // העברת פונקציית בחירת החלפה
        onReplaceClick={() => setEditMode('replace')}
        // העברת פונקציית החלפה הכל
        onReplaceAll={handleReplaceAll}
      />

      {/* המקלדת הווירטואלית עם כפתורי פעולה */}
      <KeyboardKeys
        // העברת שפת המקלדת הנוכחית
        keyboardLang={keyboardLang}
        // העברת פונקציית לחיצה על כפתור תו
        onKeyPress={handleKeyPress}
        // העברת פונקציית מחיקה של תו
        onDelete={handleDelete}
        // העברת פונקציית מחיקה של מילה
        onDeleteWord={handleDeleteWord}
        // העברת פונקציית ניקוי הכל
        onDeleteAll={handleDeleteAll}
        // העברת פונקציית ביטול פעולה
        onUndo={undoActiveDoc}
      />
    </div>
  );
}