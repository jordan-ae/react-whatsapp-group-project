import { createContext, useContext, useState, useEffect } from "react";

const ThemeCntext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {

    }, [theme]);
}