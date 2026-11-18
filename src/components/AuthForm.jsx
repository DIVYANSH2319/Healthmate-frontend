import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function AuthForm({ mode }) {
  const isRegister = mode === "register";

  const { login, lang } = useAuth();
  const nav = useNavigate();

  const hi = lang === "hi";

  const words = {
    personalHealth: hi ? "आपका व्यक्तिगत स्वास्थ्य साथी" : "YOUR PERSONAL HEALTH COMPANION",
    yourHealth: hi ? "आपका स्वास्थ्य," : "Your Health,",
    our: hi ? "हमारी" : "Our",
    priority: hi ? "प्राथमिकता।" : "Priority.",
    intro: hi
      ? "अपनी सेहत का ध्यान रखें। अपने स्वास्थ्य को ट्रैक करें और स्वस्थ जीवन की ओर बढ़ें।"
      : "Take control of your wellness journey. Track your health, understand your habits and stay connected with your wellbeing.",
    tracking: hi ? "स्मार्ट हेल्थ ट्रैकिंग" : "Smart Health Tracking",
    assistant: hi ? "AI स्वास्थ्य सहायक" : "AI Health Assistant",
    insights: hi ? "स्वास्थ्य और फिटनेस जानकारी" : "Wellness & Fitness Insights",
    matters: hi ? "आपका स्वास्थ्य महत्वपूर्ण है।" : "Your wellness matters.",
    create: hi ? "खाता बनाएं" : "Create Account",
    welcome: hi ? "वापसी पर स्वागत है!" : "Welcome Back!",
    registerSubtitle: hi
      ? "हमारे साथ स्वस्थ जीवन की शुरुआत करें।"
      : "Start your healthier journey with us.",
    loginSubtitle: hi
      ? "अपनी स्वास्थ्य यात्रा जारी रखने के लिए लॉगिन करें।"
      : "Sign in to continue your wellness journey.",
    name: hi ? "पूरा नाम" : "Full Name",
    enterName: hi ? "अपना पूरा नाम लिखें" : "Enter your full name",
    email: hi ? "ईमेल पता" : "Email Address",
    enterEmail: hi ? "अपना ईमेल लिखें" : "Enter your email",
    password: hi ? "पासवर्ड" : "Password",
    passwordHint: hi ? "कम से कम 8 अक्षर" : "Minimum 8 characters",
    show: hi ? "दिखाएं" : "Show",
    hide: hi ? "छिपाएं" : "Hide",
    wait: hi ? "कृपया प्रतीक्षा करें..." : "Please wait...",
    createButton: hi ? "मेरा खाता बनाएं →" : "Create My Account →",
    loginButton: hi ? "लॉगिन करें →" : "Sign In →",
    divider: hi ? "स्वस्थ जीवन की शुरुआत यहां से" : "HEALTH STARTS HERE",
    already: hi ? "क्या आपका पहले से खाता है?" : "Already have an account?",
    newUser: hi ? "HealthMate पर नए हैं?" : "New to HealthMate?",
    login: hi ? "लॉगिन" : "Login",
    createAccount: hi ? "खाता बनाएं" : "Create Account",
    privacy: hi
      ? "आपके खाते की जानकारी निजी रहनी चाहिए।"
      : "Your account information should remain private.",
    error: hi
      ? "कुछ गलत हुआ। कृपया दोबारा कोशिश करें।"
      : "Something went wrong. Please try again."
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post(
        isRegister ? "/auth/register" : "/auth/login",
        form
      );

      login(data);
      nav("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        words.error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <section className="auth-info">

        <div className="brand-logo">
          <span>✚</span> HealthMate
        </div>

        <div className="auth-info-content">

          <span className="welcome-tag">
            ✨ {words.personalHealth}
          </span>

          <h1>
            {words.yourHealth}
            <br />
            {words.our} <span>{words.priority}</span>
          </h1>

          <p>{words.intro}</p>

          <div className="health-features">
            <div>💙 {words.tracking}</div>
            <div>🤖 {words.assistant}</div>
            <div>🌿 {words.insights}</div>
          </div>

        </div>

        <p className="auth-copyright">
          © 2026 HealthMate · {words.matters}
        </p>

      </section>

      <section className="auth-form-section">

        <form className="card auth" onSubmit={submit}>

          <div className="auth-icon">
            {isRegister ? "🌱" : "👋"}
          </div>

          <h2>
            {isRegister ? words.create : words.welcome}
          </h2>

          <p className="auth-subtitle">
            {isRegister
              ? words.registerSubtitle
              : words.loginSubtitle}
          </p>

          {isRegister && (
            <label className="auth-field">
              {words.name}

              <input
                name="name"
                type="text"
                placeholder={words.enterName}
                value={form.name}
                onChange={change}
                required
              />
            </label>
          )}

          <label className="auth-field">
            {words.email}

            <input
              name="email"
              type="email"
              placeholder={words.enterEmail}
              value={form.email}
              onChange={change}
              required
            />
          </label>

          <label className="auth-field">
            {words.password}

            <div className="password-wrapper">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={words.passwordHint}
                minLength={8}
                value={form.password}
                onChange={change}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? words.hide : words.show}
              </button>
            </div>
          </label>

          {error && (
            <p className="error auth-error">{error}</p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? words.wait
              : isRegister
                ? words.createButton
                : words.loginButton}
          </button>

          <div className="auth-divider">
            <span>{words.divider}</span>
          </div>

          <p className="auth-switch">
            {isRegister ? words.already : words.newUser}

            {" "}

            <Link to={isRegister ? "/login" : "/register"}>
              {isRegister ? words.login : words.createAccount}
            </Link>
          </p>

          <p className="auth-security">
            🔒 {words.privacy}
          </p>

        </form>

      </section>

    </div>
  );
}
