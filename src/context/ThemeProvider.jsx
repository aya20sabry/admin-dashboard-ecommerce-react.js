// // src/context/ThemeContext.jsx
// import { createContext, useContext, useEffect, useState } from "react";

// // 1- إنشاء Context
// const ThemeContext = createContext();

// // 2- البروفايدر
// export function ThemeProvider({ children }) {
//   const [theme, setTheme] = useState(() => {
//     // شوف هل فيه ثيم متخزن في localStorage
//     return localStorage.getItem("theme") || "light";
//   });

//   useEffect(() => {
//     // ضيف/شيل كلاس dark في <html>
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//     // خزّنه عشان يفضل محفوظ بعد الريلود
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "dark" ? "light" : "dark"));
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// // 3- هوك لسهولة الاستخدام
// export function useTheme() {
//   return useContext(ThemeContext);
// }
