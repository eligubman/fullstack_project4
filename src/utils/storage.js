// src/utils/storage.js
// מנהל את כל התקשורת מול ה-Local Storage

export const loginUser = (username) => {
  localStorage.setItem('currentUser', username);
  return username;
};

export const getCurrentUser = () => {
  return localStorage.getItem('currentUser');
};

export const logoutUser = () => {
  localStorage.removeItem('currentUser');
};

// שומר קובץ תחת שם המשתמש הספציפי כדי לייצר הפרדה
export const saveUserFile = (username, filename, data) => {
  const key = `editor_${username}_${filename}`;
  localStorage.setItem(key, JSON.stringify(data));
};

// טוען קובץ של משתמש ספציפי
export const loadUserFile = (username, filename) => {
  const key = `editor_${username}_${filename}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// מביא את רשימת שמות הקבצים של המשתמש הנוכחי
export const getUserFilesList = (username) => {
  const prefix = `editor_${username}_`;
  const files = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(prefix)) {
      files.push(key.replace(prefix, ''));
    }
  }
  return files;
};