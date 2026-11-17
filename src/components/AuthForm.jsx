import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function AuthForm({ mode }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, t } = useAuth();
  const nav = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await api.post(isRegister ? "/auth/register" : "/auth/login", form);
      login(data);          // backend se {token, name} aana chahiye
      nav("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally { setLoading(false); }
  };

  return (
    <form className="card auth" onSubmit={submit}>
      <h2>{isRegister ? t("register") : t("login")}</h2>
      {isRegister && <input name="name" placeholder="Full name" value={form.name} onChange={change} required />}
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
      <input name="password" type="password" placeholder="Password (min 8 chars)" minLength={8} value={form.password} onChange={change} required />
      {error && <p className="error">{error}</p>}
      <button disabled={loading}>{loading ? "Please wait..." : isRegister ? t("register") : t("login")}</button>
      <p className="muted">
        {isRegister ? <>Already have an account? <Link to="/login">Login</Link></> : <>New here? <Link to="/register">Register</Link></>}
      </p>
    </form>
  );
}
