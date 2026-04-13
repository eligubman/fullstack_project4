// ייבוא React לשימוש בעריכה היא קומפוננטה
import React from 'react';

// אובייקט שמכיל כותרות לכל מצב עריכה אפשרי
const modeTitles = {
  // כותרת כאשר עורכים את שם המסמך
  title: 'כותרת המסמך ✎',
  // כותרת כאשר עורכים את תוכן המסמך
  content: 'תוכן המסמך 📄',
  // כותרת כאשר משתמשים בחיפוש
  search: 'תיבת חיפוש 🔍',
  // כותרת כאשר משתמשים בהחלפה
  replace: 'תיבת החלפה ✏️',
};

// ייצוא רכיב EditModeBadge - תג צף שמציג את מצב העריכה הנוכחי
export default function EditModeBadge({ editMode }) {
  return (
    // div עם מיקום אחסולוט בחלק העליון של הדף
    <div className="absolute top-0 right-1/2 transform translate-x-1/2 -mt-4 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold shadow border border-yellow-500">
      {/* הדפסת הטקסט "עורך כעת:" עם הכותרת המתאימה למצב הנוכחי */}
      עורך כעת: {modeTitles[editMode]}
    </div>
  );
}
