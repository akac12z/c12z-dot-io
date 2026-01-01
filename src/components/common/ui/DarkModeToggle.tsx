// import Moon from "@icons/shared/Moon.astro";
// import Sun from "@icons/shared/Sun.astro";
// import React, { useEffect, useState } from "react";

// const DARK_CLASS = "dark";
// const STORAGE_KEY = "theme";

// function getSystemTheme() {
//   if (typeof window === "undefined") return "light";
//   return window.matchMedia("(prefers-color-scheme: dark)").matches
//     ? "dark"
//     : "light";
// }

// export default function DarkModeToggle() {
//   const [theme, setTheme] = useState(() => {
//     if (typeof window === "undefined") return "light";
//     return localStorage.getItem(STORAGE_KEY) || getSystemTheme();
//   });

//   useEffect(() => {
//     const root = window.document.documentElement;
//     if (theme === "dark") {
//       root.classList.add(DARK_CLASS);
//     } else {
//       root.classList.remove(DARK_CLASS);
//     }
//     localStorage.setItem(STORAGE_KEY, theme);
//   }, [theme]);

//   useEffect(() => {
//     const mq = window.matchMedia("(prefers-color-scheme: dark)");
//     const handleChange = () => {
//       if (!localStorage.getItem(STORAGE_KEY)) {
//         setTheme(getSystemTheme());
//       }
//     };
//     mq.addEventListener("change", handleChange);
//     return () => mq.removeEventListener("change", handleChange);
//   }, []);

//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "dark" ? "light" : "dark"));
//   };

//   return (
//     <button
//       className={`w-auto m-2 flex justify-center items-center rounded-full`}
//       onClick={toggleTheme}
//       aria-label={
//         theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
//       }
//       style={{
//         color: theme === "dark" ? "#fff" : "#222",
//         cursor: "pointer",
//         fontWeight: 600,
//         margin: "0 0.5rem",
//       }}
//     >
//       {theme === "dark" ? <Moon /> : <Sun />}
//     </button>
//   );
// }
