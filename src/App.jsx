import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Chat from "./pages/Chat.jsx";
import Reports from "./pages/Reports.jsx";
import Reminders from "./pages/Reminders.jsx";

// Bina login ke private pages nahi khulenge
function Private({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { t } = useAuth();
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Private><Dashboard /></Private>} />
          <Route path="/chat" element={<Private><Chat /></Private>} />
          <Route path="/reports" element={<Private><Reports /></Private>} />
          <Route path="/reminders" element={<Private><Reminders /></Private>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer className="disclaimer">⚕️ {t("disclaimer")}</footer>
    </>
  );
}
