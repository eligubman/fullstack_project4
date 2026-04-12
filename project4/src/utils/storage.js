// src/utils/storage.js
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

export const saveUserFile = (username, filename, data) => {
  const key = `editor_${username}_${filename}`;
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadUserFile = (username, filename) => {
  const key = `editor_${username}_${filename}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const deleteUserFile = (username, filename) => {
  const key = `editor_${username}_${filename}`;
  localStorage.removeItem(key);
};

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

// --- הפיצ'רים החדשים: שמירה וטעינה של "הלשוניות הפתוחות" ---

export const saveUserWorkspace = (username, openFilenames) => {
  localStorage.setItem(`workspace_${username}`, JSON.stringify(openFilenames));
};

export const loadUserWorkspace = (username) => {
  const data = localStorage.getItem(`workspace_${username}`);
  return data ? JSON.parse(data) : [];
};