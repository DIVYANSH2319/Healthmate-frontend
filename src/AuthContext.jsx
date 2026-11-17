import { createContext, useContext, useState } from "react";
import { text } from "./i18n.js";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("token");
    return t ? { token: t, name: localStorage.getItem("name") } : null;
  });
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  const login = ({ token, name }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    setUser({ token, name });
  };
  const logout = () => { localStorage.clear(); setUser(null); };
  const toggleLang = () => {
    const next = lang === "en" ? "hi" : "en";
    localStorage.setItem("lang", next);
    setLang(next);
  };
  const t = (key) => text[lang][key] || key;

  return <Ctx.Provider value={{ user, login, logout, lang, toggleLang, t }}>{children}</Ctx.Provider>;
}
