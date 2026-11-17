import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Navbar() {
  const { user, logout, lang, toggleLang, t } = useAuth();
  const nav = useNavigate();
  return (
    <header className="navbar">
      <h2>💙 HealthMate AI</h2>
      <nav>
        {user && (
          <>
            <NavLink to="/">{t("dashboard")}</NavLink>
            <NavLink to="/chat">{t("chat")}</NavLink>
            <NavLink to="/reports">{t("reports")}</NavLink>
            <NavLink to="/reminders">{t("reminders")}</NavLink>
          </>
        )}
        <button className="ghost" onClick={toggleLang}>{lang === "en" ? "हिंदी" : "English"}</button>
        {user && <button className="ghost" onClick={() => { logout(); nav("/login"); }}>{t("logout")}</button>}
      </nav>
    </header>
  );
}
