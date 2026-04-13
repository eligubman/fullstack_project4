// ייבוא של StrictMode מ-React לבדיקת בעיות בקוד
import { StrictMode } from 'react'
// ייבוא של createRoot כדי ליצור חלק ריקט בדום
import { createRoot } from 'react-dom/client'
// ייבוא קובץ CSS עם סגנונות עיצוביים
import './index.css'
// ייבוא של רכיב App הראשי של היישום
import App from './App.jsx'

// יצירת שורש React בחלק root של ה-HTML ורינדור App בתוכו
createRoot(document.getElementById('root')).render(
  // StrictMode עוזר לזהות בעיות פוטנציאליות בקוד
  <StrictMode>
    {/* רכיב App - המרכיב הראשי של היישום */}
    <App />
  </StrictMode>,
)
