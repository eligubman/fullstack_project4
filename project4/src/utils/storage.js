// ========== אימות משתמשים ==========

// פונקציה לקבלת מאגר כל החשבונות הרשומים
export const getAccountsRegistry = () => {
  const data = localStorage.getItem('auth_accounts');
  return data ? JSON.parse(data) : {};
};

// פונקציה לרישום משתמש חדש עם שם משתמש וסיסמה
export const registerAccount = (username, password) => {
  // בדיקת אורך שם משתמש
  if (!username || username.trim().length < 3) {
    return { error: 'שם משתמש חייב להכיל לפחות 3 תווים' };
  }
  // בדיקת אורך סיסמה
  if (!password || password.length < 4) {
    return { error: 'הסיסמה חייבת להכיל לפחות 4 תווים' };
  }
  // טעינת המאגר הנוכחי
  const registry = getAccountsRegistry();
  // בדיקה אם שם המשתמש כבר קיים (לא תלוי רישיות)
  const normalizedUsername = username.trim().toLowerCase();
  if (registry[normalizedUsername]) {
    return { error: 'שם המשתמש כבר קיים במערכת' };
  }
  // יצירת ה-hash של הסיסמה באמצעות btoa
  const hashedPassword = btoa(normalizedUsername + ':' + password);
  // שמירת החשבון החדש במאגר
  registry[normalizedUsername] = hashedPassword;
  localStorage.setItem('auth_accounts', JSON.stringify(registry));
  return { success: true };
};

// פונקציה לאימות פרטי התחברות של משתמש
export const verifyLogin = (username, password) => {
  if (!username || !password) return false;
  const normalizedUsername = username.trim().toLowerCase();
  const registry = getAccountsRegistry();
  const storedHash = registry[normalizedUsername];
  if (!storedHash) return false;
  // השוואת ה-hash המחושב עם הה-hash השמור
  const expectedHash = btoa(normalizedUsername + ':' + password);
  return storedHash === expectedHash;
};

// ========== ניהול משתמש נוכחי ==========

// פונקציה לשמירת שם המשתמש הנוכחי ב-localStorage
export const loginUser = (username) => {
  // שמירת שם המשתמש בתא זיכרון עם שם מפתח 'currentUser'
  localStorage.setItem('currentUser', username);
  // החזרת שם המשתמש שנשמר
  return username;
};

// פונקציה לקבלת שם המשתמש הנוכחי מ-localStorage
export const getCurrentUser = () => {
  // החזרת שם המשתמש מ-localStorage או null אם אינו קיים
  return localStorage.getItem('currentUser');
};

// פונקציה להתנתקות המשתמש - הסרת שם המשתמש מ-localStorage
export const logoutUser = () => {
  // הסרת המפתח 'currentUser' מ-localStorage
  localStorage.removeItem('currentUser');
};

// פונקציה לשמירת קובץ משתמש בתא זיכרון
export const saveUserFile = (username, filename, data) => {
  // יצירת מפתח ייחודי לכל קובץ משתמש (שילוב שם משתמש ושם קובץ)
  const key = `editor_${username}_${filename}`;
  // המרה של הנתונים לפורמט JSON ושמירה ב-localStorage
  localStorage.setItem(key, JSON.stringify(data));
};

// פונקציה לטעינת קובץ משתמש מ-localStorage
export const loadUserFile = (username, filename) => {
  // יצירת המפתח הייחודי לפי שם משתמש ושם קובץ
  const key = `editor_${username}_${filename}`;
  // קבלת הנתונים המאוחסנים מ-localStorage
  const data = localStorage.getItem(key);
  // אם הנתונים קיימים - המרה מ-JSON לאובייקט JavaScript, אחרת החזרת null
  return data ? JSON.parse(data) : null;
};

// פונקציה למחיקת קובץ משתמש מ-localStorage
export const deleteUserFile = (username, filename) => {
  // יצירת המפתח של הקובץ לדיקה
  const key = `editor_${username}_${filename}`;
  // הסרת הקובץ מ-localStorage
  localStorage.removeItem(key);
};

// פונקציה להחזרת רשימת כל קבצי משתמש
export const getUserFilesList = (username) => {
  // יצירת קידומת מפתח לכל קבצי המשתמש הזה
  const prefix = `editor_${username}_`;
  // יצירת מערך ריק לשמירת שמות הקבצים
  const files = [];
  // לולאה על כל המפתחות ב-localStorage
  for (let i = 0; i < localStorage.length; i++) {
    // קבלת המפתח הנוכחי
    const key = localStorage.key(i);
    // בדיקה אם המפתח שייך למשתמש הזה
    if (key.startsWith(prefix)) {
      // הוצאת שם הקובץ (הסרת הקידומת) והוספה למערך
      files.push(key.replace(prefix, ''));
    }
  }
  // החזרת מערך שמות הקבצים
  return files;
};

// ========== פיצ'רים חדשים: שמירה וטעינה של הלשוניות הפתוחות ==========

// פונקציה לשמירת רשימת הקבצים הפתוחים של משתמש מסוים
export const saveUserWorkspace = (username, openFilenames) => {
  // יצירת מפתח ייחודי לשמירת מרחב העבודה של המשתמש
  localStorage.setItem(`workspace_${username}`, JSON.stringify(openFilenames));
};

// פונקציה לטעינת רשימת הקבצים הפתוחים של משתמש
export const loadUserWorkspace = (username) => {
  // קבלת הנתונים של מרחב העבודה מ-localStorage
  const data = localStorage.getItem(`workspace_${username}`);
  // אם קיימים נתונים - המרה לאובייקט, אחרת החזרת מערך ריק
  return data ? JSON.parse(data) : [];
};